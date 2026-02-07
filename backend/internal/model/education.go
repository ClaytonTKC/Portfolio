package model

import "time"

// Education - no longer needs UserID since single admin
type Education struct {
	ID            string    `json:"id"`
	Degree        string    `json:"degree"`
	DegreeFr      string    `json:"degreeFr"`      // Added French Degree
	School        string    `json:"school"`
	SchoolFr      string    `json:"schoolFr"`      // Added French School
	Location      string    `json:"location"`
	LocationFr    string    `json:"locationFr"`    // Added French Location
	StartDate     time.Time `json:"startDate"`
	EndDate       time.Time `json:"endDate"`
	Description   string    `json:"description"`
	DescriptionFr string    `json:"descriptionFr"` // Added French Description
	SortOrder     int       `json:"sortOrder"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type CreateEducationRequest struct {
	Degree        string `json:"degree" binding:"required"`
	DegreeFr      string `json:"degreeFr"`
	School        string `json:"school" binding:"required"`
	SchoolFr      string `json:"schoolFr"`
	Location      string `json:"location"`
	LocationFr    string `json:"locationFr"`
	StartDate     string `json:"startDate" binding:"required"`
	EndDate       string `json:"endDate"`
	Description   string `json:"description"`
	DescriptionFr string `json:"descriptionFr"`
	SortOrder     int    `json:"sortOrder"`
}

type UpdateEducationRequest struct {
	Degree        string `json:"degree"`
	DegreeFr      string `json:"degreeFr"`
	School        string `json:"school"`
	SchoolFr      string `json:"schoolFr"`
	Location      string `json:"location"`
	LocationFr    string `json:"locationFr"`
	StartDate     string `json:"startDate"`
	EndDate       string `json:"endDate"`
	Description   string `json:"description"`
	DescriptionFr string `json:"descriptionFr"`
	SortOrder     int    `json:"sortOrder"`
}
