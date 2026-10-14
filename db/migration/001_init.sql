CREATE TABLE IF NOT EXISTS urls(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    shorten varchar(10) NOT NULL UNIQUE,
    expirationDate DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_expiration_date ON urls(expirationDate) WHERE expirationDate IS NOT NULL;
