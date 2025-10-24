-- Add image_url column to privileges table
ALTER TABLE privileges ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add phone column to orders table and make email optional
ALTER TABLE orders ADD COLUMN IF NOT EXISTS player_phone VARCHAR(50);
