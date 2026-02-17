package handler

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/portfolio/backend/internal/config"
)

type MessageProtection struct {
	turnstileSecret string
	minSubmitDelay  time.Duration
	duplicateWindow time.Duration
	rateLimiter     *ipRateLimiter
	httpClient      *http.Client
}

type ipRateLimiter struct {
	mu          sync.Mutex
	entries     map[string]*ipRateEntry
	window      time.Duration
	maxInWindow int
	maxPerDay   int
}

type ipRateEntry struct {
	recentRequests []time.Time
	dayKey         string
	dayCount       int
	lastSeen       time.Time
}

func NewMessageProtection(cfg *config.Config) *MessageProtection {
	window := time.Duration(cfg.ContactRateLimitWindowMinute) * time.Minute
	if window <= 0 {
		window = 10 * time.Minute
	}

	minDelay := time.Duration(cfg.ContactMinSubmitSeconds) * time.Second
	if minDelay < 0 {
		minDelay = 0
	}

	duplicateWindow := time.Duration(cfg.ContactDuplicateWindowHours) * time.Hour
	if duplicateWindow <= 0 {
		duplicateWindow = 24 * time.Hour
	}

	return &MessageProtection{
		turnstileSecret: strings.TrimSpace(cfg.TurnstileSecretKey),
		minSubmitDelay:  minDelay,
		duplicateWindow: duplicateWindow,
		rateLimiter: &ipRateLimiter{
			entries:     make(map[string]*ipRateEntry),
			window:      window,
			maxInWindow: max(1, cfg.ContactRateLimitMaxPerWindow),
			maxPerDay:   max(1, cfg.ContactRateLimitMaxPerDay),
		},
		httpClient: &http.Client{Timeout: 6 * time.Second},
	}
}

func (p *MessageProtection) IsHoneypotTriggered(value string) bool {
	return strings.TrimSpace(value) != ""
}

func (p *MessageProtection) IsSubmissionTooFast(submittedAtMs int64, now time.Time) bool {
	if p.minSubmitDelay == 0 {
		return false
	}
	if submittedAtMs <= 0 {
		return true
	}

	submittedAt := time.UnixMilli(submittedAtMs)
	if submittedAt.After(now.Add(10 * time.Second)) {
		return true
	}

	return now.Sub(submittedAt) < p.minSubmitDelay
}

func (p *MessageProtection) Allow(clientIP string, now time.Time) bool {
	return p.rateLimiter.Allow(clientIP, now)
}

func (p *MessageProtection) DuplicateWindow() time.Duration {
	return p.duplicateWindow
}

func (p *MessageProtection) VerifyTurnstile(ctx context.Context, token, clientIP string) error {
	if p.turnstileSecret == "" {
		return nil
	}

	token = strings.TrimSpace(token)
	if token == "" {
		return errors.New("missing captcha token")
	}

	formData := url.Values{}
	formData.Set("secret", p.turnstileSecret)
	formData.Set("response", token)
	if strings.TrimSpace(clientIP) != "" {
		formData.Set("remoteip", clientIP)
	}

	request, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		strings.NewReader(formData.Encode()),
	)
	if err != nil {
		return fmt.Errorf("failed to create turnstile request: %w", err)
	}
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	response, err := p.httpClient.Do(request)
	if err != nil {
		return fmt.Errorf("turnstile request failed: %w", err)
	}
	defer response.Body.Close()

	var payload struct {
		Success    bool     `json:"success"`
		ErrorCodes []string `json:"error-codes"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		return fmt.Errorf("failed to decode turnstile response: %w", err)
	}

	if !payload.Success {
		if len(payload.ErrorCodes) > 0 {
			return fmt.Errorf("turnstile verification failed: %s", strings.Join(payload.ErrorCodes, ","))
		}
		return errors.New("turnstile verification failed")
	}

	return nil
}

func BuildMessageContentHash(email, subject, content string) string {
	normalized := strings.ToLower(strings.TrimSpace(email)) +
		"|" + normalizeText(subject) +
		"|" + normalizeText(content)
	sum := sha256.Sum256([]byte(normalized))
	return hex.EncodeToString(sum[:])
}

func normalizeText(value string) string {
	trimmed := strings.TrimSpace(strings.ToLower(value))
	if trimmed == "" {
		return ""
	}
	return strings.Join(strings.Fields(trimmed), " ")
}

func (l *ipRateLimiter) Allow(clientIP string, now time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	ip := strings.TrimSpace(clientIP)
	if ip == "" {
		ip = "unknown"
	}

	l.cleanup(now)

	entry, exists := l.entries[ip]
	if !exists {
		entry = &ipRateEntry{}
		l.entries[ip] = entry
	}

	cutoff := now.Add(-l.window)
	filtered := entry.recentRequests[:0]
	for _, timestamp := range entry.recentRequests {
		if !timestamp.Before(cutoff) {
			filtered = append(filtered, timestamp)
		}
	}
	entry.recentRequests = filtered

	currentDay := now.UTC().Format("2006-01-02")
	if entry.dayKey != currentDay {
		entry.dayKey = currentDay
		entry.dayCount = 0
	}

	if len(entry.recentRequests) >= l.maxInWindow {
		entry.lastSeen = now
		return false
	}
	if entry.dayCount >= l.maxPerDay {
		entry.lastSeen = now
		return false
	}

	entry.recentRequests = append(entry.recentRequests, now)
	entry.dayCount++
	entry.lastSeen = now

	return true
}

func (l *ipRateLimiter) cleanup(now time.Time) {
	staleThreshold := now.Add(-48 * time.Hour)
	for ip, entry := range l.entries {
		if entry.lastSeen.Before(staleThreshold) {
			delete(l.entries, ip)
		}
	}
}

