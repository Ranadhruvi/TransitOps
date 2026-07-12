require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// UPDATED: Configure Pool using the connection string from your .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for most cloud providers like Neon
  }
});

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully to Cloud Database'))
  .catch(err => console.error('Connection error', err.stack));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));