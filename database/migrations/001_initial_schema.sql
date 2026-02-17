-- Initial schema for Portfolio application (Single Admin Model)
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin table (single admin user)
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Info table (single row for portfolio owner)
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(500),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    live_url VARCHAR(500),
    code_url VARCHAR(500),
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Experience table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resume table (for storing resume file info)
CREATE TABLE IF NOT EXISTS resume (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table (submitted by visitors, approved by admin)
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255),
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table (contact form submissions from visitors)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) DEFAULT '',
    content TEXT NOT NULL,
    content_hash VARCHAR(64) DEFAULT '',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_skills_sort_order ON skills(sort_order);
CREATE INDEX idx_projects_sort_order ON projects(sort_order);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_experiences_sort_order ON experiences(sort_order);
CREATE INDEX idx_education_sort_order ON education(sort_order);
CREATE INDEX idx_hobbies_sort_order ON hobbies(sort_order);
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_email_hash_created_at ON messages(email, content_hash, created_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_admin_updated_at
    BEFORE UPDATE ON admin
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
    BEFORE UPDATE ON contact_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
    BEFORE UPDATE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at
    BEFORE UPDATE ON education
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hobbies_updated_at
    BEFORE UPDATE ON hobbies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin (password: admin123 - would be hashed in production)
INSERT INTO admin (email, password_hash, name)
VALUES ('admin@portfolio.com', '$2a$10$placeholder-hash', 'Portfolio Admin')
ON CONFLICT (email) DO NOTHING;


-- Insert default contact info
INSERT INTO contact_info (email, location)
VALUES ('contact@portfolio.com', 'San Francisco, CA')
ON CONFLICT DO NOTHING;

-- Migration: 002_add_subject.sql
-- Add subject to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT '';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64) DEFAULT '';

-- Migration: 003_seed_testimonials.sql
-- Seed testimonials
INSERT INTO testimonials (author_name, author_role, author_email, content, rating, status)
VALUES 
('Sarah Jenkins', 'Product Manager', 'sarah.j@techstart.com', 'Working with this developer was an absolute pleasure. They understood our requirements perfectly and delivered a high-quality solution ahead of schedule.', 5, 'approved'),
('Michael Chen', 'CTO', 'michael@innovate.io', 'Exceptional technical skills and great communication. The code quality was top-notch and easy to maintain.', 5, 'approved'),
('Jessica Wu', 'Designer', 'jessica@creative.net', 'Good attention to detail on the frontend implementation. The animations are smooth and the responsive design works flawlessly.', 4, 'approved'),
('David Miller', 'Founder', 'david@startup.co', 'Solid work on the backend architecture. Highly recommended for full-stack projects.', 5, 'approved'),
('Emily Brown', 'Marketing Director', 'emily@growth.com', 'Great results! Our site performance improved significantly.', 5, 'pending');

-- Migration: 004_add_project_french_fields.sql
-- Add French fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_fr TEXT;
