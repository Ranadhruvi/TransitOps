import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // For the hackathon demo, we will do a simple mock authentication.
    // If they enter any email and password, we let them in.
    if (credentials.email && credentials.password) {
      // Redirect to the main dashboard
      navigate('/dashboard');
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%' }}>
        
        {/* Header Section */}
        <div className="card-header bg-primary text-white text-center py-4 border-0">
          <h3 className="mb-0 fw-bold">TransitOps</h3>
          <small className="text-light opacity-75">Fleet Management System</small>
        </div>

        {/* Form Section */}
        <div className="card-body p-4 p-md-5">
          <h5 className="text-center mb-4 text-secondary">Sign In to Dashboard</h5>
          
          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted fw-bold">EMAIL ADDRESS</label>
              <input 
                type="email" 
                className="form-control form-control-lg bg-light fs-6" 
                name="email"
                placeholder="admin@transitops.com"
                value={credentials.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label small text-muted fw-bold">PASSWORD</label>
                <a href="#" className="small text-decoration-none">Forgot?</a>
              </div>
              <input 
                type="password" 
                className="form-control form-control-lg bg-light fs-6" 
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleInputChange}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold">
              Access System
            </button>
          </form>

          <div className="text-center mt-4 text-muted small">
            Demo Mode: Enter any credentials to proceed.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;