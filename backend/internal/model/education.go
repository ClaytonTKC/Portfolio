package model

import "time"

// Education - no longer needs UserID since single admin
type Education struct {
	ID          string    `json:"id"`
	Degree      string    `json:"degree"`
	School      string    `json:"school"`
	Location    string    `json:"location"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Description string    `json:"description"`
	SortOrder   int       `json:"sortOrder"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateEducationRequest struct {
	Degree      string `json:"degree" binding:"required"`
	School      string `json:"school" binding:"required"`
	Location    string `json:"location"`
	StartDate   string `json:"startDate" binding:"required"`
	EndDate     string `json:"endDate"`
	Description string `json:"description"`
	SortOrder   int    `json:"sortOrder"`
}

type UpdateEducationRequest struct {
	Degree      string `json:"degree"`
	School      string `json:"school"`
	Location    string `json:"location"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Description string `json:"description"`
	SortOrder   int    `json:"sortOrder"`
}
