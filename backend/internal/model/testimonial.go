package model

import "time"

// Testimonial - submitted by visitors, approved by admin
type Testimonial struct {
	ID           string    `json:"id"`
	AuthorName   string    `json:"authorName"`
	AuthorRole   string    `json:"authorRole"`
	AuthorEmail  string    `json:"authorEmail"`
	Content      string    `json:"content"`
	Rating       int       `json:"rating"`
	Status       string    `json:"status"` // pending, approved, rejected
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// CreateTestimonialRequest - submitted by public visitors
type CreateTestimonialRequest struct {
	AuthorName  string `json:"authorName" binding:"required"`
	AuthorRole  string `json:"authorRole"`
	AuthorEmail string `json:"authorEmail" binding:"required,email"`
	Content     string `json:"content" binding:"required"`
	Rating      int    `json:"rating" binding:"required,min=1,max=5"`
}

type UpdateTestimonialRequest struct {
	Status string `json:"status"` // For admin to approve/reject
}


