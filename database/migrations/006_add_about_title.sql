-- Migration to add about_title and about_title_fr fields to contact_info table
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT '';
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS about_title_fr TEXT DEFAULT '';
