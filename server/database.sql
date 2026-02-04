-- Database: pern_boilerplate

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS envelopes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    profile TEXT,
    amount NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE envelopes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(id),
    envelopId INTEGER REFERENCES envelopes(id),
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- INCOME, ALLOCATE, SPEND
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data
INSERT INTO users (id, profile, amount) VALUES (1, 'Default User', 0.00);
