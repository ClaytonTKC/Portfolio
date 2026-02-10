package handler

import (
	"context"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

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
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	skills, err := h.repo.GetSkills(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch skills"})
		return
	}
	projects, err := h.repo.GetProjects(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}
	experience, err := h.repo.GetExperiences(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch experience"})
		return
	}
	education, err := h.repo.GetEducation(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch education"})
		return
	}
	hobbies, err := h.repo.GetHobbies(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch hobbies"})
		return
	}
	testimonials, err := h.repo.GetApprovedTestimonials(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch testimonials"})
		return
	}

	portfolio := gin.H{
		"skills":       skills,
		"projects":     projects,
		"experience":   experience,
		"education":    education,
		"hobbies":      hobbies,
		"testimonials": testimonials,
	}
	c.JSON(http.StatusOK, portfolio)
}

// Skills CRUD
func (h *PortfolioHandler) GetSkills(c *gin.Context) {
	skills, err := h.repo.GetSkills(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, skills)
}

func (h *PortfolioHandler) CreateSkill(c *gin.Context) {
	var req model.CreateSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	skill := model.Skill{
		Name:            req.Name,
		Icon:            req.Icon,
		Proficiency:     req.Proficiency,
		Category:        req.Category,
		SortOrder:       req.SortOrder,
		ShowInPortfolio: req.ShowInPortfolio,
	}
	createdSkill, err := h.repo.CreateSkill(c.Request.Context(), skill)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdSkill)
}

func (h *PortfolioHandler) UpdateSkill(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	skill := model.Skill{
		ID:              id,
		Name:            req.Name,
		Icon:            req.Icon,
		Proficiency:     req.Proficiency,
		Category:        req.Category,
		SortOrder:       req.SortOrder,
		ShowInPortfolio: req.ShowInPortfolio,
	}
	updatedSkill, err := h.repo.UpdateSkill(c.Request.Context(), skill)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedSkill)
}

