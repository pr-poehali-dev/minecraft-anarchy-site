-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Create privileges table
CREATE TABLE IF NOT EXISTS privileges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    privilege_id INTEGER REFERENCES privileges(id),
    player_name VARCHAR(255) NOT NULL,
    player_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site_content table for editable content
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial admin with MD5 hash
INSERT INTO admins (username, password_hash, created_by)
VALUES ('skzry', md5('R.ofical.1'), 'system')
ON CONFLICT (username) DO NOTHING;

-- Insert default site content
INSERT INTO site_content (key, value) VALUES
('hero_title', 'ANARCHIST EMPIRE'),
('hero_subtitle', '24/7 Minecraft Anarchy Server'),
('hero_description', 'Настоящая анархия без правил. Выживай, строй, сражайся!'),
('server_ip', 'play.anarchist-empire.ru')
ON CONFLICT (key) DO NOTHING;