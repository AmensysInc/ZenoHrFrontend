import React, { useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddEmployee from "./Employee/AddEmployee";
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
import WithHoldSheet from "./EmployeeAccess/WithHoldSheet";
import Sidebar from "./layout/Sidebar";
import PurchaseOrders from "./SidebarComponents/PurchaseOrders";
import ChangePasswordForm from "./pages/ChangePasswordForm";
import ForgotPassword from "./pages/ForgotPassword";
import ProspetEmployee from "./ProspetEmployee/ProspetEmployee";
import AddProspectEmployee from "./ProspetEmployee/AddProspectEmployee";
import ProspectDocument from "./ProspetEmployee/ProspectDocument";

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
    if(localStorage.getItem("token")){
      setIsLoggedIn(true);
      setRole(userRole);
    }
  };

  return (
    <div className="App">
      <Router>
        <Navbar location={window.location} setIsLoggedIn ={setIsLoggedIn} setRole ={setRole}/>
        {isLoggedIn && <Breadcrumb/>}
        <div className="container-fluid">
          <div className="row">
          <div className="col-md-2 bg-light">
              {isLoggedIn && role === "ADMIN" && <Sidebar/>}
            </div>
            <div className="col-md-10"></div>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          {isLoggedIn ?(
            role === "ADMIN" ? (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/adduser" element={<AddEmployee />} />
                    <Route path="/editemployee/:employeeId" element={<EditEmployee />} />
                    <Route path="/orders/:employeeId" element={<PurchaseOrder />} />
                    <Route path="/orders/:employeeId/:orderId/editorder" element={<EditOrder />} />
                    <Route path="/orders/:employeeId/addorder" element={<AddOrder />} />
                    <Route path="/tracking/:employeeId" element={<WithHoldTracking />} />
                    <Route path="/tracking/:employeeId/:trackingId/edittracking" element={<EditWithHoldTracking />} />
                    <Route path="/tracking/:employeeId/addtracking" element={<AddWithHoldTracking />} />
                    <Route path="/editemployee/:employeeId/project-history" element={<ProjectHistory />} />
                    <Route path="/editemployee/:employeeId/project-history/:projectId/editproject" element={<EditProjectHistory />} />
                    <Route path="/editemployee/:employeeId/project-history/add-project" element={<AddProjectHistory/>} />
                    <Route path="/editemployee/:employeeId/visa-details" element={<VisaDetails/>} />
                    <Route path="/editemployee/:employeeId/visa-details/:visaId/editvisadetails" element={<EditVisaDetails/>} />
                    <Route path="/editemployee/:employeeId/visa-details/add-visa-details" element={<AddVisaDetails/>} />
                    <Route path="/purchase-orders" element={<PurchaseOrders/>}/>
                    <Route path="/change-password/:id" element={<ChangePasswordForm/>}/>
                    <Route path="/addprospect" element={<AddProspectEmployee/>}/>

                  </>
                ): role === "EMPLOYEE"? (
                      <>
                        <Route path="/change-password/:id" element={<ChangePasswordForm/>}/>
                        <Route path="/" element={<EmployeeDetails/>} />
                        <Route path="/trackings" element={<Tracking/>} />
                        <Route path="/withholdSheet" element={<WithHoldSheet/>} />
                      </>
                    ): role === "PROSPECT"? (
                      <>
                        <Route path="/" element={<ProspetEmployee/>} />
                        <Route path="/uploadDocs" element={<ProspectDocument/>}/>
                        <Route path="/change-password/:id" element={<ChangePasswordForm/>}/>

                      </>
                    ):(
                      <Route path="/*" element={<Navigate to="/login" />} />                          
                   )
          ):(
             <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
        </div>
        </div>
        
      </Router>
    </div>
  );
}

export default App;
