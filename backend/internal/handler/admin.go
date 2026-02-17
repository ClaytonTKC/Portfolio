package handler

import (
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/portfolio/backend/internal/config"
	"github.com/portfolio/backend/internal/middleware"
	"github.com/portfolio/backend/internal/model"
	"github.com/portfolio/backend/internal/repository/postgres"
)

type AdminHandler struct {
	repo            *postgres.Repository
	loginProtection *AdminLoginProtection
}

func NewAdminHandler(repo *postgres.Repository, cfg *config.Config) *AdminHandler {
	return &AdminHandler{
		repo:            repo,
		loginProtection: NewAdminLoginProtection(cfg),
	}
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req model.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now().UTC()
	clientIP := c.ClientIP()
	if remaining, blocked := h.loginProtection.GetBlockRemaining(clientIP, now); blocked {
		retryAfter := max(1, int(remaining.Seconds()))
		c.Header("Retry-After", strconv.Itoa(retryAfter))
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error":            "Too many failed login attempts. Try again in " + strconv.Itoa(retryAfter) + " seconds.",
			"retry_after_secs": retryAfter,
		})
		return
	}

	// Verify credentials against environment variables
	adminUser := os.Getenv("ADMIN_USER")
	adminPassword := os.Getenv("ADMIN_PASSWORD")

	if req.Email == adminUser && req.Password == adminPassword {
		h.loginProtection.RegisterSuccess(clientIP)

		user := &model.Admin{
			ID:    "admin-1",
			Email: req.Email,
			Name:  "Portfolio Admin",
		}

		token, err := middleware.GenerateToken(user, time.Hour)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		response := model.AdminLoginResponse{
			Token: token,
			Admin: *user,
		}
		c.JSON(http.StatusOK, response)
		return
	}

	if remaining, blocked := h.loginProtection.RegisterFailure(clientIP, now); blocked {
		retryAfter := max(1, int(remaining.Seconds()))
		c.Header("Retry-After", strconv.Itoa(retryAfter))
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error":            "Too many failed login attempts. Try again in " + strconv.Itoa(retryAfter) + " seconds.",
			"retry_after_secs": retryAfter,
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}

func (h *AdminHandler) GetProfile(c *gin.Context) {
	// Placeholder - would fetch from database
	admin := model.Admin{
		ID:    "admin-1",
		Email: "admin@portfolio.com",
		Name:  "Portfolio Admin",
	}
	c.JSON(http.StatusOK, admin)
}


func (h *AdminHandler) GetContactInfo(c *gin.Context) {
	info, err := h.repo.GetContactInfo(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contact info"})
		return
	}
	c.JSON(http.StatusOK, info)
}

func (h *AdminHandler) UpdateContactInfo(c *gin.Context) {
	var req model.UpdateContactInfoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	info := model.ContactInfo{
		Email:    req.Email,
		Phone:    req.Phone,
		Location: req.Location,
		LinkedIn: req.LinkedIn,
		GitHub:   req.GitHub,
		Twitter:  req.Twitter,
		Website:  req.Website,
	}

	updated, err := h.repo.UpdateContactInfo(c.Request.Context(), info)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contact info"})
		return
	}
	
	c.JSON(http.StatusOK, updated)
}
