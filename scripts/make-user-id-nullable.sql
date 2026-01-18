-- Make user_id nullable on proposals, templates, and media_assets tables
-- This allows the app to work without authentication

-- Make user_id nullable on proposals table
ALTER TABLE proposals ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable on templates table  
ALTER TABLE templates ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable on media_assets table
ALTER TABLE media_assets ALTER COLUMN user_id DROP NOT NULL;
