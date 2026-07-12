const Drivers = () => {
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-warning fw-bold">+ Add Driver</button>
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
          <tr>
            <td>Alex</td>
            <td>DL-88213</td>
            <td>LMV</td>
            <td>12/2028</td>
            <td>98765xxxxx</td>
            <td>96%</td>
            <td><span className="badge bg-success">Available</span></td>
            <td><span className="badge bg-success">Available</span></td>
          </tr>
          <tr>
            <td>John</td>
            <td>DL-44120</td>
            <td>HMV</td>
            <td>03/2025 EXPIRE</td>
            <td>98220xxxxx</td>
            <td>81%</td>
            <td><span className="badge bg-danger">Suspended</span></td>
            <td><span className="badge bg-danger">Suspended</span></td>
          </tr>
          <tr>
            <td>Priya</td>
            <td>DL-77031</td>
            <td>LMV</td>
            <td>08/2027</td>
            <td>99110xxxxx</td>
            <td>99%</td>
            <td><span className="badge bg-primary">On Trip</span></td>
            <td><span className="badge bg-primary">On Trip</span></td>
          </tr>
        </tbody>
      </table>
      
      <div className="d-flex gap-2">
        <span className="badge bg-success p-2">Available</span>
        <span className="badge bg-primary p-2">On Trip</span>
        <span className="badge bg-secondary p-2">Off Duty</span>
        <span className="badge bg-danger p-2">Suspended</span>
      </div>
      <small className="text-danger d-block mt-2">Rule: Expired license or Suspended status → blocked from trip assignment</small>
    </div>
  );
};

export default Drivers;