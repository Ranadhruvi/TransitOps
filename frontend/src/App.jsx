import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VehicleRegistry from './components/VehicleRegistry';
import TripDispatcher from './components/TripDispatcher';
// New imports below
import Drivers from './components/Drivers';
import Maintenance from './components/Maintenance';
import FuelExpenses from './components/FuelExpenses';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<VehicleRegistry />} />
        <Route path="/dispatch" element={<TripDispatcher />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel" element={<FuelExpenses />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;