const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// database connection check
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
