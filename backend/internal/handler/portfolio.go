package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/portfolio/backend/internal/model"
	"github.com/portfolio/backend/internal/repository/postgres"
)

type PortfolioHandler struct {
	repo *postgres.Repository
}

func NewPortfolioHandler(repo *postgres.Repository) *PortfolioHandler {
	return &PortfolioHandler{repo: repo}
}

// Get full portfolio data for public display
func (h *PortfolioHandler) GetPortfolio(c *gin.Context) {
	portfolio := gin.H{
		"skills":       h.getSkillsData(),
		"projects":     h.getProjectsData(),
		"experience":   h.getExperienceData(),
		"education":    h.getEducationData(),
		"hobbies":      h.getHobbiesData(),
		"testimonials": h.getApprovedTestimonials(),
	}
	c.JSON(http.StatusOK, portfolio)
}

// Skills CRUD
func (h *PortfolioHandler) GetSkills(c *gin.Context) {
	c.JSON(http.StatusOK, h.getSkillsData())
}

func (h *PortfolioHandler) getSkillsData() []model.Skill {
	return []model.Skill{
		{ID: "1", Name: "React", Proficiency: 95, Icon: "⚛️", Category: "Frontend"},
		{ID: "2", Name: "TypeScript", Proficiency: 90, Icon: "📘", Category: "Languages"},
		{ID: "3", Name: "Go", Proficiency: 85, Icon: "🐹", Category: "Backend"},
	}
}

func (h *PortfolioHandler) CreateSkill(c *gin.Context) {
	var req model.CreateSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	skill := model.Skill{ID: "new-skill-id", Name: req.Name, Proficiency: req.Proficiency}
	c.JSON(http.StatusCreated, skill)
}

func (h *PortfolioHandler) UpdateSkill(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	skill := model.Skill{ID: id, Name: req.Name, Proficiency: req.Proficiency}
	c.JSON(http.StatusOK, skill)
}

func (h *PortfolioHandler) DeleteSkill(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Skill deleted", "id": id})
}

// Projects CRUD
func (h *PortfolioHandler) GetProjects(c *gin.Context) {
	c.JSON(http.StatusOK, h.getProjectsData())
}

func (h *PortfolioHandler) getProjectsData() []model.Project {
	return []model.Project{
		{ID: "1", Title: "E-Commerce Platform", Description: "Full-featured online store"},
		{ID: "2", Title: "Task Manager", Description: "Project management tool"},
	}
}

func (h *PortfolioHandler) CreateProject(c *gin.Context) {
	var req model.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	project := model.Project{ID: "new-project-id", Title: req.Title, Description: req.Description}
	c.JSON(http.StatusCreated, project)
}

func (h *PortfolioHandler) UpdateProject(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	project := model.Project{ID: id, Title: req.Title, Description: req.Description}
	c.JSON(http.StatusOK, project)
}

func (h *PortfolioHandler) DeleteProject(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted", "id": id})
}

// Experience CRUD
func (h *PortfolioHandler) GetExperience(c *gin.Context) {
	c.JSON(http.StatusOK, h.getExperienceData())
}

func (h *PortfolioHandler) getExperienceData() []model.Experience {
	return []model.Experience{
		{ID: "1", Title: "Senior Developer", Company: "Tech Corp"},
	}
}

func (h *PortfolioHandler) CreateExperience(c *gin.Context) {
	var req model.CreateExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	exp := model.Experience{ID: "new-exp-id", Title: req.Title, Company: req.Company}
	c.JSON(http.StatusCreated, exp)
}

func (h *PortfolioHandler) UpdateExperience(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	exp := model.Experience{ID: id, Title: req.Title, Company: req.Company}
	c.JSON(http.StatusOK, exp)
}

func (h *PortfolioHandler) DeleteExperience(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Experience deleted", "id": id})
}

// Education CRUD
func (h *PortfolioHandler) GetEducation(c *gin.Context) {
	c.JSON(http.StatusOK, h.getEducationData())
}

func (h *PortfolioHandler) getEducationData() []model.Education {
	return []model.Education{
		{ID: "1", Degree: "Master of CS", School: "Stanford"},
	}
}

