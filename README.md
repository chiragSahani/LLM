
# 🛠️ Natural Language SQL Query API

This project provides a **REST API** that accepts a **plain text query**, converts it into an **SQL query using OpenAI's API**, executes it on a **Supabase (PostgreSQL) database**, and returns the result in **natural language**.

## 🚀 Features
- Accepts **plain English queries** (e.g., *"Which category has the highest priced product?"*).
- Uses **OpenAI API** to generate the corresponding **SQL query**.
- Executes the query on a **PostgreSQL database (via Supabase RPC)**.
- Returns the answer in **human-friendly format**.
- Frontend built with **React + TailwindCSS** for interactive querying.

---

## 🏗️ Project Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/nl-query-api.git
cd nl-query-api
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```plaintext
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4️⃣ Setup Supabase Database
Run the following SQL schema in **Supabase SQL Editor**:

```sql
-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row-Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Allow public read access on categories"
    ON categories FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on products"
    ON products FOR SELECT TO public USING (true);

-- Insert Sample Data
INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Electronic devices and accessories'),
    ('Books', 'Physical and digital books'),
    ('Clothing', 'Apparel and fashion items'),
    ('Home & Garden', 'Items for home and garden');

-- Insert Sample Products
INSERT INTO products (name, description, price, category_id) 
SELECT 
    'Product ' || i::text,
    'Description for product ' || i::text,
    (random() * 1000)::decimal(10,2),
    (SELECT id FROM categories ORDER BY random() LIMIT 1)
FROM generate_series(1, 100) i;
```

### 5️⃣ Start the Backend
```bash
npm run dev
```

### 6️⃣ Start the Frontend
```bash
npm start
```

---

## 🔥 API Endpoints

### 🎯 `POST /ask`
**Request:**
```json
{
  "question": "Which category has the highest priced product?"
}
```
**Response:**
```json
{
  "answer": "The category with the highest priced product is 'Electronics'."
}
```

---

## 🖥️ Frontend Demo

The frontend provides an interactive UI where users can enter plain English queries and see results.

### 🏗️ Features:
- **Search Bar**: Users can enter queries naturally.
- **Real-time Processing**: The result is displayed after fetching from Supabase.
- **Error Handling**: Displays messages if the query fails.

---

## 📜 Contributing
1. **Fork** the repository.
2. Create a **feature branch** (`git checkout -b feature-name`).
3. **Commit** your changes (`git commit -m "Added new feature"`).
4. **Push** the changes (`git push origin feature-name`).
5. Open a **Pull Request**.

---

## 📜 License
This project is licensed under the **MIT License**.

---
