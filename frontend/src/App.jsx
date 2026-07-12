import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VehicleRegistry from './components/VehicleRegistry';
import TripDispatcher from './components/TripDispatcher';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Main Application Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<VehicleRegistry />} />
        <Route path="/dispatch" element={<TripDispatcher />} />
      </Routes>
    </Router>
  );
}

export default App;