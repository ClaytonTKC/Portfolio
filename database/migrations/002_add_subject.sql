-- Add subject to messages table (created manually for future reference)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT '';
