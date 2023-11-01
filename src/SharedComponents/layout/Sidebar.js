import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function SideBar() {
  const roleFromLocalStorage = localStorage.getItem("role");
  const role = roleFromLocalStorage
    ? roleFromLocalStorage.replace(/"/g, "")
    : "";

  if (role !== "RECRUITER" && role !== "SALES") {
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
          <li className="sidebar-item">
            <Link to="/candidates" className="sidebar-link">
              Candidate List
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/marketing" className="sidebar-link">
              Marketing List
            </Link>
          </li>
        </ul>
      </div>
    );
  } else if (role === "SALES") {
    return (
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/candidates" className="sidebar-link">
              Candidate List
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/marketing" className="sidebar-link">
              Marketing List
            </Link>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/marketing" className="sidebar-link">
              Marketing List
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