func (h *PortfolioHandler) DeleteSkill(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteSkill(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Skill deleted", "id": id})
}

// Projects CRUD
func (h *PortfolioHandler) GetProjects(c *gin.Context) {
	projects, err := h.repo.GetProjects(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *PortfolioHandler) CreateProject(c *gin.Context) {
	var req model.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	project := model.Project{
		Title:         req.Title,
		TitleFr:       req.TitleFr,
		Description:   req.Description,
		DescriptionFr: req.DescriptionFr,
		ImageURL:      req.ImageURL,
		LiveURL:       req.LiveURL,
		CodeURL:       req.CodeURL,
		Tags:          req.Tags,
		Featured:      req.Featured,
		SortOrder:     req.SortOrder,
	}
	createdProject, err := h.repo.CreateProject(c.Request.Context(), project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdProject)
}

func (h *PortfolioHandler) UpdateProject(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	project := model.Project{
		ID:            id,
		Title:         req.Title,
		TitleFr:       req.TitleFr,
		Description:   req.Description,
		DescriptionFr: req.DescriptionFr,
		ImageURL:      req.ImageURL,
		LiveURL:       req.LiveURL,
		CodeURL:       req.CodeURL,
		Tags:          req.Tags,
		Featured:      req.Featured,
		SortOrder:     req.SortOrder,
	}
	updatedProject, err := h.repo.UpdateProject(c.Request.Context(), project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedProject)
}

func (h *PortfolioHandler) DeleteProject(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteProject(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted", "id": id})
}

// Experience CRUD
func (h *PortfolioHandler) GetExperience(c *gin.Context) {
	exps, err := h.repo.GetExperiences(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, exps)
}

func (h *PortfolioHandler) CreateExperience(c *gin.Context) {
	var req model.CreateExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	startDate, _ := time.Parse("2006-01-02", req.StartDate)
	var endDate time.Time
	if req.EndDate != "" {
		endDate, _ = time.Parse("2006-01-02", req.EndDate)
	}

	exp := model.Experience{
		Title:         req.Title,
		TitleFr:       req.TitleFr,
		Company:       req.Company,
		CompanyFr:     req.CompanyFr,
		Location:      req.Location,
		LocationFr:    req.LocationFr,
		StartDate:     startDate,
		EndDate:       endDate,
		Current:       req.Current,
		Description:   req.Description,
		DescriptionFr: req.DescriptionFr,
		SortOrder:     req.SortOrder,
	}

	createdExp, err := h.repo.CreateExperience(c.Request.Context(), exp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdExp)
}

func (h *PortfolioHandler) UpdateExperience(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var startDate, endDate time.Time
	if req.StartDate != "" {
		startDate, _ = time.Parse("2006-01-02", req.StartDate)
	}
	if req.EndDate != "" {
		endDate, _ = time.Parse("2006-01-02", req.EndDate)
	}

	exp := model.Experience{
		ID:            id,
		Title:         req.Title,
		TitleFr:       req.TitleFr,
		Company:       req.Company,
		CompanyFr:     req.CompanyFr,
		Location:      req.Location,
		LocationFr:    req.LocationFr,
		StartDate:     startDate,
		EndDate:       endDate,
		Current:       req.Current,
		Description:   req.Description,
		DescriptionFr: req.DescriptionFr,
		SortOrder:     req.SortOrder,
	}

	updatedExp, err := h.repo.UpdateExperience(c.Request.Context(), exp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedExp)
}

func (h *PortfolioHandler) DeleteExperience(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteExperience(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Experience deleted", "id": id})
}

// Education CRUD
func (h *PortfolioHandler) GetEducation(c *gin.Context) {
	edus, err := h.repo.GetEducation(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, edus)
}

func (h *PortfolioHandler) CreateEducation(c *gin.Context) {
	var req model.CreateEducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, _ := time.Parse("2006-01-02", req.StartDate)
	var endDate time.Time
	if req.EndDate != "" {
		endDate, _ = time.Parse("2006-01-02", req.EndDate)
	}

	edu := model.Education{
		Degree:        req.Degree,
		DegreeFr:      req.DegreeFr,
		School:        req.School,
		SchoolFr:      req.SchoolFr,
		Location:      req.Location,
		LocationFr:    req.LocationFr,
		StartDate:     startDate,
		EndDate:       endDate,
		Description:   req.Description,
		DescriptionFr: req.DescriptionFr,
		SortOrder:     req.SortOrder,
	}

	createdEdu, err := h.repo.CreateEducation(c.Request.Context(), edu)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdEdu)
}

func (h *PortfolioHandler) UpdateEducation(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateEducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var startDate, endDate time.Time
	if req.StartDate != "" {
		startDate, _ = time.Parse("2006-01-02", req.StartDate)
	}
	if req.EndDate != "" {
		endDate, _ = time.Parse("2006-01-02", req.EndDate)
	}

	edu := model.Education{
		ID:            id,
		Degree:        req.Degree,
		DegreeFr:      req.DegreeFr,
		School:        req.School,
		SchoolFr:      req.SchoolFr,
		Location:      req.Location,
		LocationFr:    req.LocationFr,
		StartDate:     startDate,
		EndDate:       endDate,
		Description:   req.Description,
		DescriptionFr: req.DescriptionFr,
		SortOrder:     req.SortOrder,
	}

	updatedEdu, err := h.repo.UpdateEducation(c.Request.Context(), edu)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedEdu)
}

func (h *PortfolioHandler) DeleteEducation(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteEducation(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Education deleted", "id": id})
}

// Hobbies CRUD
func (h *PortfolioHandler) GetHobbies(c *gin.Context) {
	hobbies, err := h.repo.GetHobbies(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, hobbies)
}

func (h *PortfolioHandler) CreateHobby(c *gin.Context) {
	var req model.CreateHobbyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hobby := model.Hobby{
		Name:        req.Name,
		Icon:        req.Icon,
		Description: req.Description,
		SortOrder:   req.SortOrder,
	}
	createdHobby, err := h.repo.CreateHobby(c.Request.Context(), hobby)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdHobby)
}

func (h *PortfolioHandler) UpdateHobby(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateHobbyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hobby := model.Hobby{
		ID:          id,
		Name:        req.Name,
		Icon:        req.Icon,
		Description: req.Description,
		SortOrder:   req.SortOrder,
	}
	updatedHobby, err := h.repo.UpdateHobby(c.Request.Context(), hobby)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedHobby)
}

func (h *PortfolioHandler) DeleteHobby(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteHobby(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Hobby deleted", "id": id})
}

// Testimonials
func (h *PortfolioHandler) GetApprovedTestimonials(c *gin.Context) {
	testimonials, err := h.repo.GetApprovedTestimonials(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, testimonials)
}

func (h *PortfolioHandler) GetAllTestimonials(c *gin.Context) {
	testimonials, err := h.repo.GetAllTestimonials(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
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
		AuthorName:  req.AuthorName,
		AuthorRole:  req.AuthorRole,
		AuthorEmail: req.AuthorEmail,
		Content:     req.Content,
		Rating:      req.Rating,
		Status:      "pending",
	}

	createdTestimonial, err := h.repo.CreateTestimonial(c.Request.Context(), testimonial)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdTestimonial)
}

func (h *PortfolioHandler) ApproveTestimonial(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.UpdateTestimonialStatus(c.Request.Context(), id, "approved"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial approved", "id": id, "status": "approved"})
}

func (h *PortfolioHandler) RejectTestimonial(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.UpdateTestimonialStatus(c.Request.Context(), id, "rejected"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial rejected", "id": id, "status": "rejected"})
}

func (h *PortfolioHandler) DeleteTestimonial(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteTestimonial(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial deleted", "id": id})
}

// Contact Messages
func (h *PortfolioHandler) SubmitMessage(c *gin.Context) {
	var req model.CreateMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	msg := model.Message{
		Name:    req.Name,
		Email:   req.Email,
		Subject: req.Subject,
		Content: req.Content,
		Read:    false,
	}

	createdMsg, err := h.repo.CreateMessage(c.Request.Context(), msg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdMsg)
}

func (h *PortfolioHandler) GetMessages(c *gin.Context) {
	messages, err := h.repo.GetMessages(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}

func (h *PortfolioHandler) MarkMessageRead(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.MarkMessageRead(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Message marked as read", "id": id})
}

func (h *PortfolioHandler) DeleteMessage(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteMessage(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Message deleted", "id": id})
}


func (h *PortfolioHandler) GetContactInfo(c *gin.Context) {
	info, err := h.repo.GetContactInfo(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contact info"})
		return
	}
	c.JSON(http.StatusOK, info)
}

// Resume Handlers
func (h *PortfolioHandler) UploadResume(c *gin.Context) {
	lang := c.Query("lang")
	if lang != "en" && lang != "fr" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid language. Must be 'en' or 'fr'"})
		return
	}

	file, err := c.FormFile("resume")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Validate file extension
	ext := filepath.Ext(file.Filename)
	if strings.ToLower(ext) != ".pdf" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only PDF files are allowed."})
		return
	}

	// Ensure uploads directory exists
	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
		os.Mkdir("./uploads", 0755)
	}

	filename := "resume_" + lang + ".pdf"
	filepath := "./uploads/" + filename

	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resume uploaded successfully", "lang": lang})
}

func (h *PortfolioHandler) GetResume(c *gin.Context) {
	lang := c.Query("lang")
	if lang == "" {
		lang = "en" // Default to English
	}
	
	if lang != "en" && lang != "fr" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid language. Must be 'en' or 'fr'"})
		return
	}

	filename := "resume_" + lang + ".pdf"
	targetPath := "./uploads/" + filename

	// Check if file exists
	if _, err := os.Stat(targetPath); os.IsNotExist(err) {
		pwd, _ := os.Getwd()
		absPath, _ := filepath.Abs(targetPath)
		c.JSON(http.StatusNotFound, gin.H{
			"error":    "Resume not found",
			"rel_path": targetPath,
			"abs_path": absPath,
			"pwd":      pwd,
			"os_err":   err.Error(),
		})
		return
	}

	c.File(targetPath)
}

func (h *PortfolioHandler) UploadProfilePicture(c *gin.Context) {
	file, err := c.FormFile("profile_picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Ensure uploads directory exists
	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, 0755)
	}

	// Delete any existing profile pictures to avoid conflicts or stale images
	extensions := []string{".jpg", ".jpeg", ".png", ".webp"}
	for _, ext := range extensions {
		path := filepath.Join(uploadDir, "profile_picture"+ext)
		if _, err := os.Stat(path); err == nil {
			os.Remove(path)
		}
	}

	// Save as profile.jpg (or original extension, but fixed name for simplicity)
	// For simplicity, we'll force it to be profile.jpg or keep extension but limit to one active profile pic
	// Let's stick to a fixed name 'profile_picture.jpg' for now to easily overwrite
	ext := filepath.Ext(file.Filename)
	filename := "profile_picture" + ext
	filepath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile picture uploaded successfully", "filename": filename})
}

func (h *PortfolioHandler) GetProfilePicture(c *gin.Context) {
	// Try to find profile picture with common extensions
	uploadDir := "./uploads"
	extensions := []string{".jpg", ".jpeg", ".png", ".webp"}

	var targetPath string
	found := false

	for _, ext := range extensions {
		path := filepath.Join(uploadDir, "profile_picture"+ext)
		if _, err := os.Stat(path); err == nil {
			targetPath = path
			found = true
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile picture not found"})
		return
	}

	c.File(targetPath)
}
