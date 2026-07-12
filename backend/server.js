require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully to Cloud Database'))
  .catch(err => console.error('Connection error', err.stack));

// --- API ROUTES ---

// 1. Get all Users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add a new Trip (POST request)
app.post('/trips', async (req, res) => {
  const { vehicle_id, source, destination } = req.body;
  try {
    const newTrip = await pool.query(
      'INSERT INTO trips (vehicle_id, source, destination) VALUES ($1, $2, $3) RETURNING *',
      [vehicle_id, source, destination]
    );
    res.json(newTrip.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get all Vehicles
app.get('/vehicles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));