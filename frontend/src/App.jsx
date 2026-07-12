import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard'; // <--- THIS WAS LIKELY MISSING
import VehicleRegistry from './components/VehicleRegistry';
import Drivers from './components/Drivers';
import TripDispatcher from './components/TripDispatcher';
import Maintenance from './components/Maintenance';
import FuelExpenses from './components/FuelExpenses';
import Analytics from './components/Analytics';

const MainLayout = () => (
  <div className="d-flex min-vh-100 bg-light">
    <div style={{ width: '250px', flexShrink: 0 }}>
      <Sidebar />
    </div>
    <div className="flex-grow-1 overflow-auto p-4">
      <Outlet />
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<VehicleRegistry />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/dispatch" element={<TripDispatcher />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel" element={<FuelExpenses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<div className="p-4"><h4>Settings</h4></div>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;