package model

import "time"

// Project - no longer needs UserID since single admin
type Project struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	TitleFr       string    `json:"titleFr"` // Added French Title
	Description   string    `json:"description"`
	DescriptionFr string    `json:"descriptionFr"` // Added French Description
	ImageURL      string    `json:"imageUrl"`
	LiveURL       string    `json:"liveUrl"`
	CodeURL       string    `json:"codeUrl"`
	Tags          []string  `json:"tags"`
	Featured      bool      `json:"featured"`
	SortOrder     int       `json:"sortOrder"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type CreateProjectRequest struct {
	Title         string   `json:"title" binding:"required"`
	TitleFr       string   `json:"titleFr"` // Added French Title
	Description   string   `json:"description" binding:"required"`
	DescriptionFr string   `json:"descriptionFr"` // Added French Description
	ImageURL      string   `json:"imageUrl"`
	LiveURL       string   `json:"liveUrl"`
	CodeURL       string   `json:"codeUrl"`
	Tags          []string `json:"tags"`
	Featured      bool     `json:"featured"`
	SortOrder     int      `json:"sortOrder"`
}

type UpdateProjectRequest struct {
	Title         string   `json:"title"`
	TitleFr       string   `json:"titleFr"` // Added French Title
	Description   string   `json:"description"`
	DescriptionFr string   `json:"descriptionFr"` // Added French Description
	ImageURL      string   `json:"imageUrl"`
	LiveURL       string   `json:"liveUrl"`
	CodeURL       string   `json:"codeUrl"`
	Tags          []string `json:"tags"`
	Featured      bool     `json:"featured"`
	SortOrder     int      `json:"sortOrder"`
}
