package model

import "time"

// Admin represents the single admin user
type Admin struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AdminLoginResponse struct {
	Token string `json:"token"`
	Admin Admin  `json:"admin"`
}

// ContactInfo represents the portfolio owner's contact information
type ContactInfo struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Location  string    `json:"location"`
	LinkedIn  string    `json:"linkedin"`
	GitHub    string    `json:"github"`
	Twitter   string    `json:"twitter"`
	Website   string    `json:"website"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type UpdateContactInfoRequest struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Location string `json:"location"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`
	Twitter  string `json:"twitter"`
	Website  string `json:"website"`
}
