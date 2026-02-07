-- Add French fields to education table
ALTER TABLE education
ADD COLUMN degree_fr VARCHAR(255) DEFAULT '',
ADD COLUMN school_fr VARCHAR(255) DEFAULT '',
ADD COLUMN location_fr VARCHAR(255) DEFAULT '',
ADD COLUMN description_fr TEXT DEFAULT '';

-- Add French fields to experiences table
ALTER TABLE experiences
ADD COLUMN title_fr VARCHAR(255) DEFAULT '',
ADD COLUMN company_fr VARCHAR(255) DEFAULT '',
ADD COLUMN location_fr VARCHAR(255) DEFAULT '',
ADD COLUMN description_fr TEXT[] DEFAULT '{}';
