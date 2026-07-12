require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure Pool with your PostgreSQL credentials
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
});

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch(err => console.error('Connection error', err.stack));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));