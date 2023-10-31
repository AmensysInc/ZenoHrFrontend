import React, { useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./SharedComponents/layout/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
import ProjectHistory from "./ProjectHistory/ProjectHistory";
import VisaDetails from "./VisaDetails/VisaDetails";
import Tracking from "./EmployeeAccess/Tracking";
import EmployeeDetails from "./EmployeeAccess/EmployeeDetails";
import WithHoldSheet from "./EmployeeAccess/WithHoldSheet";
import Sidebar from "./SharedComponents/layout/Sidebar";
import PurchaseOrders from "./PurchaseOrder/AllPurchaseOrders";
import ChangePasswordForm from "./SharedComponents/authUtils/ChangePasswordForm";
import ForgotPassword from "./SharedComponents/authUtils/ForgotPassword";
import ProspetEmployee from "./ProspetEmployee/ProspetEmployee";
import AddProspectEmployee from "./ProspetEmployee/AddProspectEmployee";
import ProspectDocument from "./ProspetEmployee/ProspectDocument";
import CandidateList from "./Candidates/CandidateList";
import MarketingList from "./Marketing/MarketingList";
import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import useLocalStorage from "./SharedComponents/useLocalStorage";
import Employee from "./Employee/Employee";
import Login from "./SharedComponents/authUtils/Login";
import Breadcrumbs from "./SharedComponents/Breadcrumbs";
import EmployeeForm from "./Employee/EmployeeForm";
import PurchaseOrderForm from "./PurchaseOrder/PurchaseOrderForm";
import WithHoldTrackingForm from "./WithHoldTracking/WithHoldTrackingForm";
import ProjectHistoryForm from "./ProjectHistory/ProjectHistoryForm";
import VisaDetailsForm from "./VisaDetails/VisaDetailsForm";
import CandidateForm from "./Candidates/CandidateForm";

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
        {isLoggedIn && shouldRenderBreadcrumb() && <Breadcrumbs/>}
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
                    <Route path="/" element={<Employee/>} />
                    <Route path="/adduser" element={<EmployeeForm mode= "add" />} />
                    <Route
                      path="/editemployee/:employeeId"
                      element={<EmployeeForm mode= "edit"/>}
                    />
                    <Route
                      path="/orders/:employeeId"
                      element={<PurchaseOrder />}
                    />
                    <Route
                      path="/orders/:employeeId/:orderId/editorder"
                      element={<PurchaseOrderForm mode= "edit" />}
                    />
                    <Route
                      path="/orders/:employeeId/addorder"
                      element={<PurchaseOrderForm mode= "add"/>}
                    />
                    <Route
                      path="/tracking/:employeeId"
                      element={<WithHoldTracking />}
                    />
                    <Route
                      path="/tracking/:employeeId/:trackingId/edittracking"
                      element={<WithHoldTrackingForm mode="edit"/>}
                    />
                    <Route
                      path="/tracking/:employeeId/addtracking"
                      element={<WithHoldTrackingForm mode="add"/>}
                    />
                    <Route
                      path="/editemployee/:employeeId/project-history"
                      element={<ProjectHistory />}
                    />
                    <Route
                      path="/editemployee/:employeeId/project-history/:projectId/editproject"
                      element={<ProjectHistoryForm mode="edit"/>}
                    />
                    <Route
                      path="/editemployee/:employeeId/project-history/add-project"
                      element={<ProjectHistoryForm mode="add" />}
                    />
                    <Route
                      path="/editemployee/:employeeId/visa-details"
                      element={<VisaDetails/>}
                    />
                    <Route
                      path="/editemployee/:employeeId/visa-details/:visaId/editvisadetails"
                      element={<VisaDetailsForm mode="edit"  />}
                    />
                    <Route
                      path="/editemployee/:employeeId/visa-details/add-visa-details"
                      element={<VisaDetailsForm mode="add"  />}
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
                    <Route path="/addcandidate" element={<CandidateForm mode="add" />} />
                    <Route
                      path="/editcandidate/:candidateID"
                      element={<CandidateForm mode="edit" />}
                    />
                    <Route path="/marketing" element={<MarketingList />} />
                    <Route
                      path="/marketing/editcandidate/:candidateID"
                      element={<CandidateForm mode="edit" />}
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
                      element={<CandidateForm mode="edit" />}
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
                    <Route path="/addcandidate" element={<CandidateForm mode="add" />} />
                    <Route path="/" element={<RecruiterDashboard />} />
                    <Route
                      path="/editcandidate/:candidateID"
                      element={<CandidateForm mode="edit" />}
                    />
                    <Route path="/marketing" element={<MarketingList />} />
                    <Route
                      path="/marketing/editcandidate/:candidateID"
                      element={<CandidateForm mode="edit" />}
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
