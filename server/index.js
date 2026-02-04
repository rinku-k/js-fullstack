const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// ============================================
// API V1
// ============================================
const V1_PREFIX = '/api/v1';

// 1. Get Envelopes
// Schema: id, name, amount
app.get(`${V1_PREFIX}/envelopes`, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM envelopes ORDER BY id ASC");
    res.json({ list: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. Create Envelope
// Param: { name, amount? }
app.post(`${V1_PREFIX}/envelopes`, async (req, res) => {
  try {
    const { name, amount = 0 } = req.body;
    const newEnvelope = await pool.query(
      "INSERT INTO envelopes (name, amount) VALUES($1, $2) RETURNING *",
      [name, amount]
    );
    res.json(newEnvelope.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 3. Update Envelope
// Param: { name }
app.patch(`${V1_PREFIX}/envelopes/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateEnvelope = await pool.query(
      "UPDATE envelopes SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    res.json(updateEnvelope.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// 4. Handle Income & Allocation
// POST /income?amount=1000  (Add Income)
// POST /income?amount=1000&envelopId=1 (Allocate)
app.post(`${V1_PREFIX}/income`, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Parse query params (User requested query params)
    const amount = parseFloat(req.query.amount);
    const envelopId = req.query.envelopId ? parseInt(req.query.envelopId) : null;
    const userId = 1; // Default User

    if (isNaN(amount)) {
        throw new Error("Invalid amount");
    }

    if (envelopId) {
        // --- ALLOCATE ---
        // Transaction: envelopId=1, type = ALLOCATE
        // User: income -= amount
        // Envelop: id, amount += amount

        // 1. Create Transaction
        await client.query(
            "INSERT INTO transactions (userId, envelopId, amount, type) VALUES ($1, $2, $3, 'ALLOCATE')",
            [userId, envelopId, amount]
        );

        // 2. Deduct from User
        await client.query(
            "UPDATE users SET amount = amount - $1 WHERE id = $2",
            [amount, userId]
        );

        // 3. Add to Envelope
        await client.query(
            "UPDATE envelopes SET amount = amount + $1 WHERE id = $2",
            [amount, envelopId]
        );

    } else {
        // --- ADD INCOME ---
        // Transaction: envelopId=null, type = INCOME
        // User: income += amount

        // 1. Create Transaction
        await client.query(
            "INSERT INTO transactions (userId, envelopId, amount, type) VALUES ($1, $2, $3, 'INCOME')",
            [userId, null, amount]
        );

        // 2. Add to User
        await client.query(
            "UPDATE users SET amount = amount + $1 WHERE id = $2",
            [amount, userId]
        );
    }

    await client.query('COMMIT');
    
    // Fetch updated user to return latest state
    const user = await client.query("SELECT * FROM users WHERE id = $1", [userId]);
    res.json(user.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send(err.message || "Server Error");
  } finally {
    client.release();
  }
});

// 5. Spend
// POST /envelopes/:id/spend?amount=1000
app.post(`${V1_PREFIX}/envelopes/:id/spend`, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const amount = parseFloat(req.query.amount);
    const userId = 1; // Default User

    if (isNaN(amount)) {
        throw new Error("Invalid amount");
    }

    // Transaction: envelopId=1, type = SPEND
    // Envelop: id, amount -= amount

    // 1. Create Transaction
    await client.query(
        "INSERT INTO transactions (userId, envelopId, amount, type) VALUES ($1, $2, $3, 'SPEND')",
        [userId, id, amount]
    );

    // 2. Deduct from Envelope
    const updateEnvelope = await client.query(
        "UPDATE envelopes SET amount = amount - $1 WHERE id = $2 RETURNING *",
        [amount, id]
    );

    await client.query('COMMIT');
    res.json(updateEnvelope.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send(err.message || "Server Error");
  } finally {
    client.release();
  }
});

// Helper: Get User Profile (for Frontend to show Global Income)
app.get(`${V1_PREFIX}/user`, async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = 1");
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// System Health (Keep existing for basic checks)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running (V1 Available)" });
});

app.get("/api/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0].now });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
