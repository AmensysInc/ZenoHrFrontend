import React from "react";
import './Navbar.css';
import { Link, useLocation } from "react-router-dom";
import { BsBoxArrowInLeft, BsFillPersonPlusFill } from "react-icons/bs";

export default function Navbar({setIsLoggedIn, setRole}) {

  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole("");
    window.location.href = "/login";
  };

  if (location.pathname === "/login") {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Quick HRMS
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Quick HRMS
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
              <>
                {/* <Link className="btn btn-outline-light" to="/adduser">
                  <BsFillPersonPlusFill size={20}/>
                </Link> */}
                  <BsBoxArrowInLeft size={30} onClick={handleLogout} className="logout-icon" title="logout"/>
              </>
        </div>
      </nav>
    </div>
  );
}