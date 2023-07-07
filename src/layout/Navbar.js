import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

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

          {location.pathname !== "/orders" ? (
            location.pathname === "/tracking" ? (
              <Link className="btn btn-outline-light" to="/addtracking">
                Add WithHoldTracking
              </Link>
            ) : (
              <Link className="btn btn-outline-light" to="/adduser">
                Add Employee
              </Link>
            )
          ) : (
            <Link className="btn btn-outline-light" to="/addorder">
              Add PurchaseOrder
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";

// export default function Navbar() {
//   const location = useLocation();
//   const [activePage, setActivePage] = useState("");

//   useEffect(() => {
//     setActivePage(location.pathname);
//   }, [location]);

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

//           {activePage !== "/orders" ? (
//             <Link className="btn btn-outline-light" to="/adduser">
//               {activePage === "/tracking" ? "Add WithHoldTracking" : "Add Employee"}
//             </Link>
//           ) : (
//             <Link className="btn btn-outline-light" to="/addorder">
//               Add PurchaseOrder
//             </Link>
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// }

/*
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

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

          {location.pathname !== "/orders" ? (
            <Link className="btn btn-outline-light" to="/adduser">
              Add Employee
            </Link>
          ) : (
            <Link className="btn btn-outline-light" to="/addorder">
              Add PurchaseOrder
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
*/