import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              {isLoggedIn ? (
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  {location.pathname !== "/login" && (
                    <Link className="btn btn-outline-light" to="/login">
                      Login
                    </Link>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}


// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// export default function Navbar() {
//   const location = useLocation();

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container-fluid">
//           <Link className="navbar-brand" to="/">
//             Quick HRMS
//           </Link>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           {location.pathname !== "/orders" ? (
//             location.pathname === "/tracking" ? (
//               <Link className="btn btn-outline-light" to="/addtracking">
//                 Add WithHoldTracking
//               </Link>
//             ) : (
//               <Link className="btn btn-outline-light" to="/adduser">
//                 Add Employee
//               </Link>
//             )
//           ) : null}
//         </div>
//       </nav>
//     </div>
//   );
// }