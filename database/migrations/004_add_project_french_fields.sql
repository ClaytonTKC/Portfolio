-- Migration: 004_add_project_french_fields.sql
-- Add French fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_fr TEXT;
