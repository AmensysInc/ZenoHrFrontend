import React, { useEffect } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AddEmployee from "./Employee/AddEmployee";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import AddOrder from "./PurchaseOrder/AddOrder";
import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
import AddWithHoldTracking from "./WithHoldTracking/AddWithHoldTracking";
import EditEmployee from "./Employee/EditEmployee";
import Login from "./pages/Login";
import EditOrder from "./PurchaseOrder/EditOrder";
import EditWithHoldTracking from "./WithHoldTracking/EditWithHoldTracking";
import Breadcrumb from "./pages/Breadcrumbs";
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
import CandidateList from "./Candidates/CandidateList";
import MarketingList from "./Marketing/MarketingList";
import EditCandidate from "./Candidates/EditCandidate";
import AddCandidate from "./Candidates/AddCandidate";
import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import useLocalStorage from "./pages/useLocalStorage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
  const [role, setRole] = useLocalStorage("role", "");

  const handleLogin = (userRole) => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  };

  useEffect(() => {}, [isLoggedIn, role]);

  return (
    <div className="App">
      <Router>
        <Navbar
          location={window.location}
          setIsLoggedIn={setIsLoggedIn}
          setRole={setRole}
        />
        {isLoggedIn && shouldRenderBreadcrumb() && <Breadcrumb />}
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 bg-light">
              {isLoggedIn &&
                (role === "ADMIN" ||
                  role === "RECRUITER" ||
                  role === "SALES") &&
                !window.location.pathname.includes("change-password") && (
                  <Sidebar />
                )}
            </div>
            <div className="col-md-10"></div>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {isLoggedIn ? (
                role === "ADMIN" ? (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/adduser" element={<AddEmployee />} />
                    <Route
                      path="/editemployee/:employeeId"
                      element={<EditEmployee />}
                    />
                    <Route
                      path="/orders/:employeeId"
                      element={<PurchaseOrder />}
                    />
                    <Route
                      path="/orders/:employeeId/:orderId/editorder"
                      element={<EditOrder />}
                    />
                    <Route
                      path="/orders/:employeeId/addorder"
                      element={<AddOrder />}
                    />
                    <Route
                      path="/tracking/:employeeId"
                      element={<WithHoldTracking />}
                    />
                    <Route
                      path="/tracking/:employeeId/:trackingId/edittracking"
                      element={<EditWithHoldTracking />}
                    />
                    <Route
                      path="/tracking/:employeeId/addtracking"
                      element={<AddWithHoldTracking />}
                    />
                    <Route
                      path="/editemployee/:employeeId/project-history"
                      element={<ProjectHistory />}
                    />
                    <Route
                      path="/editemployee/:employeeId/project-history/:projectId/editproject"
                      element={<EditProjectHistory />}
                    />
                    <Route
                      path="/editemployee/:employeeId/project-history/add-project"
                      element={<AddProjectHistory />}
                    />
                    <Route
                      path="/editemployee/:employeeId/visa-details"
                      element={<VisaDetails />}
                    />
                    <Route
                      path="/editemployee/:employeeId/visa-details/:visaId/editvisadetails"
                      element={<EditVisaDetails />}
                    />
                    <Route
                      path="/editemployee/:employeeId/visa-details/add-visa-details"
                      element={<AddVisaDetails />}
                    />
                    <Route
                      path="/purchase-orders"
                      element={<PurchaseOrders />}
                    />
                    <Route
                      path="/change-password/:id"
                      element={
                        <ChangePasswordForm
                          location={window.location}
                          setIsLoggedIn={setIsLoggedIn}
                          setRole={setRole}
                        />
                      }
                    />
                    <Route
                      path="/addprospect"
                      element={<AddProspectEmployee />}
                    />
                    <Route path="/candidates" element={<CandidateList />} />
                    <Route path="/addcandidate" element={<AddCandidate />} />
                    <Route
                      path="/editcandidate/:candidateID"
                      element={<EditCandidate />}
                    />
                    <Route path="/marketing" element={<MarketingList />} />
                    <Route
                      path="/marketing/editcandidate/:candidateID"
                      element={<EditCandidate />}
                    />
                  </>
                ) : role === "EMPLOYEE" ? (
                  <>
                    <Route
                      path="/change-password/:id"
                      element={
                        <ChangePasswordForm
                          location={window.location}
                          setIsLoggedIn={setIsLoggedIn}
                          setRole={setRole}
                        />
                      }
                    />
                    <Route path="/" element={<EmployeeDetails />} />
                    <Route path="/trackings" element={<Tracking />} />
                    <Route path="/withholdSheet" element={<WithHoldSheet />} />
                  </>
                ) : role === "PROSPECT" ? (
                  <>
                    <Route path="/" element={<ProspetEmployee />} />
                    <Route path="/uploadDocs" element={<ProspectDocument />} />
                    <Route
                      path="/change-password/:id"
                      element={
                        <ChangePasswordForm
                          location={window.location}
                          setIsLoggedIn={setIsLoggedIn}
                          setRole={setRole}
                        />
                      }
                    />
                  </>
                ) : role === "RECRUITER" ? (
                  <>
                    <Route path="/" element={<RecruiterDashboard />} />
                    <Route path="/marketing" element={<MarketingList />} />
                    <Route
                      path="/marketing/editcandidate/:candidateID"
                      element={<EditCandidate />}
                    />
                    <Route
                      path="/change-password/:id"
                      element={
                        <ChangePasswordForm
                          location={window.location}
                          setIsLoggedIn={setIsLoggedIn}
                          setRole={setRole}
                        />
                      }
                    />
                  </>
                ) : role === "SALES" ? (
                  <>
                    <Route path="/candidates" element={<CandidateList />} />
                    <Route path="/addcandidate" element={<AddCandidate />} />
                    <Route path="/" element={<RecruiterDashboard />} />
                    <Route
                      path="/editcandidate/:candidateID"
                      element={<EditCandidate />}
                    />
                    <Route path="/marketing" element={<MarketingList />} />
                    <Route
                      path="/marketing/editcandidate/:candidateID"
                      element={<EditCandidate />}
                    />
                    <Route
                      path="/change-password/:id"
                      element={
                        <ChangePasswordForm
                          location={window.location}
                          setIsLoggedIn={setIsLoggedIn}
                          setRole={setRole}
                        />
                      }
                    />
                  </>
                ) : (
                  <Route path="/*" element={<Navigate to="/login" />} />
                )
              ) : (
                <Route path="/*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
  function shouldRenderBreadcrumb() {
    const isChangePasswordRoute =
      window.location.pathname.includes("change-password");
    return !isChangePasswordRoute;
  }
}

export default App;
