import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all necessary data simultaneously
    Promise.all([
      fetch('http://localhost:5000/vehicles').then(res => res.json()),
      fetch('http://localhost:5000/trips').then(res => res.json()),
      fetch('http://localhost:5000/drivers').then(res => res.json())
    ])
      .then(([vehiclesData, tripsData, driversData]) => {
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        setTrips(Array.isArray(tripsData) ? tripsData : []);
        setDrivers(Array.isArray(driversData) ? driversData : []);
      })
      .catch(err => console.error("Error loading dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- KPI CALCULATIONS ---
  const totalVehicles = vehicles.length || 1; // Fallback to 1 to prevent division by zero
  const availableVehicles = vehicles.filter(v => v.status?.toLowerCase() === 'available').length;
  const inShopVehicles = vehicles.filter(v => v.status?.toLowerCase() === 'in shop').length;
  const onTripVehicles = vehicles.filter(v => v.status?.toLowerCase() === 'on trip').length;
  const activeVehicles = availableVehicles + onTripVehicles;
  
  const activeTrips = trips.filter(t => t.status?.toLowerCase() === 'dispatched' || t.status?.toLowerCase() === 'in progress');
  const pendingTrips = trips.filter(t => t.status?.toLowerCase() === 'draft');
  
  const driversOnDuty = drivers.filter(d => d.status?.toLowerCase() === 'on trip').length;
  const fleetUtilization = Math.round((onTripVehicles / totalVehicles) * 100) || 0;

  // Helper for Status Badges
  const getBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'dispatched': case 'on trip': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'draft': return 'bg-secondary';
      default: return 'bg-dark';
    }
  };

  if (loading) return <div className="p-5 text-center text-muted">Loading Dashboard...</div>;

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      
      {/* Top Navbar Area */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div className="w-25">
          <input type="text" className="form-control rounded-pill bg-white shadow-sm border-0 px-4" placeholder="Search..." />
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Raven K.</h6>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Dispatcher</small>
          </div>
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
            RK
          </div>
        </div>
      </div>

      {/* Filters (Mock UI for display) */}
      <div className="d-flex gap-3 mb-4">
        <select className="form-select bg-white border-0 shadow-sm text-muted w-auto" style={{ fontSize: '0.85rem' }}>
          <option>Vehicle Type: All</option>
        </select>
        <select className="form-select bg-white border-0 shadow-sm text-muted w-auto" style={{ fontSize: '0.85rem' }}>
          <option>Status: All</option>
        </select>
        <select className="form-select bg-white border-0 shadow-sm text-muted w-auto" style={{ fontSize: '0.85rem' }}>
          <option>Region: All</option>
        </select>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-3 mb-5">
        {[
          { label: 'ACTIVE VEHICLES', value: activeVehicles, color: 'primary' },
          { label: 'AVAILABLE VEHICLES', value: availableVehicles, color: 'success' },
          { label: 'VEHICLES IN MAINTENANCE', value: inShopVehicles, color: 'warning' },
          { label: 'ACTIVE TRIPS', value: activeTrips.length, color: 'primary' },
          { label: 'PENDING TRIPS', value: pendingTrips.length, color: 'secondary' },
          { label: 'DRIVERS ON DUTY', value: driversOnDuty, color: 'primary' },
          { label: 'FLEET UTILIZATION', value: `${fleetUtilization}%`, color: 'success' }
        ].map((kpi, index) => (
          <div key={index} className="col">
            <div className={`card h-100 border-0 shadow-sm rounded-3 border-start border-4 border-${kpi.color}`}>
              <div className="card-body py-3 px-4">
                <p className="text-muted fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>{kpi.label}</p>
                <h3 className="mb-0 fw-bold text-dark">{kpi.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="row g-4">
        
        {/* Left Side: Recent Trips Table */}
        <div className="col-md-8">
          <h6 className="text-muted fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>RECENT TRIPS</h6>
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <table className="table table-hover table-borderless align-middle mb-0 bg-white">
              <thead className="border-bottom text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <tr>
                  <th className="ps-4 py-3 fw-normal">TRIP</th>
                  <th className="py-3 fw-normal">VEHICLE</th>
                  <th className="py-3 fw-normal">DRIVER ID</th>
                  <th className="py-3 fw-normal">STATUS</th>
                  <th className="pe-4 py-3 fw-normal">ETA</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem' }}>
                {trips.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No trips recorded.</td></tr>
                ) : (
                  trips.slice(0, 5).map(trip => (
                    <tr key={trip.id} className="border-bottom">
                      <td className="ps-4 fw-bold text-dark">TR{trip.id.toString().padStart(3, '0')}</td>
                      <td className="text-muted">ID: {trip.vehicle_id}</td>
                      <td className="text-muted">{trip.driver_id || '--'}</td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 fw-normal ${getBadgeStyle(trip.status)}`}>
                          {trip.status || 'Draft'}
                        </span>
                      </td>
                      <td className="pe-4 text-muted">{trip.status === 'Dispatched' ? '45 min' : '--'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Vehicle Status Bars */}
        <div className="col-md-4">
          <h6 className="text-muted fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>VEHICLE STATUS</h6>
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-dark" style={{ fontSize: '0.85rem' }}>Available</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{availableVehicles}</span>
              </div>
              <div className="progress rounded-pill" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: `${(availableVehicles/totalVehicles)*100}%` }}></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-dark" style={{ fontSize: '0.85rem' }}>On Trip</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{onTripVehicles}</span>
              </div>
              <div className="progress rounded-pill" style={{ height: '8px' }}>
                <div className="progress-bar bg-primary" style={{ width: `${(onTripVehicles/totalVehicles)*100}%` }}></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-dark" style={{ fontSize: '0.85rem' }}>In Shop</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{inShopVehicles}</span>
              </div>
              <div className="progress rounded-pill" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${(inShopVehicles/totalVehicles)*100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-dark" style={{ fontSize: '0.85rem' }}>Retired</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>0</span>
              </div>
              <div className="progress rounded-pill" style={{ height: '8px' }}>
                <div className="progress-bar bg-danger" style={{ width: '0%' }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;