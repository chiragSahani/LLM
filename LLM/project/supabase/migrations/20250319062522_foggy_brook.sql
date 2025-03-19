/*
  # Database Schema for Natural Language Query Demo

  1. New Tables
    - categories
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - created_at (timestamp)
    
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (decimal)
      - category_id (uuid, foreign key)
      - created_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create categories table
-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes for faster lookups
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_price ON products (price);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY allow_public_read_categories
    ON categories
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY allow_public_read_products
    ON products
    FOR SELECT
    TO public
    USING (true);

-- Insert sample data
INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Electronic devices and accessories'),
    ('Books', 'Physical and digital books'),
    ('Clothing', 'Apparel and fashion items'),
    ('Home & Garden', 'Items for home and garden');

-- Insert sample products with random categories
INSERT INTO products (name, description, price, category_id)
SELECT 
    'Product ' || i::text,
    'Description for product ' || i::text,
    (random() * 1000)::DECIMAL(12,2),
    (SELECT id FROM categories ORDER BY random() LIMIT 1)
FROM generate_series(1, 100) i;