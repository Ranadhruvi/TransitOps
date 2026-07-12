import React from 'react';

const Dashboard = () => {
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Top Search & Profile */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
        <div className="d-flex align-items-center">
          <span className="me-3 text-muted">Raven K.</span>
          <span className="badge bg-secondary rounded-circle p-2">RK</span>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex gap-3 mb-4">
        <select className="form-select w-auto"><option>Vehicle Type: All</option></select>
        <select className="form-select w-auto"><option>Status: All</option></select>
        <select className="form-select w-auto"><option>Region: All</option></select>
      </div>

      {/* KPI Cards */}
      <div className="row mb-5">
        {[
          { title: 'ACTIVE VEHICLES', val: '53', border: 'border-primary' },
          { title: 'AVAILABLE VEHICLES', val: '42', border: 'border-success' },
          { title: 'VEHICLES IN MAINTENANCE', val: '05', border: 'border-warning' },
          { title: 'ACTIVE TRIPS', val: '18', border: 'border-primary' },
          { title: 'PENDING TRIPS', val: '09', border: 'border-secondary' },
          { title: 'FLEET UTILIZATION', val: '81%', border: 'border-success' }
        ].map((kpi, index) => (
          <div className="col" key={index}>
            <div className={`card shadow-sm border-0 border-start border-4 ${kpi.border}`}>
              <div className="card-body py-2">
                <small className="text-muted d-block mb-1">{kpi.title}</small>
                <h3 className="mb-0">{kpi.val}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trips Table */}
      <div>
        <h6 className="text-muted mb-3">RECENT TRIPS</h6>
        <table className="table table-hover bg-white shadow-sm rounded">
          <thead>
            <tr className="text-muted small">
              <th>TRIP</th>
              <th>VEHICLE</th>
              <th>DRIVER</th>
              <th>STATUS</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TR001</td>
              <td>VAN-05</td>
              <td>Alex</td>
              <td><span className="badge bg-primary">On Trip</span></td>
              <td>45 min</td>
            </tr>
            <tr>
              <td>TR002</td>
              <td>TRK-12</td>
              <td>John</td>
              <td><span className="badge bg-success">Completed</span></td>
              <td>--</td>
            </tr>
            <tr>
              <td>TR004</td>
              <td>--</td>
              <td>--</td>
              <td><span className="badge bg-secondary">Draft</span></td>
              <td>Awaiting vehicle</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;