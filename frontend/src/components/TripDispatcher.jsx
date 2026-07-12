import React, { useState, useEffect } from 'react';

const TripDispatcher = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    source: 'Gandhinagar Depot',
    destination: 'Ahmedabad Hub',
    vehicle_id: '',
    driver_id: '', // Assuming your backend takes a driver for the trip
    cargo_weight: 700,
    planned_distance: 38
  });

  // Fetch initial data
  useEffect(() => {
    // Fetch Trips
    fetch('http://localhost:5000/trips')
      .then(res => res.json())
      .then(data => setTrips(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching trips:", err));

    // Fetch Vehicles (to populate dropdown)
    fetch('http://localhost:5000/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching vehicles:", err));

    // Fetch Drivers (to populate dropdown)
    fetch('http://localhost:5000/drivers')
      .then(res => res.json())
      .then(data => setDrivers(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching drivers:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newTrip => {
        if (newTrip.error) throw new Error(newTrip.error);
        setTrips([...trips, newTrip]);
        alert("Trip dispatched successfully!");
      })
      .catch(err => alert("Failed to dispatch trip: " + err.message));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="row">
        {/* Left Column: Create Trip Form */}
        <div className="col-md-5 pe-4 border-end">
          <h6 className="text-muted mb-4">CREATE TRIP</h6>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-muted">SOURCE</label>
              <input type="text" className="form-control" name="source" value={formData.source} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">DESTINATION</label>
              <input type="text" className="form-control" name="destination" value={formData.destination} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">VEHICLE (AVAILABLE ONLY)</label>
              <select className="form-select" name="vehicle_id" value={formData.vehicle_id} onChange={handleInputChange} required>
                <option value="">Select a vehicle...</option>
                {vehicles.filter(v => v.status === 'Available').map(v => (
                  <option key={v.id} value={v.id}>{v.reg_no} - {v.capacity} capacity</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">DRIVER (AVAILABLE ONLY)</label>
              <select className="form-select" name="driver_id" value={formData.driver_id} onChange={handleInputChange} required>
                <option value="">Select a driver...</option>
                {drivers.filter(d => d.status === 'Available').map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.license_number})</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">CARGO WEIGHT (KG)</label>
              <input type="number" className="form-control" name="cargo_weight" value={formData.cargo_weight} onChange={handleInputChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label small text-muted">PLANNED DISTANCE (KM)</label>
              <input type="number" className="form-control" name="planned_distance" value={formData.planned_distance} onChange={handleInputChange} required />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary w-50">Dispatch</button>
              <button type="button" className="btn btn-light border w-50" onClick={() => setFormData({...formData, source: '', destination: ''})}>Clear</button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Board */}
        <div className="col-md-7 ps-4">
          <h6 className="text-muted mb-4">LIVE BOARD</h6>
          
          {trips.length === 0 ? (
            <p className="text-muted">No active trips.</p>
          ) : (
            trips.map(trip => (
              <div key={trip.id} className="card shadow-sm mb-3 border-0 border-start border-primary border-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="d-block mb-1">
                      TR{trip.id.toString().padStart(3, '0')} 
                      <span className="text-muted fw-normal ms-2">Vehicle ID: {trip.vehicle_id}</span>
                    </strong>
                    <small className="text-muted d-block mb-2">{trip.source} → {trip.destination}</small>
                    <span className="badge bg-primary">{trip.status || 'Dispatched'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDispatcher;