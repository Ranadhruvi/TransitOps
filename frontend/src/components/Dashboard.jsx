import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch Vehicles
    fetch('http://localhost:5000/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    // Fetch Trips
    fetch('http://localhost:5000/trips')
      .then(res => res.json())
      .then(data => setTrips(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const inShopVehicles = vehicles.filter(v => v.status === 'In Shop');
  const activeTrips = trips.filter(t => t.status === 'Dispatched' || t.status === 'In Progress');

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark">TransitOps Control Center</h3>
        <div className="d-flex gap-2">
          <Link to="/dispatch" className="btn btn-primary fw-bold">Dispatch Trip</Link>
          <Link to="/vehicles" className="btn btn-outline-secondary bg-white">Manage Fleet</Link>
        </div>
      </div>

      <div className="row">
        {/* Left Column: Active Operations */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 text-primary fw-bold">LIVE TRIPS</h6>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr className="small text-muted">
                    <th className="ps-4">TRIP ID</th>
                    <th>ROUTE</th>
                    <th>VEHICLE ID</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTrips.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No active trips right now.</td></tr>
                  ) : (
                    activeTrips.map(trip => (
                      <tr key={trip.id}>
                        <td className="ps-4 fw-bold">TR{trip.id.toString().padStart(3, '0')}</td>
                        <td>{trip.source} → {trip.destination}</td>
                        <td>{trip.vehicle_id}</td>
                        <td><span className="badge bg-primary">On Route</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Status */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-warning border-4 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 text-warning text-dark fw-bold">MAINTENANCE ALERTS</h6>
            </div>
            <div className="card-body">
              {inShopVehicles.length === 0 ? (
                <p className="text-muted small mb-0">All vehicles are currently operational.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {inShopVehicles.map(v => (
                    <li key={v.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                      <div>
                        <strong className="d-block">{v.reg_no}</strong>
                        <small className="text-muted">{v.model}</small>
                      </div>
                      <span className="badge bg-warning text-dark">In Shop</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;