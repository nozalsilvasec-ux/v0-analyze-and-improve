-- Create block_templates table for reusable content blocks
CREATE TABLE IF NOT EXISTS block_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('header', 'content', 'pricing', 'testimonial', 'cta', 'data', 'media', 'footer')),
  preview_url TEXT,
  content JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stock_images table for curated image library
CREATE TABLE IF NOT EXISTS stock_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('business', 'technology', 'team', 'abstract', 'charts', 'office', 'nature', 'creative')),
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_block_templates_category ON block_templates(category);
CREATE INDEX IF NOT EXISTS idx_stock_images_category ON stock_images(category);

-- Enable RLS
ALTER TABLE block_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to block_templates" ON block_templates
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to stock_images" ON stock_images
  FOR SELECT USING (true);
