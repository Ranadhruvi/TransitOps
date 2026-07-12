import React from 'react';

const TripDispatcher = () => {
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="row">
        {/* Left Column: Create Trip Form */}
        <div className="col-md-5 pe-4 border-end">
          <h6 className="text-muted mb-4">CREATE TRIP</h6>
          <form>
            <div className="mb-3">
              <label className="form-label small text-muted">SOURCE</label>
              <input type="text" className="form-control" defaultValue="Gandhinagar Depot" />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">DESTINATION</label>
              <input type="text" className="form-control" defaultValue="Ahmedabad Hub" />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">VEHICLE (AVAILABLE ONLY)</label>
              <select className="form-select"><option>VAN-05 - 500 kg capacity</option></select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">DRIVER (AVAILABLE ONLY)</label>
              <select className="form-select"><option>Alex</option></select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">CARGO WEIGHT (KG)</label>
              <input type="number" className="form-control border-danger" defaultValue="700" />
            </div>
            <div className="mb-4">
              <label className="form-label small text-muted">PLANNED DISTANCE (KM)</label>
              <input type="number" className="form-control" defaultValue="38" />
            </div>

            {/* Validation Error Banner */}
            <div className="alert alert-danger p-2 small mb-3">
              <strong>Vehicle Capacity: 500 kg</strong><br/>
              Cargo Weight: 700 kg<br/>
              ✕ Capacity exceeded by 200 kg — dispatch blocked
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-secondary w-50" disabled>Dispatch (disabled)</button>
              <button type="button" className="btn btn-light border w-50">Cancel</button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Board */}
        <div className="col-md-7 ps-4">
          <h6 className="text-muted mb-4">LIVE BOARD</h6>
          
          <div className="card shadow-sm mb-3 border-0 border-start border-primary border-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <strong className="d-block mb-1">TR001 <span className="text-muted fw-normal ms-2">VAN-05 / ALEX</span></strong>
                <small className="text-muted d-block mb-2">Gandhinagar Depot → Ahmedabad Hub</small>
                <span className="badge bg-primary">Dispatched</span>
              </div>
              <span className="text-muted small">45 min</span>
            </div>
          </div>

          <div className="card shadow-sm mb-3 border-0 border-start border-secondary border-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <strong className="d-block mb-1">TR004 <span className="text-muted fw-normal ms-2">TRUCK-04 / SURESH</span></strong>
                <small className="text-muted d-block mb-2">Vatva Industrial Area → Sanand Warehouse</small>
                <span className="badge bg-secondary">Draft</span>
              </div>
              <span className="text-muted small">Awaiting driver</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDispatcher;