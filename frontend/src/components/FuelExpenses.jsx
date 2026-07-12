import React, { useState, useEffect } from 'react';

const FuelExpenses = () => {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    vehicle_id: '',
    refuel_date: new Date().toISOString().split('T')[0], // Defaults to today's date
    volume_liters: '',
    total_cost: '',
    receipt_no: ''
  });

  useEffect(() => {
    // Fetch Fuel Records
    fetch('http://localhost:5000/fuel')
      .then(res => res.json())
      .then(data => {
        setFuelLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching fuel logs:", err);
        setLoading(false);
      });

    // Fetch Vehicles for the dropdown
    fetch('http://localhost:5000/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching vehicles:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/fuel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newLog => {
        if (newLog.error) throw new Error(newLog.error);
        
        // Since the backend returns just the vehicle_id, we need to map the reg_no manually 
        // before adding it to the UI array so the table doesn't show a blank vehicle name.
        const vehicle = vehicles.find(v => v.id.toString() === newLog.vehicle_id.toString());
        const logWithRegNo = { ...newLog, reg_no: vehicle ? vehicle.reg_no : 'Unknown' };
        
        setFuelLogs([logWithRegNo, ...fuelLogs]);
        
        // Reset form but keep today's date
        setFormData({
          vehicle_id: '',
          refuel_date: new Date().toISOString().split('T')[0],
          volume_liters: '',
          total_cost: '',
          receipt_no: ''
        });
        alert("Fuel record saved successfully!");
      })
      .catch(err => alert("Failed to log fuel: " + err.message));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search receipts or vehicles..." />
      </div>

      <div className="row">
        {/* Left Column: Form */}
        <div className="col-md-4 pe-4 border-end">
          <h6 className="text-muted mb-4">LOG FUEL EXPENSE</h6>
          <form onSubmit={handleSubmit} className="bg-white p-4 shadow-sm rounded">
            <div className="mb-3">
              <label className="form-label small text-muted">VEHICLE</label>
              <select className="form-select" name="vehicle_id" value={formData.vehicle_id} onChange={handleInputChange} required>
                <option value="">Select a vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.reg_no} ({v.type})</option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label small text-muted">REFUEL DATE</label>
              <input type="date" className="form-control" name="refuel_date" value={formData.refuel_date} onChange={handleInputChange} required />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label small text-muted">VOLUME (Liters)</label>
                <input type="number" step="0.01" className="form-control" name="volume_liters" value={formData.volume_liters} onChange={handleInputChange} placeholder="e.g. 45.5" required />
              </div>
              <div className="col">
                <label className="form-label small text-muted">TOTAL COST (₹)</label>
                <input type="number" className="form-control" name="total_cost" value={formData.total_cost} onChange={handleInputChange} placeholder="e.g. 4200" required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small text-muted">RECEIPT NO. (Optional)</label>
              <input type="text" className="form-control" name="receipt_no" value={formData.receipt_no} onChange={handleInputChange} placeholder="e.g. REC-9921" />
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold">Save Record</button>
          </form>
        </div>

        {/* Right Column: Data Table */}
        <div className="col-md-8 ps-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="text-muted mb-0">RECENT FUEL LOGS</h6>
            <span className="badge bg-secondary">Total Records: {fuelLogs.length}</span>
          </div>
          
          <div className="table-responsive bg-white shadow-sm rounded">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr className="text-muted small">
                  <th>DATE</th>
                  <th>VEHICLE</th>
                  <th>RECEIPT</th>
                  <th>VOLUME (L)</th>
                  <th>COST</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Loading records...</td>
                  </tr>
                ) : fuelLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No fuel records found.</td>
                  </tr>
                ) : (
                  fuelLogs.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.refuel_date).toLocaleDateString()}</td>
                      <td className="fw-bold">{log.reg_no}</td>
                      <td>{log.receipt_no || '--'}</td>
                      <td>{parseFloat(log.volume_liters).toFixed(2)}</td>
                      <td>₹{log.total_cost.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelExpenses;