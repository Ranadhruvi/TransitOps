import React from 'react';

const VehicleRegistry = () => {
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
        <button className="btn btn-warning fw-bold">+ Add Vehicle</button>
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
          <tr>
            <td>GJ01AB4521</td>
            <td>VAN-05</td>
            <td>Van</td>
            <td>500 kg</td>
            <td>74,000</td>
            <td>6,20,000</td>
            <td><span className="badge bg-success">Available</span></td>
          </tr>
          <tr>
            <td>GJ01AB9981</td>
            <td>TRUCK-11</td>
            <td>Truck</td>
            <td>5 Ton</td>
            <td>182,000</td>
            <td>24,50,000</td>
            <td><span className="badge bg-primary">On Trip</span></td>
          </tr>
          <tr>
            <td>GJ01AB1120</td>
            <td>MINI-03</td>
            <td>Mini</td>
            <td>1 Ton</td>
            <td>66,000</td>
            <td>4,10,000</td>
            <td><span className="badge bg-warning text-dark">In Shop</span></td>
          </tr>
        </tbody>
      </table>
      <small className="text-danger">Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher</small>
    </div>
  );
};

export default VehicleRegistry;