package model

import "time"

// Experience - no longer needs UserID since single admin
type Experience struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	TitleFr       string    `json:"titleFr"`       // Added French Title
	Company       string    `json:"company"`
	CompanyFr     string    `json:"companyFr"`     // Added French Company
	Location      string    `json:"location"`
	LocationFr    string    `json:"locationFr"`    // Added French Location
	StartDate     time.Time `json:"startDate"`
	EndDate       time.Time `json:"endDate"`
	Current       bool      `json:"current"`
	Description   []string  `json:"description"`
	DescriptionFr []string  `json:"descriptionFr"` // Added French Description
	SortOrder     int       `json:"sortOrder"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type CreateExperienceRequest struct {
	Title         string   `json:"title" binding:"required"`
	TitleFr       string   `json:"titleFr"`
	Company       string   `json:"company" binding:"required"`
	CompanyFr     string   `json:"companyFr"`
	Location      string   `json:"location"`
	LocationFr    string   `json:"locationFr"`
	StartDate     string   `json:"startDate" binding:"required"`
	EndDate       string   `json:"endDate"`
	Current       bool     `json:"current"`
	Description   []string `json:"description"`
	DescriptionFr []string `json:"descriptionFr"`
	SortOrder     int      `json:"sortOrder"`
}

type UpdateExperienceRequest struct {
	Title         string   `json:"title"`
	TitleFr       string   `json:"titleFr"`
	Company       string   `json:"company"`
	CompanyFr     string   `json:"companyFr"`
	Location      string   `json:"location"`
	LocationFr    string   `json:"locationFr"`
	StartDate     string   `json:"startDate"`
	EndDate       string   `json:"endDate"`
	Current       bool     `json:"current"`
	Description   []string `json:"description"`
	DescriptionFr []string `json:"descriptionFr"`
	SortOrder     int      `json:"sortOrder"`
}
