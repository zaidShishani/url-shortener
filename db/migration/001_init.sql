CREATE TABLE url_shortener_db.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE url_shortener_db.urls (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES url_shortener_db.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    shorten VARCHAR(25) NOT NULL UNIQUE,
    views INT NOT NULL DEFAULT 0,
    expiration_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_urls_user_id ON url_shortener_db.urls(user_id);
CREATE INDEX idx_urls_expiration_date ON url_shortener_db.urls(expiration_date) WHERE expiration_date IS NOT NULL;
