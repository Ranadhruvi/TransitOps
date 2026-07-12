import React, { useState, useEffect } from 'react';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    category: 'LMV',
    expiry: '',
    phone: '',
    trip_compl: '0%',
    safety: 'Good',
    status: 'Available'
  });

  const fetchDrivers = () => {
    fetch('http://localhost:5000/drivers')
      .then((response) => response.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setDrivers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'badge bg-success';
      case 'on trip': return 'badge bg-primary';
      case 'off duty': return 'badge bg-secondary';
      case 'suspended': return 'badge bg-danger';
      default: return 'badge bg-secondary';
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
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setDrivers([...drivers, data]);
        setShowModal(false);
        setFormData({
          name: '', license_number: '', category: 'LMV', expiry: '', phone: '', trip_compl: '0%', safety: 'Good', status: 'Available'
        });
      })
      .catch(err => alert("Failed to add driver: " + err.message));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="d-flex justify-content-end mb-4">
        {/* Added type="button" to prevent React crashes */}
        <button type="button" className="btn btn-warning fw-bold" onClick={() => setShowModal(true)}>
          + Add Driver
        </button>
      </div>

      <table className="table table-hover bg-white shadow-sm rounded mb-4">
        <thead>
          <tr className="text-muted small">
            <th>DRIVER</th>
            <th>LICENSE NO.</th>
            <th>CATEGORY</th>
            <th>EXPIRY</th>
            <th>CONTACT</th>
            <th>TRIP COMPL.</th>
            <th>SAFETY</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="8" className="text-center py-4">Loading drivers...</td></tr>
          ) : error ? (
            <tr><td colSpan="8" className="text-center py-4 text-danger fw-bold">Backend Error: {error}</td></tr>
          ) : drivers.length === 0 ? (
            <tr><td colSpan="8" className="text-center py-4">No drivers found.</td></tr>
          ) : (
            drivers.map((driver) => (
              <tr key={driver.id || driver.license_number}>
                <td>{driver.name}</td>
                <td>{driver.license_number}</td>
                <td>{driver.category}</td>
                <td>{driver.expiry}</td>
                <td>{driver.phone}</td>
                <td>{driver.trip_compl}</td>
                <td>{driver.safety}</td>
                <td><span className={getStatusBadge(driver.status)}>{driver.status}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex gap-2">
        <span className="badge bg-success p-2">Available</span>
        <span className="badge bg-primary p-2">On Trip</span>
        <span className="badge bg-secondary p-2">Off Duty</span>
        <span className="badge bg-danger p-2">Suspended</span>
      </div>
      <small className="text-danger d-block mt-2">Rule: Expired license or Suspended status → blocked from trip assignment</small>

      {/* --- ADD DRIVER MODAL --- */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Driver</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Driver Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="row mb-2">
                    <div className="col">
                      <label className="form-label">License No.</label>
                      <input type="text" className="form-control" name="license_number" value={formData.license_number} onChange={handleInputChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label">Category</label>
                      <select className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="LMV">LMV</option>
                        <option value="HMV">HMV</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col">
                      <label className="form-label">Expiry (MM/YYYY)</label>
                      <input type="text" className="form-control" name="expiry" value={formData.expiry} onChange={handleInputChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label">Contact</label>
                      <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
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