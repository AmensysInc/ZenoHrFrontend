import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function SideBar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
            Employees
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/purchase-orders" className="sidebar-link">
            Purchase Orders
          </Link>
        </li>
      </ul>
    </div>
  );
}

