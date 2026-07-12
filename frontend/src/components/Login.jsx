import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '', 
    role: 'Dispatcher' 
  });
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Wireframe Requirement: Account locked after 5 failed attempts
    if (failedAttempts >= 5) {
      setError('Account locked after 5 failed attempts. Please contact IT.');
      return;
    }

    // Mock validation for demo purposes
    if (!credentials.email || !credentials.password) {
      setFailedAttempts(prev => prev + 1);
      setError('Invalid credentials. Please try again.');
      return;
    }

    // On successful login, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="container-fluid min-vh-100 p-0">
      <div className="row g-0 min-vh-100">
        
        {/* Left Side: Branding & Info */}
        <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-5" style={{ backgroundColor: '#1a1f2b', color: '#ffffff' }}>
          <div>
            {/* CSS Grid Logo */}
            <div className="mb-4" style={{ width: '45px', height: '45px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
              {[...Array(16)].map((_, i) => (
                <div key={i} style={{ backgroundColor: '#f59e0b', borderRadius: '1px' }}></div>
              ))}
            </div>
            
            <h2 className="fw-bold mb-1" style={{ letterSpacing: '0.5px' }}>TransitOps</h2>
            <p className="text-muted mb-5" style={{ fontSize: '0.95rem' }}>Smart Transport Operations Platform</p>
            
            <div className="mt-5 pt-4">
              <h5 className="mb-4 fw-normal">One login, four roles:</h5>
              <ul className="list-unstyled" style={{ fontSize: '1.05rem', lineHeight: '2.2' }}>
                <li className="d-flex align-items-center mb-2">
                  <span style={{ color: '#f59e0b', marginRight: '12px', fontSize: '1.2rem' }}>•</span> Fleet Manager
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span style={{ color: '#f59e0b', marginRight: '12px', fontSize: '1.2rem' }}>•</span> Dispatcher
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span style={{ color: '#f59e0b', marginRight: '12px', fontSize: '1.2rem' }}>•</span> Safety Officer
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span style={{ color: '#f59e0b', marginRight: '12px', fontSize: '1.2rem' }}>•</span> Financial Analyst
                </li>
              </ul>
            </div>
          </div>
          
          <div className="small text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
            TRANSITOPS © 2026 • RBAC ENABLED
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-md-7 bg-white d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            
            <h3 className="fw-bold mb-1 text-dark">Sign in to your account</h3>
            <p className="text-muted mb-4 pb-2" style={{ fontSize: '0.9rem' }}>Enter your credentials to continue</p>
            
            {/* Error Banner */}
            {error && (
              <div className="alert py-2 d-flex align-items-center small mb-4" style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px dashed #ef4444' }}>
                <span className="me-2 fw-bold">✕</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>EMAIL</label>
                <input 
                  type="email" 
                  className="form-control p-2" 
                  name="email"
                  placeholder="raven.k@transitops.in"
                  value={credentials.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>PASSWORD</label>
                <input 
                  type="password" 
                  className="form-control p-2" 
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>ROLE (RBAC)</label>
                <select 
                  className="form-select p-2" 
                  name="role" 
                  value={credentials.role} 
                  onChange={handleInputChange}
                >
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label small" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <a href="#" className="small text-decoration-none" style={{ color: '#0ea5e9' }}>Forgot password?</a>
              </div>

              <button 
                type="submit" 
                className="btn w-100 fw-bold border-0 p-2 mb-4 text-dark" 
                style={{ backgroundColor: '#f5b00b', fontSize: '1rem' }}
              >
                Sign In
              </button>
            </form>

            {/* Scope Helper Text */}
            <div className="mt-3 pt-4 border-top">
              <p className="text-muted small mb-2">Access is scoped by role after login:</p>
              <ul className="list-unstyled text-muted small" style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
                <li>• Fleet Manager → Fleet, Maintenance</li>
                <li>• Dispatcher → Dashboard, Trips</li>
                <li>• Safety Officer → Drivers, Compliance</li>
                <li>• Financial Analyst → Fuel & Expenses, Analytics</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;