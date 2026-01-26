package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/portfolio/backend/internal/model"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewConnection(databaseURL string) (*pgxpool.Pool, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database config: %w", err)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test connection
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return pool, nil
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

// === Skills ===

func (r *Repository) GetSkills(ctx context.Context) ([]model.Skill, error) {
	query := `SELECT id, name, icon, proficiency, category, sort_order FROM skills ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var skills []model.Skill
	for rows.Next() {
		var s model.Skill
		if err := rows.Scan(&s.ID, &s.Name, &s.Icon, &s.Proficiency, &s.Category, &s.SortOrder); err != nil {
			return nil, err
		}
		skills = append(skills, s)
	}
	return skills, nil
}

func (r *Repository) CreateSkill(ctx context.Context, s model.Skill) (model.Skill, error) {
	query := `
		INSERT INTO skills (name, icon, proficiency, category, sort_order)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, s.Name, s.Icon, s.Proficiency, s.Category, s.SortOrder).Scan(&s.ID, &s.CreatedAt, &s.UpdatedAt)
	return s, err
}

// === Projects ===

func (r *Repository) GetProjects(ctx context.Context) ([]model.Project, error) {
	query := `SELECT id, title, description, image_url, live_url, code_url, tags, featured, sort_order FROM projects ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []model.Project
	for rows.Next() {
		var p model.Project
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.ImageURL, &p.LiveURL, &p.CodeURL, &p.Tags, &p.Featured, &p.SortOrder); err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, nil
}

func (r *Repository) CreateProject(ctx context.Context, p model.Project) (model.Project, error) {
	query := `
		INSERT INTO projects (title, description, image_url, live_url, code_url, tags, featured, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, p.Title, p.Description, p.ImageURL, p.LiveURL, p.CodeURL, p.Tags, p.Featured, p.SortOrder).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
	return p, err
}

// === Experience ===

func (r *Repository) GetExperiences(ctx context.Context) ([]model.Experience, error) {
	query := `SELECT id, title, company, location, start_date, end_date, is_current, description, sort_order FROM experiences ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var exps []model.Experience
	for rows.Next() {
		var e model.Experience
		var startDate time.Time
		// Handle nullable end_date
		var endDatePtr *time.Time
		
		if err := rows.Scan(&e.ID, &e.Title, &e.Company, &e.Location, &startDate, &endDatePtr, &e.Current, &e.Description, &e.SortOrder); err != nil {
			return nil, err
		}
		e.StartDate = startDate
		if endDatePtr != nil {
			e.EndDate = *endDatePtr
		}
		exps = append(exps, e)
	}
	return exps, nil
}

// === Education ===

func (r *Repository) GetEducation(ctx context.Context) ([]model.Education, error) {
	query := `SELECT id, degree, school, location, start_date, end_date, description, sort_order FROM education ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var edus []model.Education
	for rows.Next() {
		var e model.Education
		var startDate time.Time
		var endDatePtr *time.Time
		
		if err := rows.Scan(&e.ID, &e.Degree, &e.School, &e.Location, &startDate, &endDatePtr, &e.Description, &e.SortOrder); err != nil {
			return nil, err
		}
		e.StartDate = startDate
		if endDatePtr != nil {
			e.EndDate = *endDatePtr
		}
		edus = append(edus, e)
	}
	return edus, nil
}

// === Hobbies ===

func (r *Repository) GetHobbies(ctx context.Context) ([]model.Hobby, error) {
	query := `SELECT id, name, icon, description, sort_order FROM hobbies ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var hobbies []model.Hobby
	for rows.Next() {
		var h model.Hobby
		if err := rows.Scan(&h.ID, &h.Name, &h.Icon, &h.Description, &h.SortOrder); err != nil {
			return nil, err
		}
		hobbies = append(hobbies, h)
	}
	return hobbies, nil
}

// === Testimonials ===

func (r *Repository) GetApprovedTestimonials(ctx context.Context) ([]model.Testimonial, error) {
	query := `SELECT id, author_name, author_role, content, rating, status FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var testimonials []model.Testimonial
	for rows.Next() {
		var t model.Testimonial
		if err := rows.Scan(&t.ID, &t.AuthorName, &t.AuthorRole, &t.Content, &t.Rating, &t.Status); err != nil {
			return nil, err
		}
		testimonials = append(testimonials, t)
	}
	return testimonials, nil
}
