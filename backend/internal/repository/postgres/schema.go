package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ensureSchema(pool *pgxpool.Pool) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	statements := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

		`CREATE TABLE IF NOT EXISTS admin (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS contact_info (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			email VARCHAR(255),
			phone VARCHAR(50),
			location VARCHAR(255),
			linkedin VARCHAR(255),
			github VARCHAR(255),
			twitter VARCHAR(255),
			website VARCHAR(500),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS skills (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(100) NOT NULL,
			icon VARCHAR(50),
			proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
			category VARCHAR(100),
			sort_order INTEGER DEFAULT 0,
			show_in_portfolio BOOLEAN DEFAULT TRUE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS projects (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			title VARCHAR(255) NOT NULL,
			title_fr VARCHAR(255),
			description TEXT,
			description_fr TEXT,
			image_url VARCHAR(500),
			live_url VARCHAR(500),
			code_url VARCHAR(500),
			tags TEXT[],
			featured BOOLEAN DEFAULT FALSE,
			sort_order INTEGER DEFAULT 0,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS experiences (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			title VARCHAR(255) NOT NULL,
			title_fr VARCHAR(255) DEFAULT '',
			company VARCHAR(255) NOT NULL,
			company_fr VARCHAR(255) DEFAULT '',
			location VARCHAR(255),
			location_fr VARCHAR(255) DEFAULT '',
			start_date DATE NOT NULL,
			end_date DATE,
			is_current BOOLEAN DEFAULT FALSE,
			description TEXT[],
			description_fr TEXT[] DEFAULT '{}',
			sort_order INTEGER DEFAULT 0,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS education (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			degree VARCHAR(255) NOT NULL,
			degree_fr VARCHAR(255) DEFAULT '',
			school VARCHAR(255) NOT NULL,
			school_fr VARCHAR(255) DEFAULT '',
			location VARCHAR(255),
			location_fr VARCHAR(255) DEFAULT '',
			start_date DATE NOT NULL,
			end_date DATE,
			description TEXT,
			description_fr TEXT DEFAULT '',
			sort_order INTEGER DEFAULT 0,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS hobbies (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(100) NOT NULL,
			icon VARCHAR(50),
			description TEXT,
			sort_order INTEGER DEFAULT 0,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS testimonials (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			author_name VARCHAR(255) NOT NULL,
			author_role VARCHAR(255),
			author_email VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			rating INTEGER CHECK (rating >= 1 AND rating <= 5),
			status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS messages (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			subject VARCHAR(255) DEFAULT '',
			content TEXT NOT NULL,
			is_read BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,

		// Forward-only, idempotent column additions for existing databases.
		`ALTER TABLE skills ADD COLUMN IF NOT EXISTS show_in_portfolio BOOLEAN DEFAULT TRUE;`,
		`ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255);`,
		`ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_fr TEXT;`,
		`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255) DEFAULT '';`,
		`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS company_fr VARCHAR(255) DEFAULT '';`,
		`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS location_fr VARCHAR(255) DEFAULT '';`,
		`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS description_fr TEXT[] DEFAULT '{}';`,
		`ALTER TABLE education ADD COLUMN IF NOT EXISTS degree_fr VARCHAR(255) DEFAULT '';`,
		`ALTER TABLE education ADD COLUMN IF NOT EXISTS school_fr VARCHAR(255) DEFAULT '';`,
		`ALTER TABLE education ADD COLUMN IF NOT EXISTS location_fr VARCHAR(255) DEFAULT '';`,
		`ALTER TABLE education ADD COLUMN IF NOT EXISTS description_fr TEXT DEFAULT '';`,
		`ALTER TABLE messages ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT '';`,

		`CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON skills(sort_order);`,
		`CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);`,
		`CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);`,
		`CREATE INDEX IF NOT EXISTS idx_experiences_sort_order ON experiences(sort_order);`,
		`CREATE INDEX IF NOT EXISTS idx_education_sort_order ON education(sort_order);`,
		`CREATE INDEX IF NOT EXISTS idx_hobbies_sort_order ON hobbies(sort_order);`,
		`CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);`,
		`CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);`,
	}

	for i, statement := range statements {
		if _, err := pool.Exec(ctx, statement); err != nil {
			return fmt.Errorf("schema statement %d failed: %w", i+1, err)
		}
	}

	return nil
}
