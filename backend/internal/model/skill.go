package model

import "time"

// Skill - no longer needs UserID since single admin
type Skill struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Icon        string    `json:"icon"`
	Proficiency int       `json:"proficiency"`
	Category    string    `json:"category"`
	SortOrder   int       `json:"sortOrder"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateSkillRequest struct {
	Name        string `json:"name" binding:"required"`
	Icon        string `json:"icon"`
	Proficiency int    `json:"proficiency" binding:"required,min=0,max=100"`
	Category    string `json:"category"`
	SortOrder   int    `json:"sortOrder"`
}

type UpdateSkillRequest struct {
	Name        string `json:"name"`
	Icon        string `json:"icon"`
	Proficiency int    `json:"proficiency"`
	Category    string `json:"category"`
	SortOrder   int    `json:"sortOrder"`
}
