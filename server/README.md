# Backend Server

Express.js + PostgreSQL backend for Envelope Budgeting App.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Database Setup**
    Ensure PostgreSQL is running.
    ```bash
    createdb pern_boilerplate
    ```
    *(If database already exists, you can skip this)*

3.  **Apply Schema**
    This command wipes the existing data and applies the new schema.
    ```bash
    npm run db:reset
    ```

4.  **Run Server**
    ```bash
    npm run dev
    ```

## DB Creation syntax
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    profile TEXT,
    amount NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE table (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(id),
    envelopId INTEGER REFERENCES envelopes(id),
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- INCOME, ALLOCATE, SPEND
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE custom_type AS ENUM ('SOMETHIS');




# calls
app.post(`api`, async (req, res) => {
    <!-- req -> params | query | body -->
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Parse query params (User requested query params)
    const amount = parseFloat(req.query.amount);
    const envelopId = req.query.envelopId ? parseInt(req.query.envelopId) : null;
    const userId = 1; // Default User

        // INSERT
        await client.query(
            "INSERT INTO table (userId, envelopId, amount, type) VALUES ($1, $2, $3, 'ALLOCATE')",
            [userId, envelopId, amount]
        );

        // UPDATE
        await client.query(
            "UPDATE table SET amount = amount + $1 WHERE id = $2",
            [amount, envelopId]
        );

    await client.query('COMMIT');
    
    // Fetch updated user to return latest state
    const user = await client.query("SELECT * FROM users WHERE id = $1", [userId]);
    res.json(user.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send(err.message || "Server Error");
  } finally {
    client.release();
  }


