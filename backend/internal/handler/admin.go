package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/portfolio/backend/internal/model"
	"github.com/portfolio/backend/internal/repository/postgres"
)

type AdminHandler struct {
	repo *postgres.Repository
}

func NewAdminHandler(repo *postgres.Repository) *AdminHandler {
	return &AdminHandler{repo: repo}
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req model.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Placeholder - would verify credentials against database
	// For now, using placeholder credentials
	if req.Email == "admin@portfolio.com" && req.Password == "admin123" {
		response := model.AdminLoginResponse{
			Token: "placeholder-jwt-token",
			Admin: model.Admin{
				ID:    "admin-1",
				Email: req.Email,
				Name:  "Portfolio Admin",
			},
		}
		c.JSON(http.StatusOK, response)
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
	// Placeholder
	info := model.ContactInfo{
		ID:       "1",
		Email:    "claudio@portfolio.com",
		Phone:    "+1 234 567 8900",
		Location: "Montreal, Quebec, Canada",
		LinkedIn: "johndoe",
		GitHub:   "johndoe",
		Twitter:  "johndoe",
	}
	c.JSON(http.StatusOK, info)
}

func (h *AdminHandler) UpdateContactInfo(c *gin.Context) {
	var req model.UpdateContactInfoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Placeholder - would update in database
	info := model.ContactInfo{
		ID:       "1",
		Email:    req.Email,
		Phone:    req.Phone,
		Location: req.Location,
		LinkedIn: req.LinkedIn,
		GitHub:   req.GitHub,
		Twitter:  req.Twitter,
	}
	c.JSON(http.StatusOK, info)
}
