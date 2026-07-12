import React from 'react';

const Login = () => {
  return (
    <div className="container-fluid vh-100 p-0 d-flex">
      {/* Left Dark Panel */}
      <div className="col-md-4 bg-dark text-white d-flex flex-column justify-content-center p-5">
        <h2 className="text-warning mb-0">TransitOps</h2>
        <p className="text-muted mb-5">Smart Transport Operations Platform</p>
        
        <h5 className="mb-3">One login, four roles:</h5>
        <ul className="list-unstyled">
          <li className="mb-2"><span className="text-warning me-2">•</span>Fleet Manager</li>
          <li className="mb-2"><span className="text-warning me-2">•</span>Dispatcher</li>
          <li className="mb-2"><span className="text-warning me-2">•</span>Safety Officer</li>
          <li className="mb-2"><span className="text-warning me-2">•</span>Financial Analyst</li>
        </ul>
      </div>

      {/* Right Login Form */}
      <div className="col-md-8 d-flex align-items-center justify-content-center">
        <div className="w-50">
          <h3 className="mb-1">Sign in to your account</h3>
          <p className="text-muted mb-4">Enter your credentials to continue</p>
          
          <form>
            <div className="mb-3">
              <label className="form-label small text-muted">EMAIL</label>
              <input type="email" className="form-control" placeholder="raven.k@transitops.in" />
            </div>
            
            <div className="mb-3">
              <label className="form-label small text-muted">PASSWORD</label>
              <input type="password" className="form-control" placeholder="********" />
            </div>

            <div className="mb-4">
              <label className="form-label small text-muted">ROLE (RBAC)</label>
              <select className="form-select">
                <option>Dispatcher</option>
                <option>Fleet Manager</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </select>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="remember" />
                <label className="form-check-label small" htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="text-primary small text-decoration-none">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-warning w-100 fw-bold">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;