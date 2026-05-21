-- Database initialization script
-- This runs when the PostgreSQL container starts

-- Create the portfolio database if it doesn't exist
SELECT 'CREATE DATABASE portfolio'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'portfolio');

-- Connect to portfolio database and run migrations
\c portfolio;

-- Run migrations in order
\i /docker-entrypoint-initdb.d/migrations/001_initial_schema.sql
\i /docker-entrypoint-initdb.d/migrations/002_add_french_fields.sql
\i /docker-entrypoint-initdb.d/migrations/003_add_skill_visibility.sql
\i /docker-entrypoint-initdb.d/migrations/004_add_project_french_fields.sql
\i /docker-entrypoint-initdb.d/migrations/005_add_bio_fields.sql
\i /docker-entrypoint-initdb.d/migrations/006_add_about_title.sql
