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
	query := `SELECT id, name, COALESCE(icon, ''), proficiency, COALESCE(category, ''), sort_order, show_in_portfolio FROM skills ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var skills []model.Skill
	for rows.Next() {
		var s model.Skill
		if err := rows.Scan(&s.ID, &s.Name, &s.Icon, &s.Proficiency, &s.Category, &s.SortOrder, &s.ShowInPortfolio); err != nil {
			return nil, err
		}
		skills = append(skills, s)
	}
	return skills, nil
}

func (r *Repository) CreateSkill(ctx context.Context, s model.Skill) (model.Skill, error) {
	query := `
		INSERT INTO skills (name, icon, proficiency, category, sort_order, show_in_portfolio)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, s.Name, s.Icon, s.Proficiency, s.Category, s.SortOrder, s.ShowInPortfolio).Scan(&s.ID, &s.CreatedAt, &s.UpdatedAt)
	return s, err
}

func (r *Repository) UpdateSkill(ctx context.Context, s model.Skill) (model.Skill, error) {
	query := `
		UPDATE skills 
		SET name = $1, icon = $2, proficiency = $3, category = $4, sort_order = $5, show_in_portfolio = $6, updated_at = NOW()
		WHERE id = $7
		RETURNING created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, s.Name, s.Icon, s.Proficiency, s.Category, s.SortOrder, s.ShowInPortfolio, s.ID).Scan(&s.CreatedAt, &s.UpdatedAt)
	return s, err
}

func (r *Repository) DeleteSkill(ctx context.Context, id string) error {
	query := `DELETE FROM skills WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

// === Projects ===

func (r *Repository) GetProjects(ctx context.Context) ([]model.Project, error) {
	query := `SELECT id, title, COALESCE(title_fr, ''), COALESCE(description, ''), COALESCE(description_fr, ''), COALESCE(image_url, ''), COALESCE(live_url, ''), COALESCE(code_url, ''), tags, featured, sort_order FROM projects ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []model.Project
	for rows.Next() {
		var p model.Project
		if err := rows.Scan(&p.ID, &p.Title, &p.TitleFr, &p.Description, &p.DescriptionFr, &p.ImageURL, &p.LiveURL, &p.CodeURL, &p.Tags, &p.Featured, &p.SortOrder); err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, nil
}

func (r *Repository) CreateProject(ctx context.Context, p model.Project) (model.Project, error) {
	query := `
		INSERT INTO projects (title, title_fr, description, description_fr, image_url, live_url, code_url, tags, featured, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, p.Title, p.TitleFr, p.Description, p.DescriptionFr, p.ImageURL, p.LiveURL, p.CodeURL, p.Tags, p.Featured, p.SortOrder).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
	return p, err
}

func (r *Repository) UpdateProject(ctx context.Context, p model.Project) (model.Project, error) {
	query := `
		UPDATE projects 
		SET title = $1, title_fr = $2, description = $3, description_fr = $4, image_url = $5, live_url = $6, code_url = $7, tags = $8, featured = $9, sort_order = $10, updated_at = NOW()
		WHERE id = $11
		RETURNING created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, p.Title, p.TitleFr, p.Description, p.DescriptionFr, p.ImageURL, p.LiveURL, p.CodeURL, p.Tags, p.Featured, p.SortOrder, p.ID).Scan(&p.CreatedAt, &p.UpdatedAt)
	return p, err
}

func (r *Repository) DeleteProject(ctx context.Context, id string) error {
	query := `DELETE FROM projects WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

// === Experience ===

func (r *Repository) GetExperiences(ctx context.Context) ([]model.Experience, error) {
	query := `SELECT id, title, COALESCE(title_fr, ''), company, COALESCE(company_fr, ''), location, COALESCE(location_fr, ''), start_date, end_date, is_current, description, COALESCE(description_fr, '{}'), sort_order FROM experiences ORDER BY sort_order ASC`
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
		
		if err := rows.Scan(&e.ID, &e.Title, &e.TitleFr, &e.Company, &e.CompanyFr, &e.Location, &e.LocationFr, &startDate, &endDatePtr, &e.Current, &e.Description, &e.DescriptionFr, &e.SortOrder); err != nil {
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

func (r *Repository) CreateExperience(ctx context.Context, e model.Experience) (model.Experience, error) {
	query := `
		INSERT INTO experiences (title, title_fr, company, company_fr, location, location_fr, start_date, end_date, is_current, description, description_fr, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, e.Title, e.TitleFr, e.Company, e.CompanyFr, e.Location, e.LocationFr, e.StartDate, e.EndDate, e.Current, e.Description, e.DescriptionFr, e.SortOrder).Scan(&e.ID, &e.CreatedAt, &e.UpdatedAt)
	return e, err
}

func (r *Repository) UpdateExperience(ctx context.Context, e model.Experience) (model.Experience, error) {
	query := `
		UPDATE experiences
		SET title = $1, title_fr = $2, company = $3, company_fr = $4, location = $5, location_fr = $6, start_date = $7, end_date = $8, is_current = $9, description = $10, description_fr = $11, sort_order = $12, updated_at = NOW()
		WHERE id = $13
		RETURNING created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, e.Title, e.TitleFr, e.Company, e.CompanyFr, e.Location, e.LocationFr, e.StartDate, e.EndDate, e.Current, e.Description, e.DescriptionFr, e.SortOrder, e.ID).Scan(&e.CreatedAt, &e.UpdatedAt)
	return e, err
}

func (r *Repository) DeleteExperience(ctx context.Context, id string) error {
	query := `DELETE FROM experiences WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

// === Education ===

func (r *Repository) GetEducation(ctx context.Context) ([]model.Education, error) {
	query := `SELECT id, degree, COALESCE(degree_fr, ''), school, COALESCE(school_fr, ''), location, COALESCE(location_fr, ''), start_date, end_date, description, COALESCE(description_fr, ''), sort_order FROM education ORDER BY sort_order ASC`
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
		
		if err := rows.Scan(&e.ID, &e.Degree, &e.DegreeFr, &e.School, &e.SchoolFr, &e.Location, &e.LocationFr, &startDate, &endDatePtr, &e.Description, &e.DescriptionFr, &e.SortOrder); err != nil {
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

func (r *Repository) CreateEducation(ctx context.Context, e model.Education) (model.Education, error) {
	query := `
		INSERT INTO education (degree, degree_fr, school, school_fr, location, location_fr, start_date, end_date, description, description_fr, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, e.Degree, e.DegreeFr, e.School, e.SchoolFr, e.Location, e.LocationFr, e.StartDate, e.EndDate, e.Description, e.DescriptionFr, e.SortOrder).Scan(&e.ID, &e.CreatedAt, &e.UpdatedAt)
	return e, err
}

func (r *Repository) UpdateEducation(ctx context.Context, e model.Education) (model.Education, error) {
	query := `
		UPDATE education
		SET degree = $1, degree_fr = $2, school = $3, school_fr = $4, location = $5, location_fr = $6, start_date = $7, end_date = $8, description = $9, description_fr = $10, sort_order = $11, updated_at = NOW()
		WHERE id = $12
		RETURNING created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, e.Degree, e.DegreeFr, e.School, e.SchoolFr, e.Location, e.LocationFr, e.StartDate, e.EndDate, e.Description, e.DescriptionFr, e.SortOrder, e.ID).Scan(&e.CreatedAt, &e.UpdatedAt)
	return e, err
}

func (r *Repository) DeleteEducation(ctx context.Context, id string) error {
	query := `DELETE FROM education WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
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

func (r *Repository) CreateHobby(ctx context.Context, h model.Hobby) (model.Hobby, error) {
	query := `
		INSERT INTO hobbies (name, icon, description, sort_order)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, h.Name, h.Icon, h.Description, h.SortOrder).Scan(&h.ID, &h.CreatedAt, &h.UpdatedAt)
	return h, err
}

func (r *Repository) UpdateHobby(ctx context.Context, h model.Hobby) (model.Hobby, error) {
	query := `
		UPDATE hobbies
		SET name = $1, icon = $2, description = $3, sort_order = $4, updated_at = NOW()
		WHERE id = $5
		RETURNING created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, h.Name, h.Icon, h.Description, h.SortOrder, h.ID).Scan(&h.CreatedAt, &h.UpdatedAt)
	return h, err
}

func (r *Repository) DeleteHobby(ctx context.Context, id string) error {
	query := `DELETE FROM hobbies WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
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

func (r *Repository) GetAllTestimonials(ctx context.Context) ([]model.Testimonial, error) {
	query := `SELECT id, author_name, author_role, author_email, content, rating, status, created_at, updated_at FROM testimonials ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	testimonials := []model.Testimonial{}
	for rows.Next() {
		var t model.Testimonial
		if err := rows.Scan(&t.ID, &t.AuthorName, &t.AuthorRole, &t.AuthorEmail, &t.Content, &t.Rating, &t.Status, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}
		testimonials = append(testimonials, t)
	}
	return testimonials, nil
}

func (r *Repository) CreateTestimonial(ctx context.Context, t model.Testimonial) (model.Testimonial, error) {
	query := `
		INSERT INTO testimonials (author_name, author_role, author_email, content, rating, status)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, t.AuthorName, t.AuthorRole, t.AuthorEmail, t.Content, t.Rating, t.Status).Scan(&t.ID, &t.CreatedAt, &t.UpdatedAt)
	return t, err
}

func (r *Repository) UpdateTestimonialStatus(ctx context.Context, id, status string) error {
	query := `UPDATE testimonials SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.Exec(ctx, query, status, id)
	return err
}

func (r *Repository) DeleteTestimonial(ctx context.Context, id string) error {
	query := `DELETE FROM testimonials WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

// === Messages ===

func (r *Repository) GetMessages(ctx context.Context) ([]model.Message, error) {
	query := `SELECT id, name, email, subject, content, is_read, created_at FROM messages ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	messages := []model.Message{}
	for rows.Next() {
		var m model.Message
		if err := rows.Scan(&m.ID, &m.Name, &m.Email, &m.Subject, &m.Content, &m.Read, &m.CreatedAt); err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}
	return messages, nil
}

func (r *Repository) CreateMessage(ctx context.Context, m model.Message) (model.Message, error) {
	query := `
		INSERT INTO messages (name, email, subject, content, is_read)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(ctx, query, m.Name, m.Email, m.Subject, m.Content, m.Read).Scan(&m.ID, &m.CreatedAt)
	return m, err
}

func (r *Repository) MarkMessageRead(ctx context.Context, id string) error {
	query := `UPDATE messages SET is_read = TRUE WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *Repository) DeleteMessage(ctx context.Context, id string) error {
	query := `DELETE FROM messages WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

// === Contact Info ===

func (r *Repository) GetContactInfo(ctx context.Context) (model.ContactInfo, error) {
	query := `SELECT id, email, COALESCE(phone, ''), COALESCE(location, ''), COALESCE(linkedin, ''), COALESCE(github, ''), COALESCE(twitter, ''), COALESCE(website, ''), updated_at FROM contact_info LIMIT 1`
	
	var info model.ContactInfo
	err := r.db.QueryRow(ctx, query).Scan(
		&info.ID, &info.Email, &info.Phone, &info.Location, 
		&info.LinkedIn, &info.GitHub, &info.Twitter, &info.Website, &info.UpdatedAt,
	)
	
	if err != nil {
		// If no row exists, return empty structure or create default
		if err.Error() == "no rows in result set" {
			return model.ContactInfo{}, nil
		}
		return model.ContactInfo{}, err
	}
	
	return info, nil
}

func (r *Repository) UpdateContactInfo(ctx context.Context, info model.ContactInfo) (model.ContactInfo, error) {
	// Check if record exists
	existing, err := r.GetContactInfo(ctx)
	if err != nil {
		return model.ContactInfo{}, err
	}
	
	var query string
	if existing.ID == "" {
		// Create new
		query = `INSERT INTO contact_info (email, phone, location, linkedin, github, twitter, website, updated_at) 
				VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) 
				RETURNING id, email, phone, location, linkedin, github, twitter, website, updated_at`
		
		err = r.db.QueryRow(ctx, query, info.Email, info.Phone, info.Location, info.LinkedIn, info.GitHub, info.Twitter, info.Website).Scan(
			&info.ID, &info.Email, &info.Phone, &info.Location, 
			&info.LinkedIn, &info.GitHub, &info.Twitter, &info.Website, &info.UpdatedAt,
		)
	} else {
		// Update existing
		query = `UPDATE contact_info SET email=$1, phone=$2, location=$3, linkedin=$4, github=$5, twitter=$6, website=$7, updated_at=CURRENT_TIMESTAMP 
				WHERE id=$8 
				RETURNING id, email, phone, location, linkedin, github, twitter, website, updated_at`
				
		err = r.db.QueryRow(ctx, query, info.Email, info.Phone, info.Location, info.LinkedIn, info.GitHub, info.Twitter, info.Website, existing.ID).Scan(
			&info.ID, &info.Email, &info.Phone, &info.Location, 
			&info.LinkedIn, &info.GitHub, &info.Twitter, &info.Website, &info.UpdatedAt,
		)
	}
	
	if err != nil {
		return model.ContactInfo{}, err
	}
	
	return info, nil
}


