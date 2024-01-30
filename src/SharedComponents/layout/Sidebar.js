import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function SideBar() {
  const roleFromSessionStorage = sessionStorage.getItem("role");
  const role = roleFromSessionStorage
    ? roleFromSessionStorage.replace(/"/g, "")
    : "";

  if (role === "ADMIN") {
    return (
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/companies" className="sidebar-link">
              Company Details
            </Link>
          </li>
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
          <li className="sidebar-item">
          <Link to="/timeSheets" className="sidebar-link">
            TimeSheets
          </Link>
        </li>
        <li className="sidebar-item">
            <Link to="/email" className="sidebar-link">
              Send Email
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/contacts" className="sidebar-link">
              Contacts
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/bulkemail" className="sidebar-link">
              Bulk Email
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
  } else if(role === "RECRUITER") {
    return (
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/marketing" className="sidebar-link">
              Marketing List
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/contacts" className="sidebar-link">
              Contacts
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/email" className="sidebar-link">
              Send Email
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/bulkemail" className="sidebar-link">
              Bulk Email
            </Link>
          </li>
        </ul>
      </div>
    );
  }
  else if(role === "EMPLOYEE") {
    return (
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/timeSheets" className="sidebar-link">
              TimeSheets
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
