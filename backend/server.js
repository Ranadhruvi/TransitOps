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
// Add a new Trip (UPDATED)
app.post('/trips', async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
  try {
    const newTrip = await pool.query(
      `INSERT INTO trips 
      (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance]
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

// Add a new Vehicle (POST request)
app.post('/vehicles', async (req, res) => {
  // Make sure these match your frontend form and database columns
  const { reg_no, model, type, capacity, odometer, acq_cost, status } = req.body;
  try {
    const newVehicle = await pool.query(
      'INSERT INTO vehicles (reg_no, model, type, capacity, odometer, acq_cost, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [reg_no, model, type, capacity, odometer, acq_cost, status]
    );
    res.json(newVehicle.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/drivers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// DRIVERS API ROUTES
// ==========================================

// 1. Get all Drivers
app.get('/drivers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add a new Driver (POST request)
app.post('/drivers', async (req, res) => {
  // Destructure all the fields sent from the frontend form
  const { 
    name, license_number, category, expiry, 
    phone, trip_compl, safety, status 
  } = req.body;

  try {
    const newDriver = await pool.query(
      `INSERT INTO drivers 
      (name, license_number, category, expiry, phone, trip_compl, safety, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [name, license_number, category, expiry, phone, trip_compl, safety, status]
    );
    res.json(newDriver.rows[0]);
  } catch (err) {
    // If there is a database error (like a duplicate license number), send it back
    res.status(500).json({ error: err.message });
  }
});
app.get('/trips', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trips ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new Trip
app.post('/trips', async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
  try {
    const newTrip = await pool.query(
      `INSERT INTO trips 
      (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance]
    );
    res.json(newTrip.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MAINTENANCE API ROUTES
// ==========================================

// Get all Maintenance Logs
app.get('/maintenance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maintenance ORDER BY service_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Maintenance Log
app.post('/maintenance', async (req, res) => {
  const { vehicle_id, description, cost, service_date, status } = req.body;
  try {
    const newLog = await pool.query(
      `INSERT INTO maintenance 
      (vehicle_id, description, cost, service_date, status) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [vehicle_id, description, cost, service_date, status]
    );
    res.json(newLog.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// FUEL EXPENSES API ROUTES
// ==========================================

// Get all Fuel Records
app.get('/fuel', async (req, res) => {
  try {
    // Join with vehicles to get the registration number for the frontend
    const result = await pool.query(`
      SELECT fuel_expenses.*, vehicles.reg_no 
      FROM fuel_expenses 
      JOIN vehicles ON fuel_expenses.vehicle_id = vehicles.id
      ORDER BY refuel_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Fuel Record
app.post('/fuel', async (req, res) => {
  const { vehicle_id, refuel_date, volume_liters, total_cost, receipt_no } = req.body;
  try {
    const newFuel = await pool.query(
      `INSERT INTO fuel_expenses 
      (vehicle_id, refuel_date, volume_liters, total_cost, receipt_no) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [vehicle_id, refuel_date, volume_liters, total_cost, receipt_no]
    );
    res.json(newFuel.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ANALYTICS API ROUTES
// ==========================================

app.get('/analytics/fuel-trends', async (req, res) => {
  try {
    // This SQL query groups fuel costs by month and year
    const result = await pool.query(`
      SELECT 
        TO_CHAR(refuel_date, 'Mon YYYY') as month,
        SUM(total_cost) as total_spent,
        SUM(volume_liters) as total_liters
      FROM fuel_expenses
      GROUP BY TO_CHAR(refuel_date, 'Mon YYYY'), DATE_TRUNC('month', refuel_date)
      ORDER BY DATE_TRUNC('month', refuel_date) ASC
      LIMIT 6;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/analytics/summary', async (req, res) => {
  try {
    // Get quick counts for the top dashboard cards
    const vehicles = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'Available'");
    const trips = await pool.query("SELECT COUNT(*) FROM trips WHERE status = 'Dispatched'");
    const maintenance = await pool.query("SELECT SUM(cost) as total_repair_cost FROM maintenance");

    res.json({
      available_vehicles: vehicles.rows[0].count,
      active_trips: trips.rows[0].count,
      total_repair_cost: maintenance.rows[0].total_repair_cost || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));