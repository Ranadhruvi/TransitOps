import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TripDispatcher = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight: '', planned_distance: ''
  });
  const navigate = useNavigate();

  const handleCompleteTrip = (trip) => {
    // 1. Call the backend to flip statuses
    fetch(`http://localhost:5000/trips/${trip.id}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: trip.vehicle_id, driver_id: trip.driver_id })
    })
    .then(res => res.json())
    .then(() => {
      // 2. Redirect to Fuel page for the next step of the workflow
      alert("Trip Completed! Please log the fuel expenses now.");
      navigate('/fuel'); 
    })
    .catch(err => alert("Error completing trip: " + err.message));
  };
  useEffect(() => {
    // Fetch data
    Promise.all([
      fetch('http://localhost:5000/vehicles').then(res => res.json()),
      fetch('http://localhost:5000/drivers').then(res => res.json()),
      fetch('http://localhost:5000/trips').then(res => res.json())
    ]).then(([v, d, t]) => {
      setVehicles(v.filter(v => v.status === 'Available'));
      setDrivers(d.filter(d => d.status === 'Available'));
      setTrips(t);
    });
  }, []);

  const selectedVehicle = vehicles.find(v => v.id == formData.vehicle_id);
  const isOverCapacity = selectedVehicle && (Number(formData.cargo_weight) > selectedVehicle.capacity);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, status: 'Dispatched' })
    }).then(() => window.location.reload());
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Dispatched': return 'bg-primary text-white';
      case 'Draft': return 'bg-secondary text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* 1. Trip Lifecycle Progress Bar */}
      <div className="d-flex align-items-center mb-5 mt-2 justify-content-center">
        {['Draft', 'Dispatched', 'Completed', 'Cancelled'].map((step, i) => (
          <React.Fragment key={step}>
            <div className="d-flex flex-column align-items-center">
              <div className={`rounded-circle ${i === 1 ? 'bg-primary' : 'bg-secondary'}`} style={{ width: 15, height: 15 }}></div>
              <small className="mt-2 text-muted fw-bold">{step}</small>
            </div>
            {i < 3 && <div className="flex-grow-1 border-top mx-2" style={{ width: 50 }}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="row g-5">
        {/* CREATE TRIP FORM */}
        <div className="col-md-5">
          <h6 className="text-uppercase text-muted fw-bold mb-3">Create Trip</h6>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Source</label>
              <input className="form-control" onChange={e => setFormData({...formData, source: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Destination</label>
              <input className="form-control" onChange={e => setFormData({...formData, destination: e.target.value})} required />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Vehicle (Available Only)</label>
              <select className="form-select" onChange={e => setFormData({...formData, vehicle_id: e.target.value})} required>
                <option value="">Select Vehicle...</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_no} - {v.capacity}kg</option>)}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Driver (Available Only)</label>
              <select className="form-select" onChange={e => setFormData({...formData, driver_id: e.target.value})} required>
                <option value="">Select Driver...</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Cargo Weight (kg)</label>
                <input type="number" className="form-control" onChange={e => setFormData({...formData, cargo_weight: e.target.value})} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Planned Distance (km)</label>
                <input type="number" className="form-control" onChange={e => setFormData({...formData, planned_distance: e.target.value})} required />
              </div>
            </div>

            {/* Capacity Validation Box */}
            {selectedVehicle && (
              <div className={`alert ${isOverCapacity ? "alert-danger" : "alert-success"} mt-3`}>
                <strong>Vehicle Capacity:</strong> {selectedVehicle.capacity} kg<br />
                <strong>Cargo Weight:</strong> {formData.cargo_weight} kg<br />
                {isOverCapacity ? (
                  <>❌ Capacity exceeded by {formData.cargo_weight - selectedVehicle.capacity} kg — dispatch blocked</>
                ) : <>✅ Capacity OK</>}
              </div>
            )}

            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-primary w-50" disabled={isOverCapacity || !formData.vehicle_id}>
                {isOverCapacity ? "Dispatch Disabled" : "Dispatch"}
              </button>
              <button type="button" className="btn btn-light border w-50" onClick={() => window.location.reload()}>Cancel</button>
            </div>
          </form>
        </div>

        {/* LIVE BOARD */}
        <div className="col-md-7">
          <h6 className="text-uppercase text-muted fw-bold mb-3">Live Board</h6>
          {trips.map(trip => (
            <div key={trip.id} className="card mb-3 p-3 shadow-sm border-0 border-start border-4" style={{ borderLeftColor: '#0d6efd' }}>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold mb-0">TR{trip.id.toString().padStart(3, '0')}</h6>
                  <small className="text-muted">{trip.source} → {trip.destination}</small>
                </div>
                <div className="text-end">
                  <small className="text-muted">VAH-{trip.vehicle_id} / Driver</small>
                </div>
              </div>
              
              {/* UPDATE THIS PART BELOW */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="d-flex align-items-center">
                    <span className={`badge ${getStatusBadge(trip.status)}`}>{trip.status}</span>
                    
                    {/* The Complete Button */}
                    {trip.status === 'Dispatched' && (
                      <button 
                        className="btn btn-sm btn-success ms-2" 
                        onClick={() => handleCompleteTrip(trip)}
                      >
                        Complete
                      </button>
                    )}
                </div>
                <small className="text-muted">{trip.status === 'Dispatched' ? '45 min' : '--'}</small>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripDispatcher;