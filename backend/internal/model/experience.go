package model

import "time"

// Experience - no longer needs UserID since single admin
type Experience struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Company     string    `json:"company"`
	Location    string    `json:"location"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Current     bool      `json:"current"`
	Description []string  `json:"description"`
	SortOrder   int       `json:"sortOrder"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateExperienceRequest struct {
	Title       string   `json:"title" binding:"required"`
	Company     string   `json:"company" binding:"required"`
	Location    string   `json:"location"`
	StartDate   string   `json:"startDate" binding:"required"`
	EndDate     string   `json:"endDate"`
	Current     bool     `json:"current"`
	Description []string `json:"description"`
	SortOrder   int      `json:"sortOrder"`
}

type UpdateExperienceRequest struct {
	Title       string   `json:"title"`
	Company     string   `json:"company"`
	Location    string   `json:"location"`
	StartDate   string   `json:"startDate"`
	EndDate     string   `json:"endDate"`
	Current     bool     `json:"current"`
	Description []string `json:"description"`
	SortOrder   int      `json:"sortOrder"`
}
