const FuelExpenses = () => {
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="text-muted mb-0">FUEL LOGS</h6>
        <div className="d-flex gap-2">
          <button className="btn btn-warning fw-bold">+ Log Fuel</button>
          <button className="btn btn-outline-warning fw-bold text-dark">+ Add Expense</button>
        </div>
      </div>

      <table className="table table-hover bg-white shadow-sm rounded mb-5">
        <thead>
          <tr className="text-muted small">
            <th>VEHICLE</th>
            <th>DATE</th>
            <th>LITERS</th>
            <th>FUEL COST</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>VAN-05</td>
            <td>05 Jul 2026</td>
            <td>42 L</td>
            <td>3,150</td>
          </tr>
          <tr>
            <td>TRUCK-11</td>
            <td>06 Jul 2026</td>
            <td>110 L</td>
            <td>8,400</td>
          </tr>
        </tbody>
      </table>

      <h6 className="text-muted mb-3">OTHER EXPENSES (TOLL / MISC)</h6>
      <table className="table table-hover bg-white shadow-sm rounded">
        <thead>
          <tr className="text-muted small">
            <th>TRIP</th>
            <th>VEHICLE</th>
            <th>TOLL</th>
            <th>OTHER</th>
            <th>MAINT. (LINKED)</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TR001</td>
            <td>VAN-05</td>
            <td>120</td>
            <td>0</td>
            <td>0</td>
            <td><span className="badge bg-success">Available</span></td>
          </tr>
          <tr>
            <td>TR002</td>
            <td>TRK-12</td>
            <td>340</td>
            <td>150</td>
            <td>18,000</td>
            <td><span className="badge bg-success">Completed</span></td>
          </tr>
        </tbody>
      </table>
      
      <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3 border-2 border-dark">
        <strong>TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT</strong>
        <strong className="text-warning">34,070</strong>
      </div>
    </div>
  );
};

export default FuelExpenses;