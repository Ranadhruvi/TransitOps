const Maintenance = () => {
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="row">
        {/* Left Form */}
        <div className="col-md-4 pe-4 border-end">
          <h6 className="text-muted mb-4">LOG SERVICE RECORD</h6>
          <form>
            <div className="mb-3">
              <label className="form-label small text-muted">VEHICLE</label>
              <input type="text" className="form-control" defaultValue="VAN-05" />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">SERVICE TYPE</label>
              <input type="text" className="form-control" defaultValue="Oil Change" />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">COST</label>
              <input type="number" className="form-control" defaultValue="2500" />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">DATE</label>
              <input type="date" className="form-control" defaultValue="2026-07-07" />
            </div>
            <div className="mb-4">
              <label className="form-label small text-muted">STATUS</label>
              <select className="form-select"><option>Active</option></select>
            </div>
            <button type="button" className="btn btn-warning w-100 fw-bold mb-3">Save</button>
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
                <th>VEHICLE</th>
                <th>SERVICE</th>
                <th>COST</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VAN-05</td>
                <td>Oil Change</td>
                <td>2,500</td>
                <td><span className="badge bg-warning text-dark">In Shop</span></td>
              </tr>
              <tr>
                <td>TRUCK-11</td>
                <td>Engine Repair</td>
                <td>18,000</td>
                <td><span className="badge bg-success">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;