package config

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	DatabaseURL                  string
	Port                         string
	JWTSecret                    string
	Environment                  string
	TrustedProxies               string
	AllowedOrigins               []string
	TurnstileSecretKey           string
	ContactRateLimitWindowMinute int
	ContactRateLimitMaxPerWindow int
	ContactRateLimitMaxPerDay    int
	ContactMinSubmitSeconds      int
	ContactDuplicateWindowHours  int
}

func Load() *Config {
	allowedOrigins := parseCSVEnv("ALLOWED_ORIGINS")
	if frontendURL := normalizeOrigin(os.Getenv("FRONTEND_URL")); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	return &Config{
		DatabaseURL:                  getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/portfolio?sslmode=disable"),
		Port:                         getEnv("PORT", "8080"),
		JWTSecret:                    getEnv("JWT_SECRET", "your-secret-key"),
		Environment:                  getEnv("ENVIRONMENT", "development"),
		TrustedProxies:               getEnv("TRUSTED_PROXIES", ""),
		AllowedOrigins:               uniqueValues(allowedOrigins),
		TurnstileSecretKey:           strings.TrimSpace(getEnv("TURNSTILE_SECRET_KEY", "")),
		ContactRateLimitWindowMinute: getEnvInt("CONTACT_RATE_LIMIT_WINDOW_MINUTES", 10),
		ContactRateLimitMaxPerWindow: getEnvInt("CONTACT_RATE_LIMIT_MAX_PER_WINDOW", 3),
		ContactRateLimitMaxPerDay:    getEnvInt("CONTACT_RATE_LIMIT_MAX_PER_DAY", 20),
		ContactMinSubmitSeconds:      getEnvInt("CONTACT_MIN_SUBMIT_SECONDS", 3),
		ContactDuplicateWindowHours:  getEnvInt("CONTACT_DUPLICATE_WINDOW_HOURS", 24),
	}
}

func parseCSVEnv(key string) []string {
	raw := strings.TrimSpace(os.Getenv(key))
	if raw == "" {
		return nil
	}

	parts := strings.Split(raw, ",")
	values := make([]string, 0, len(parts))
	for _, part := range parts {
		normalized := normalizeOrigin(part)
		if normalized != "" {
			values = append(values, normalized)
		}
	}

	return values
}

func uniqueValues(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	unique := make([]string, 0, len(values))

	for _, value := range values {
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		unique = append(unique, value)
	}

	return unique
}

func normalizeOrigin(origin string) string {
	trimmed := strings.TrimSpace(origin)
	if trimmed == "" {
		return ""
	}

	noTrailingSlash := strings.TrimRight(trimmed, "/")
	if noTrailingSlash == "*" {
		return noTrailingSlash
	}

	if strings.HasPrefix(noTrailingSlash, "http://") || strings.HasPrefix(noTrailingSlash, "https://") {
		return noTrailingSlash
	}

	return "https://" + noTrailingSlash
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	raw := strings.TrimSpace(os.Getenv(key))
	if raw == "" {
		return defaultValue
	}

	value, err := strconv.Atoi(raw)
	if err != nil {
		return defaultValue
	}

	return value
}
