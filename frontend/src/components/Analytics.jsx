const Analytics = () => {
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <input type="text" className="form-control w-25" placeholder="Search..." />
      </div>

      <div className="row mb-5">
        <div className="col">
          <div className="card shadow-sm border-0 border-start border-primary border-4">
            <div className="card-body">
              <small className="text-muted d-block mb-1">FUEL EFFICIENCY</small>
              <h3 className="mb-0">8.4 km/l</h3>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-sm border-0 border-start border-success border-4">
            <div className="card-body">
              <small className="text-muted d-block mb-1">FLEET UTILIZATION</small>
              <h3 className="mb-0">81%</h3>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-sm border-0 border-start border-warning border-4">
            <div className="card-body">
              <small className="text-muted d-block mb-1">OPERATIONAL COST</small>
              <h3 className="mb-0">34,070</h3>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-sm border-0 border-start border-success border-4">
            <div className="card-body">
              <small className="text-muted d-block mb-1">VEHICLE ROI</small>
              <h3 className="mb-0">14.2%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-7">
          <h6 className="text-muted mb-3">MONTHLY REVENUE (MOCKUP)</h6>
          <div className="bg-white p-4 shadow-sm rounded d-flex align-items-end gap-2" style={{height: '250px'}}>
            <div className="bg-primary opacity-75 w-100" style={{height: '40%'}}></div>
            <div className="bg-primary w-100" style={{height: '60%'}}></div>
            <div className="bg-primary opacity-75 w-100" style={{height: '55%'}}></div>
            <div className="bg-primary w-100" style={{height: '80%'}}></div>
            <div className="bg-primary opacity-75 w-100" style={{height: '75%'}}></div>
            <div className="bg-primary w-100" style={{height: '95%'}}></div>
          </div>
        </div>
        
        <div className="col-md-5">
          <h6 className="text-muted mb-3">TOP COSTLIEST VEHICLES</h6>
          <div className="bg-white p-4 shadow-sm rounded" style={{height: '250px'}}>
            <div className="mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <span>TRUCK-11</span>
              </div>
              <div className="progress" style={{height: '10px'}}>
                <div className="progress-bar bg-danger w-75"></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <span>MINI-03</span>
              </div>
              <div className="progress" style={{height: '10px'}}>
                <div className="progress-bar bg-warning w-50"></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <span>VAN-05</span>
              </div>
              <div className="progress" style={{height: '10px'}}>
                <div className="progress-bar bg-primary w-25"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;