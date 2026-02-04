-- Money transfer / wallet API (same pattern)
-- “Build a REST API for transferring money between wallets/accounts.
-- Requirements:
-- Create accounts with initial balance
-- Get account by id
-- Transfer money from one account to another with validation
-- Keep a transaction history for each account.
-- Implement endpoints, persistence (in‑memory is fine), and tests for core flows.”

CREATE DATABASE pern_boilerplate;

DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS transactions ;

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    userId INTEGER,
    balance NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    fromAccount INTEGER REFERENCES accounts(id),
    toAccount INTEGER REFERENCES accounts(id),
    amount NUMERIC(10, 2) NOT NULL,
    txn_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 