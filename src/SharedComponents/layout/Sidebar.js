import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function SideBar() {
  const roleFromSessionStorage = sessionStorage.getItem("role");
  const role = roleFromSessionStorage
    ? roleFromSessionStorage.replace(/"/g, "")
    : "";

  if (role === "ADMIN" || role === "SADMIN") {
    return (
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/companies" className="sidebar-link">
              Companies
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/" className="sidebar-link">
              Employees
            </Link>
          </li>
          {/* <li className="sidebar-item">
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
          </li> */}
          <li className="sidebar-item">
            <Link to="/timeSheets" className="sidebar-link">
              TimeSheets
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/alltimeSheets" className="sidebar-link">
              All-TimeSheets
            </Link>
          </li>
          {/* <li className="sidebar-item">
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
          </li> */}
          {role === "SADMIN" && (
            <li className="sidebar-item">
              <Link to="/companyrole" className="sidebar-link">
                User Role
              </Link>
            </li>
          )}
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
  } else if (role === "RECRUITER") {
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
  } else if (role === "EMPLOYEE") {
    return (
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/timeSheets" className="sidebar-link">
              Monthly Time Sheets
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/weeklytimeSheets" className="sidebar-link">
              Weekly Time Sheets
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/trackings" className="sidebar-link">
              WithHold Tracking
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/withholdSheet" className="sidebar-link">
              WithHold Sheet
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/contactus" className="sidebar-link">
              Contact us
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
