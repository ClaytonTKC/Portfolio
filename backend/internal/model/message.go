package model

import "time"

type Message struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Subject     string    `json:"subject"`
	Content     string    `json:"content"`
	ContentHash string    `json:"-"`
	Read        bool      `json:"read"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CreateMessageRequest struct {
	Name           string `json:"name" binding:"required,min=2,max=120"`
	Email          string `json:"email" binding:"required,email,max=255"`
	Subject        string `json:"subject" binding:"required,max=255"`
	Content        string `json:"content" binding:"required,min=10,max=4000"`
	Website        string `json:"website"`
	SubmittedAtMs  int64  `json:"submittedAtMs"`
	TurnstileToken string `json:"turnstileToken"`
}
