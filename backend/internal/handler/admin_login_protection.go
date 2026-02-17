package handler

import (
	"strings"
	"sync"
	"time"

	"github.com/portfolio/backend/internal/config"
)

type AdminLoginProtection struct {
	mu            sync.Mutex
	attempts      map[string]*adminLoginAttempt
	maxAttempts   int
	blockDuration time.Duration
	attemptWindow time.Duration
}

type adminLoginAttempt struct {
	failedCount  int
	lastFailedAt time.Time
	blockedUntil time.Time
	lastSeenAt   time.Time
}

func NewAdminLoginProtection(cfg *config.Config) *AdminLoginProtection {
	maxAttempts := max(1, cfg.AdminLoginMaxAttempts)

	blockDuration := time.Duration(cfg.AdminLoginBlockMinutes) * time.Minute
	if blockDuration <= 0 {
		blockDuration = 15 * time.Minute
	}

	attemptWindow := time.Duration(cfg.AdminLoginAttemptWindowMinutes) * time.Minute
	if attemptWindow <= 0 {
		attemptWindow = 15 * time.Minute
	}

	return &AdminLoginProtection{
		attempts:      make(map[string]*adminLoginAttempt),
		maxAttempts:   maxAttempts,
		blockDuration: blockDuration,
		attemptWindow: attemptWindow,
	}
}

func (p *AdminLoginProtection) GetBlockRemaining(clientIP string, now time.Time) (time.Duration, bool) {
	p.mu.Lock()
	defer p.mu.Unlock()

	key := normalizeClientIP(clientIP)
	p.cleanupLocked(now)

	entry, exists := p.attempts[key]
	if !exists || !entry.blockedUntil.After(now) {
		return 0, false
	}

	entry.lastSeenAt = now
	return entry.blockedUntil.Sub(now), true
}

func (p *AdminLoginProtection) RegisterFailure(clientIP string, now time.Time) (time.Duration, bool) {
	p.mu.Lock()
	defer p.mu.Unlock()

	key := normalizeClientIP(clientIP)
	p.cleanupLocked(now)

	entry, exists := p.attempts[key]
	if !exists {
		entry = &adminLoginAttempt{}
		p.attempts[key] = entry
	}

	// Already blocked.
	if entry.blockedUntil.After(now) {
		entry.lastSeenAt = now
		return entry.blockedUntil.Sub(now), true
	}

	// Reset rolling failure count if outside the configured window.
	if !entry.lastFailedAt.IsZero() && now.Sub(entry.lastFailedAt) > p.attemptWindow {
		entry.failedCount = 0
	}

	entry.failedCount++
	entry.lastFailedAt = now
	entry.lastSeenAt = now

	if entry.failedCount >= p.maxAttempts {
		entry.blockedUntil = now.Add(p.blockDuration)
		entry.failedCount = 0
		return p.blockDuration, true
	}

	return 0, false
}

func (p *AdminLoginProtection) RegisterSuccess(clientIP string) {
	p.mu.Lock()
	defer p.mu.Unlock()

	delete(p.attempts, normalizeClientIP(clientIP))
}

func (p *AdminLoginProtection) cleanupLocked(now time.Time) {
	staleThreshold := now.Add(-72 * time.Hour)
	for key, entry := range p.attempts {
		if entry.lastSeenAt.Before(staleThreshold) {
			delete(p.attempts, key)
		}
	}
}

func normalizeClientIP(clientIP string) string {
	normalized := strings.TrimSpace(clientIP)
	if normalized == "" {
		return "unknown"
	}
	return normalized
}

