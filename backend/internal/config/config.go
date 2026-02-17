package config

import (
	"os"
	"strings"
)

type Config struct {
	DatabaseURL    string
	Port           string
	JWTSecret      string
	Environment    string
	TrustedProxies string
	AllowedOrigins []string
}

func Load() *Config {
	allowedOrigins := parseCSVEnv("ALLOWED_ORIGINS")
	if frontendURL := normalizeOrigin(os.Getenv("FRONTEND_URL")); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	return &Config{
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/portfolio?sslmode=disable"),
		Port:           getEnv("PORT", "8080"),
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key"),
		Environment:    getEnv("ENVIRONMENT", "development"),
		TrustedProxies: getEnv("TRUSTED_PROXIES", ""),
		AllowedOrigins: uniqueValues(allowedOrigins),
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
