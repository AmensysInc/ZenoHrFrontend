// import React, { useState } from "react";
// import "./App.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "./layout/Navbar";
// import Home from "./pages/Home";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import AddUser from "./Employee/Employee";
// import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
// import AddOrder from "./PurchaseOrder/AddOrder";
// import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
// import AddWithHoldTracking from "./WithHoldTracking/AddWithHoldTracking";
// import EditEmployee from "./Employee/EditEmployee";
// import Login from "./pages/Login";
// import EditOrder from "./PurchaseOrder/EditOrder";
// import EditWithHoldTracking from "./WithHoldTracking/EditWithHoldTracking";
// import Breadcrumb from "./Breadcrumbs";

// function useLocalStorage(key, initialValue) {
//   const [storedValue, setStoredValue] = useState(() => {
//     try {
//       const item = window.localStorage.getItem(key);
//       return item ? JSON.parse(item) : initialValue;
//     } catch (error) {
//       console.error("Error getting data from localStorage:", error);
//       return initialValue;
//     }
//   });

//   const setValue = (value) => {
//     try {
//       setStoredValue(value);
//       window.localStorage.setItem(key, JSON.stringify(value));
//     } catch (error) {
//       console.error("Error setting data to localStorage:", error);
//     }
//   };

//   return [storedValue, setValue];
// }

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
  
//   const[role,setRole] = useState({});

//   const handleLogin = (role) => {
//     setIsLoggedIn(true);
//     setRole(role);
//   };

//   return (
//     <div className="App">
//       <Router>
//         <Navbar location={window.location}/>
//         {isLoggedIn && <Breadcrumb/>}
//         <Routes>
//         <Route exact path="/login" element={<Login onLogin={handleLogin}/>} />
//           {isLoggedIn ? 
//           (
//           <>
//           <Route exact path="/" element={<Home />} />
//           <Route exact path="/adduser" element={<AddUser/>} />
//           <Route exact path="/orders/addorder" element={<AddOrder />} />
//           <Route exact path="/orders" element={<PurchaseOrder />} />
//           <Route path="/orders/editorder" element={<EditOrder/>} />
//           <Route exact path="/tracking" element={<WithHoldTracking />} />
//           <Route path="/tracking/edittracking" element={<EditWithHoldTracking/> } />
//           <Route exact path="/tracking/addtracking" element={<AddWithHoldTracking/>} />
//           <Route exact path="/editemployee" element={<EditEmployee />} />
//           </>
//           ) : (
//             <Route path="/*" element={<Navigate to="/login" />} />
//           )}
//         </Routes>
//       </Router>
//     </div>
//   );
// }
// export default App;


import React, { useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./Employee/Employee";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import AddOrder from "./PurchaseOrder/AddOrder";
import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
import AddWithHoldTracking from "./WithHoldTracking/AddWithHoldTracking";
import EditEmployee from "./Employee/EditEmployee";
import Login from "./pages/Login";
import EditOrder from "./PurchaseOrder/EditOrder";
import EditWithHoldTracking from "./WithHoldTracking/EditWithHoldTracking";
import Breadcrumb from "./Breadcrumbs";
import ProjectHistory from "./ProjectHistory/ProjectHistory";
import VisaDetails from "./VisaDetails/VisaDetails";
import EditProjectHistory from "./ProjectHistory/EditProjectHistory";
import AddProjectHistory from "./ProjectHistory/AddProjectHistory";
import EditVisaDetails from "./VisaDetails/EditVisaDetails";
import AddVisaDetails from "./VisaDetails/AddVisaDetails";
import Tracking from "./EmployeeAccess/Tracking";
import EmployeeDetails from "./EmployeeAccess/EmployeeDetails";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error getting data from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting data to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
  
  const[role,setRole] = useLocalStorage("role", "");

  const handleLogin = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  return (
    <div className="App">
      <Router>
        <Navbar location={window.location} />
        {role === "ADMIN" && <Breadcrumb />}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {role === "ADMIN" ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/adduser" element={<AddUser />} />
              <Route path="/orders" element={<PurchaseOrder />} />
              <Route path="/orders/addorder" element={<AddOrder />} />
              <Route path="/orders/editorder" element={<EditOrder />} />
              <Route path="/tracking" element={<WithHoldTracking />} />
              <Route path="/tracking/edittracking" element={<EditWithHoldTracking />} />
              <Route path="/withholdtracking/addtracking" element={<AddWithHoldTracking />} />
              <Route path="/editemployee" element={<EditEmployee />} />
              <Route path="/editemployee/project-history" element={<ProjectHistory />} />
              <Route path="/editemployee/project-history/addproject" element={<AddProjectHistory/>} />
              <Route path="/editemployee/project-history/editprojecthistory" element={<EditProjectHistory/>} />
              <Route path="/editemployee/visa-details" element={<VisaDetails/>} />
              <Route path="/editemployee/visa-details/addvisadetails" element={<AddVisaDetails/>} />
              <Route path="/editemployee/visa-details/editvisadetails" element={<EditVisaDetails/>} />
            </>
          ) : role === "EMPLOYEE" ? (
            <>
              <Route path="/" element={<EmployeeDetails/>} />
              <Route path="/trackings" element={<Tracking/>} />
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
            
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