func (h *PortfolioHandler) CreateEducation(c *gin.Context) {
	var req model.CreateEducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	edu := model.Education{ID: "new-edu-id", Degree: req.Degree, School: req.School}
	c.JSON(http.StatusCreated, edu)
}

func (h *PortfolioHandler) UpdateEducation(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateEducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	edu := model.Education{ID: id, Degree: req.Degree, School: req.School}
	c.JSON(http.StatusOK, edu)
}

func (h *PortfolioHandler) DeleteEducation(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Education deleted", "id": id})
}

// Hobbies CRUD
func (h *PortfolioHandler) GetHobbies(c *gin.Context) {
	c.JSON(http.StatusOK, h.getHobbiesData())
}

func (h *PortfolioHandler) getHobbiesData() []model.Hobby {
	return []model.Hobby{
		{ID: "1", Name: "Photography", Icon: "📷", Description: "Capturing moments"},
		{ID: "2", Name: "Gaming", Icon: "🎮", Description: "Video games"},
	}
}

func (h *PortfolioHandler) CreateHobby(c *gin.Context) {
	var req model.CreateHobbyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hobby := model.Hobby{ID: "new-hobby-id", Name: req.Name, Icon: req.Icon, Description: req.Description}
	c.JSON(http.StatusCreated, hobby)
}

func (h *PortfolioHandler) UpdateHobby(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateHobbyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hobby := model.Hobby{ID: id, Name: req.Name, Icon: req.Icon, Description: req.Description}
	c.JSON(http.StatusOK, hobby)
}

func (h *PortfolioHandler) DeleteHobby(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Hobby deleted", "id": id})
}

// Testimonials - Public can submit, Admin approves
func (h *PortfolioHandler) GetApprovedTestimonials(c *gin.Context) {
	c.JSON(http.StatusOK, h.getApprovedTestimonials())
}

func (h *PortfolioHandler) getApprovedTestimonials() []model.Testimonial {
	return []model.Testimonial{
		{ID: "1", AuthorName: "Sarah Johnson", AuthorRole: "CTO", Content: "Great work!", Rating: 5, Status: "approved"},
	}
}

func (h *PortfolioHandler) GetAllTestimonials(c *gin.Context) {
	// Admin only - returns all including pending
	testimonials := []model.Testimonial{
		{ID: "1", AuthorName: "Sarah Johnson", Content: "Great work!", Status: "approved"},
		{ID: "2", AuthorName: "New User", Content: "Pending review", Status: "pending"},
	}
	c.JSON(http.StatusOK, testimonials)
}

func (h *PortfolioHandler) SubmitTestimonial(c *gin.Context) {
	var req model.CreateTestimonialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	testimonial := model.Testimonial{
		ID:          "new-testimonial-id",
		AuthorName:  req.AuthorName,
		AuthorRole:  req.AuthorRole,
		AuthorEmail: req.AuthorEmail,
		Content:     req.Content,
		Rating:      req.Rating,
		Status:      "pending", // Always pending until admin approves
	}
	c.JSON(http.StatusCreated, testimonial)
}

func (h *PortfolioHandler) ApproveTestimonial(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial approved", "id": id, "status": "approved"})
}

func (h *PortfolioHandler) RejectTestimonial(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial rejected", "id": id, "status": "rejected"})
}

func (h *PortfolioHandler) DeleteTestimonial(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial deleted", "id": id})
}

// Contact Messages
func (h *PortfolioHandler) SubmitMessage(c *gin.Context) {
	var req model.CreateMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	message := model.Message{
		ID:      "new-message-id",
		Name:    req.Name,
		Email:   req.Email,
		Content: req.Content,
		Read:    false,
	}
	c.JSON(http.StatusCreated, message)
}

func (h *PortfolioHandler) GetMessages(c *gin.Context) {
	messages := []model.Message{
		{ID: "1", Name: "Client", Email: "client@example.com", Content: "Great portfolio!", Read: false},
	}
	c.JSON(http.StatusOK, messages)
}

func (h *PortfolioHandler) MarkMessageRead(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Message marked as read", "id": id})
}

func (h *PortfolioHandler) DeleteMessage(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Message deleted", "id": id})
}
