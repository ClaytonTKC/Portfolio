-- Add bio and bio_fr columns to contact_info table
ALTER TABLE contact_info
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS bio_fr TEXT DEFAULT '';
