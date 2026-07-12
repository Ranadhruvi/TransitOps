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
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully to Cloud Database'))
  .catch(err => console.error('Connection error', err.stack));

// ==========================================
// API ROUTES
// ==========================================

// 1. DRIVERS
app.get('/drivers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/drivers', async (req, res) => {
  const { name, license_number, category, expiry, phone, trip_compl, safety, status } = req.body;
  try {
    const newDriver = await pool.query(
      `INSERT INTO drivers (name, license_number, category, expiry, phone, trip_compl, safety, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, license_number, category, expiry, phone, trip_compl, safety, status]
    );
    res.json(newDriver.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. VEHICLES
app.get('/vehicles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/vehicles', async (req, res) => {
  const { reg_no, model, type, capacity, odometer, acq_cost, status } = req.body;
  try {
    const newVehicle = await pool.query(
      'INSERT INTO vehicles (reg_no, model, type, capacity, odometer, acq_cost, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [reg_no, model, type, capacity, odometer, acq_cost, status]
    );
    res.json(newVehicle.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. TRIPS
app.get('/trips', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trips ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/trips', async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
  try {
    const newTrip = await pool.query(
      `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance]
    );
    res.json(newTrip.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. MAINTENANCE
app.get('/maintenance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maintenance ORDER BY service_date DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/maintenance', async (req, res) => {
  const { vehicle_id, description, cost, service_date, status } = req.body;
  try {
    const newLog = await pool.query(
      `INSERT INTO maintenance (vehicle_id, description, cost, service_date, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [vehicle_id, description, cost, service_date, status]
    );
    res.json(newLog.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. FUEL EXPENSES
app.get('/fuel', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT fuel_expenses.*, vehicles.reg_no 
      FROM fuel_expenses 
      JOIN vehicles ON fuel_expenses.vehicle_id = vehicles.id
      ORDER BY refuel_date DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/fuel', async (req, res) => {
  const { vehicle_id, refuel_date, volume_liters, total_cost, receipt_no } = req.body;
  try {
    const newFuel = await pool.query(
      `INSERT INTO fuel_expenses (vehicle_id, refuel_date, volume_liters, total_cost, receipt_no) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [vehicle_id, refuel_date, volume_liters, total_cost, receipt_no]
    );
    res.json(newFuel.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6. ANALYTICS
app.get('/analytics/fuel-trends', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT TO_CHAR(refuel_date, 'Mon YYYY') as month, SUM(total_cost) as total_spent, SUM(volume_liters) as total_liters
      FROM fuel_expenses GROUP BY TO_CHAR(refuel_date, 'Mon YYYY'), DATE_TRUNC('month', refuel_date)
      ORDER BY DATE_TRUNC('month', refuel_date) ASC LIMIT 6`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/analytics/summary', async (req, res) => {
  try {
    const v = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'Available'");
    const t = await pool.query("SELECT COUNT(*) FROM trips WHERE status = 'Dispatched'");
    const m = await pool.query("SELECT SUM(cost) as total_repair_cost FROM maintenance");
    res.json({ available_vehicles: v.rows[0].count, active_trips: t.rows[0].count, total_repair_cost: m.rows[0].total_repair_cost || 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/drivers/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await pool.query('UPDATE drivers SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  res.json(updated.rows[0]);
});


app.put('/trips/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { vehicle_id, driver_id } = req.body;

  try {
    // Update trip status
    await pool.query('UPDATE trips SET status = $1 WHERE id = $2', ['Completed', id]);
    
    // Set Vehicle back to Available
    await pool.query('UPDATE vehicles SET status = $1 WHERE id = $2', ['Available', vehicle_id]);
    
    // Set Driver back to Available
    await pool.query('UPDATE drivers SET status = $1 WHERE id = $2', ['Available', driver_id]);
    
    res.json({ success: true, message: 'Trip completed and resources released.' });
  } catch (err) {
    console.error("Backend Error:", err); // This log will show in your terminal
    res.status(500).json({ error: err.message });
  }
});

app.put('/vehicles/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE vehicles SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(updated.rows[0]);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.put('/maintenance/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, vehicle_id } = req.body;
  try {
    // 1. Update maintenance log status
    await pool.query('UPDATE maintenance SET status = $1 WHERE id = $2', [status, id]);
    
    // 2. If status is Completed, set vehicle back to Available
    if (status === 'Completed') {
      await pool.query('UPDATE vehicles SET status = $1 WHERE id = $2', ['Available', vehicle_id]);
    } else {
      // If back to "In Shop", set vehicle to "In Shop"
      await pool.query('UPDATE vehicles SET status = $1 WHERE id = $2', ['In Shop', vehicle_id]);
    }
    
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));