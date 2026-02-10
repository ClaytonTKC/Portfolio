package main

import (
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/portfolio/backend/internal/config"
	"github.com/portfolio/backend/internal/handler"
	"github.com/portfolio/backend/internal/middleware"
	"github.com/portfolio/backend/internal/repository/postgres"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := postgres.NewConnection(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize repository
	repo := postgres.NewRepository(db)

	// Initialize handlers
	healthHandler := handler.NewHealthHandler()
	adminHandler := handler.NewAdminHandler(repo)
	portfolioHandler := handler.NewPortfolioHandler(repo)

	// Initialize router
	r := gin.Default()
	
	if cfg.TrustedProxies != "" {
		r.SetTrustedProxies(strings.Split(cfg.TrustedProxies, ","))
	} else {
		r.SetTrustedProxies(nil)
	}

	// Initialize auth
	middleware.InitAuth(cfg)

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API routes
	api := r.Group("/api")
	{
		// Health check
		api.GET("/health", healthHandler.Health)

		// Public routes - anyone can access
		public := api.Group("/public")
		{
			// Get full portfolio data
			public.GET("/portfolio", portfolioHandler.GetPortfolio)
			
			// Individual sections
			public.GET("/skills", portfolioHandler.GetSkills)
			public.GET("/projects", portfolioHandler.GetProjects)
			public.GET("/experience", portfolioHandler.GetExperience)
			public.GET("/education", portfolioHandler.GetEducation)
			public.GET("/hobbies", portfolioHandler.GetHobbies)
			public.GET("/testimonials", portfolioHandler.GetApprovedTestimonials)
			
			// Submit testimonial (pending approval)
			public.POST("/testimonials", portfolioHandler.SubmitTestimonial)
			
			// Submit contact message
			public.POST("/contact", portfolioHandler.SubmitMessage)

			// Get contact info
			public.GET("/contact-info", portfolioHandler.GetContactInfo)

			// Download Resume
			public.GET("/resume", portfolioHandler.GetResume)
		}

		// Admin authentication
		api.POST("/admin/login", adminHandler.Login)

		// Admin routes (would need auth middleware in production)
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		{
			admin.GET("/profile", adminHandler.GetProfile)
			admin.GET("/contact-info", adminHandler.GetContactInfo)
			admin.PUT("/contact-info", adminHandler.UpdateContactInfo)
			
			// Resume Management
			admin.POST("/resume", portfolioHandler.UploadResume)

			// Skills management
			admin.POST("/skills", portfolioHandler.CreateSkill)
			admin.PUT("/skills/:id", portfolioHandler.UpdateSkill)
			admin.DELETE("/skills/:id", portfolioHandler.DeleteSkill)

			// Projects management
			admin.POST("/projects", portfolioHandler.CreateProject)
			admin.PUT("/projects/:id", portfolioHandler.UpdateProject)
			admin.DELETE("/projects/:id", portfolioHandler.DeleteProject)

			// Experience management
			admin.POST("/experience", portfolioHandler.CreateExperience)
			admin.PUT("/experience/:id", portfolioHandler.UpdateExperience)
			admin.DELETE("/experience/:id", portfolioHandler.DeleteExperience)

			// Education management
			admin.POST("/education", portfolioHandler.CreateEducation)
			admin.PUT("/education/:id", portfolioHandler.UpdateEducation)
			admin.DELETE("/education/:id", portfolioHandler.DeleteEducation)

			// Hobbies management
			admin.POST("/hobbies", portfolioHandler.CreateHobby)
			admin.PUT("/hobbies/:id", portfolioHandler.UpdateHobby)
			admin.DELETE("/hobbies/:id", portfolioHandler.DeleteHobby)

			// Testimonials management (approve/reject/delete)
			admin.GET("/testimonials", portfolioHandler.GetAllTestimonials)
			admin.PUT("/testimonials/:id/approve", portfolioHandler.ApproveTestimonial)
			admin.PUT("/testimonials/:id/reject", portfolioHandler.RejectTestimonial)
			admin.DELETE("/testimonials/:id", portfolioHandler.DeleteTestimonial)

			// Messages management
			admin.GET("/messages", portfolioHandler.GetMessages)
			admin.PUT("/messages/:id/read", portfolioHandler.MarkMessageRead)
			admin.DELETE("/messages/:id", portfolioHandler.DeleteMessage)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
