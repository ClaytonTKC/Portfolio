-- Add show_in_portfolio column to skills table
ALTER TABLE skills ADD COLUMN show_in_portfolio BOOLEAN DEFAULT true;
