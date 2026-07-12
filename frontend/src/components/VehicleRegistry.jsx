import React, { useState, useEffect } from 'react';

const VehicleRegistry = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal and Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    reg_no: '',
    model: '',
    type: '',
    capacity: '',
    odometer: '',
    acq_cost: '',
    status: 'Available'
  });

  const fetchVehicles = () => {
    fetch('http://localhost:5000/vehicles')
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'badge bg-success';
      case 'on trip': return 'badge bg-primary';
      case 'in shop': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit Form Data to Backend
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add vehicle');
        return response.json();
      })
      .then(newVehicle => {
        // Add new vehicle to UI instantly
        setVehicles([...vehicles, newVehicle]);
        setShowModal(false); // Close Modal
        // Reset form
        setFormData({ reg_no: '', model: '', type: '', capacity: '', odometer: '', acq_cost: '', status: 'Available' });
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <select className="form-select w-auto"><option>Type: All</option></select>
          <select className="form-select w-auto"><option>Status: All</option></select>
          <input type="text" className="form-control w-auto" placeholder="Search reg. no..." />
        </div>
        <button 
          type="button" 
          className="btn btn-warning fw-bold" 
          onClick={() => setShowModal(true)}
        >
          + Add Vehicle
        </button>
      </div>

      <table className="table table-hover bg-white shadow-sm rounded">
        <thead>
          <tr className="text-muted small">
            <th>REG. NO. (UNIQUE)</th>
            <th>NAME/MODEL</th>
            <th>TYPE</th>
            <th>CAPACITY</th>
            <th>ODOMETER</th>
            <th>ACQ. COST</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="text-center py-4">Loading vehicles...</td></tr>
          ) : vehicles.length === 0 ? (
            <tr><td colSpan="7" className="text-center py-4">No vehicles found.</td></tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id || vehicle.reg_no}>
                <td>{vehicle.reg_no}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.odometer}</td>
                <td>{vehicle.acq_cost}</td>
                <td><span className={getStatusBadge(vehicle.status)}>{vehicle.status}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <small className="text-danger">Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher</small>

      {/* --- ADD VEHICLE MODAL --- */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Vehicle</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Registration No.</label>
                    <input type="text" className="form-control" name="reg_no" value={formData.reg_no} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Model/Name</label>
                    <input type="text" className="form-control" name="model" value={formData.model} onChange={handleInputChange} required />
                  </div>
                  <div className="row mb-2">
                    <div className="col">
                      <label className="form-label">Type</label>
                      <input type="text" className="form-control" name="type" value={formData.type} onChange={handleInputChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label">Capacity</label>
                      <input type="text" className="form-control" name="capacity" value={formData.capacity} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col">
                      <label className="form-label">Odometer</label>
                      <input type="number" className="form-control" name="odometer" value={formData.odometer} onChange={handleInputChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label">Acq. Cost</label>
                      <input type="number" className="form-control" name="acq_cost" value={formData.acq_cost} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Available">Available</option>
                      <option value="In Shop">In Shop</option>
                      <option value="On Trip">On Trip</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Vehicle</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleRegistry;