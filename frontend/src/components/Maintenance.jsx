import React, { useState, useEffect } from 'react';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    vehicle_id: '',
    description: 'Oil Change',
    cost: 2500,
    service_date: '2026-07-07',
    status: 'In Shop'
  });

  const handleStatusChange = (id, vehicle_id, newStatus) => {
  fetch(`http://localhost:5000/maintenance/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus, vehicle_id })
  })
  .then(() => window.location.reload()) // Refresh to update list and vehicle status
  .catch(err => alert("Error updating status: " + err.message));
};

  useEffect(() => {
    // Fetch Maintenance Logs
    fetch('http://localhost:5000/maintenance')
      .then(res => res.json())
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    // Fetch Vehicles for dropdown
    fetch('http://localhost:5000/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newLog => {
        if (newLog.error) throw new Error(newLog.error);
        setLogs([...logs, newLog]);
        alert("Maintenance record saved!");
      })
      .catch(err => alert("Failed to log service: " + err.message));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="row">
        {/* Left Form */}
        <div className="col-md-4 pe-4 border-end">
          <h6 className="text-muted mb-4">LOG SERVICE RECORD</h6>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-muted">VEHICLE</label>
              <select className="form-select" name="vehicle_id" value={formData.vehicle_id} onChange={handleInputChange} required>
                <option value="">Select a vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.reg_no} ({v.model})</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">SERVICE TYPE</label>
              <input type="text" className="form-control" name="description" value={formData.description} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">COST</label>
              <input type="number" className="form-control" name="cost" value={formData.cost} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">DATE</label>
              <input type="date" className="form-control" name="service_date" value={formData.service_date} onChange={handleInputChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label small text-muted">STATUS</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="In Shop">In Shop</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button type="submit" className="btn btn-warning w-100 fw-bold mb-3">Save</button>
          </form>
          
          <div className="text-muted small">
            <div><span className="text-success">Available</span> → creating active record → <span className="text-warning text-dark">In Shop</span></div>
            <div><span className="text-warning text-dark">In Shop</span> → closing record → <span className="text-success">Available</span></div>
          </div>
        </div>

        {/* Right Table */}
        <div className="col-md-8 ps-4">
          <h6 className="text-muted mb-4">SERVICE LOG</h6>
          <table className="table table-hover bg-white shadow-sm rounded">
            <thead>
              <tr className="text-muted small">
                <th>VEHICLE ID</th>
                <th>SERVICE</th>
                <th>COST</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">No maintenance records found.</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.vehicle_id}</td>
                    <td>{log.description}</td>
                    <td>{log.cost}</td>
                    <td>{new Date(log.service_date).toLocaleDateString()}</td>
                    <td>
                      {/* Interactive Toggle */}
                      <select 
                        value={log.status || 'In Shop'} 
                        onChange={(e) => handleStatusChange(log.id, log.vehicle_id, e.target.value)}
                        className={`form-select form-select-sm ${log.status === 'Completed' ? 'bg-success text-white' : 'bg-warning text-dark'}`}
                        style={{ width: '130px' }}
                      >
                        <option value="In Shop">In Shop</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;