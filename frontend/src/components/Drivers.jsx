import React, { useState, useEffect } from 'react';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', license_number: '', category: 'LMV', expiry: '', phone: '', trip_compl: '0%', safety: 'Good', status: 'Available'
  });

  const fetchDrivers = () => {
    fetch('http://localhost:5000/drivers')
      .then((response) => response.json())
      .then((data) => {
        setDrivers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchDrivers(); }, []);

  // Logic for Status Toggling
  const handleStatusChange = (id, newStatus) => {
    fetch(`http://localhost:5000/drivers/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    .then(() => fetchDrivers()) // Refresh list
    .catch(err => alert("Error updating status: " + err.message));
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-success text-white';
      case 'on trip': return 'bg-primary text-white';
      case 'off duty': return 'bg-secondary text-white';
      case 'suspended': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      setShowModal(false);
      fetchDrivers();
    })
    .catch(err => alert("Failed to add driver: " + err.message));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h4 className="text-dark">Drivers Management</h4>
        <button type="button" className="btn btn-warning fw-bold" onClick={() => setShowModal(true)}>+ Add Driver</button>
      </div>

      <table className="table table-hover bg-white shadow-sm rounded mb-4">
        <thead>
          <tr className="text-muted small">
            <th>DRIVER</th>
            <th>LICENSE NO.</th>
            <th>CATEGORY</th>
            <th>EXPIRY</th>
            <th>CONTACT</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan="6" className="text-center">Loading...</td></tr> : drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.license_number}</td>
              <td>{driver.category}</td>
              <td>{driver.expiry}</td>
              <td>{driver.phone}</td>
              <td>
                <select 
                  value={driver.status} 
                  onChange={(e) => handleStatusChange(driver.id, e.target.value)}
                  className={`form-select form-select-sm ${getStatusBadge(driver.status)}`}
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- ADD DRIVER MODAL --- */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Driver</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label>Driver Name</label>
                    <input type="text" className="form-control" name="name" onChange={handleInputChange} required />
                  </div>
                  {/* Add other inputs here similarly */}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Driver</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;