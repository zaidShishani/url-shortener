CREATE SCHEMA IF NOT EXISTS url_shortener_db;

CREATE TABLE IF NOT EXISTS url_shortener_db.schema_migrations (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT NOW()
);