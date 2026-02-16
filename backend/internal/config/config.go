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
	return &Config{
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/portfolio?sslmode=disable"),
		Port:           getEnv("PORT", "8080"),
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key"),
		Environment:    getEnv("ENVIRONMENT", "development"),
		TrustedProxies: getEnv("TRUSTED_PROXIES", ""),
		AllowedOrigins: strings.Split(getEnv("ALLOWED_ORIGINS", ""), ","),
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
