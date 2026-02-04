const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());


app.post("/api/v1/accounts", async (req, res) => {
  try {
    console.log("req", req)
    const { amount, userId = 1 } = req.body;
    const result = await pool.query("INSERT INTO accounts (balance, userId) VALUES ($1, $2)", [amount, userId]);
    res.json({ status: "ok", list: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/api/v1/accounts", async (req, res) => {
  try {
    const { id } = req.query;
    const result = id ? await pool.query("SELECT * FROM accounts WHERE id=$1", [id]) : await pool.query("SELECT * FROM accounts LIMIT 10");
    res.json({ status: "ok", list: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.post("/api/v1/transactions", async (req, res) => {
  const client = await pool.connect();

  try {
    const { fromAccount, toAccount, amount } = req.body;

    const result = await pool.query("SELECT balance from accounts where id=$1", [fromAccount]);
    const balance = result.rows[0].balance
    if (balance <= 0 || balance < amount) {
      res.json({ status: "500", error: "Insufficient Balance" });
    }
    if (fromAccount === toAccount) {
      res.json({ status: "500", error: "Account Id should be different" });
    }

    await client.query('BEGIN');

    await pool.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccount]);
    await pool.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccount]);
    await pool.query("INSERT INTO transactions (fromAccount, toAccount, amount, txn_type) VALUES ($1, $2, $3, 'TRANSFER')", [fromAccount, toAccount, amount]);

    await client.query('COMMIT');

    res.json({ status: "success" });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ status: "error", message: err.message });
  } finally {
    client.release();
  }
});

app.get("/api/v1/transactions", async (req, res) => {
  try {
    const { fromAccount, toAccount } = req.params;
    let result = [];
    if (fromAccount || toAccount) {
      result = await pool.query("SELECT * FROM transactions WHERE fromAccount=$1 OR toAccount=$2", [fromAccount, toAccount]);
    } else {
      result = await pool.query("SELECT * FROM transactions LIMIT 10");
    }
    res.json({ status: "ok", list: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
