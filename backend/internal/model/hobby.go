package model

import "time"

type Hobby struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Icon        string    `json:"icon"`
	Description string    `json:"description"`
	SortOrder   int       `json:"sortOrder"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateHobbyRequest struct {
	Name        string `json:"name" binding:"required"`
	Icon        string `json:"icon"`
	Description string `json:"description"`
	SortOrder   int    `json:"sortOrder"`
}

type UpdateHobbyRequest struct {
	Name        string `json:"name"`
	Icon        string `json:"icon"`
	Description string `json:"description"`
	SortOrder   int    `json:"sortOrder"`
}
