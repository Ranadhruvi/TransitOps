import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/vehicles', label: 'Fleet' },
    { to: '/drivers', label: 'Drivers' },
    { to: '/dispatch', label: 'Trips' },
    { to: '/maintenance', label: 'Maintenance' },
    { to: '/fuel', label: 'Fuel & Expenses' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/settings', label: 'Settings' }
  ];

  return (
    <div className="bg-white border-end h-100 p-3">
      <h4 className="fw-bold px-3 mb-4 mt-2">TransitOps</h4>
      <ul className="nav nav-pills flex-column gap-1">
        {links.map(link => (
          <li className="nav-item" key={link.to}>
            <NavLink 
              to={link.to} 
              className={({ isActive }) => 
                `nav-link px-3 ${isActive ? 'bg-warning text-dark fw-bold' : 'text-secondary'}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;