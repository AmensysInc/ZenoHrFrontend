import React, { useEffect, useState } from "react";

import "../src/App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Shared Components
import Sidebar from "./SharedComponents/layout/Sidebar";
import useSessionStorage from "./SharedComponents/useSessionStorage";
import Breadcrumbs from "./SharedComponents/Breadcrumbs";
import Login from "./SharedComponents/authUtils/Login";
import ForgotPassword from "./SharedComponents/authUtils/ForgotPassword";
import ChangePasswordForm from "./SharedComponents/authUtils/ChangePasswordForm";

// Modules
import Dashboard from "./Dashboard/Dashboard";
import Employee from "./Employee/Employee";
import EmployeeForm from "./Employee/EmployeeForm";
import EmployeeDetails from "./EmployeeAccess/EmployeeDetails";
import WithHoldSheet from "./EmployeeAccess/WithHoldSheet";
import Tracking from "./EmployeeAccess/Tracking";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import PurchaseOrders from "./PurchaseOrder/AllPurchaseOrders";
import PurchaseOrderForm from "./PurchaseOrder/PurchaseOrderForm";
import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
import WithHoldTrackingForm from "./WithHoldTracking/WithHoldTrackingForm";
import ProjectHistory from "./ProjectHistory/ProjectHistory";
import ProjectHistoryForm from "./ProjectHistory/ProjectHistoryForm";
import AllProjects from "./ProjectHistory/AllProjects";
import VisaDetails from "./VisaDetails/VisaDetails";
import VisaDetailsForm from "./VisaDetails/VisaDetailsForm";
import VisaDetailsGrid from "./VisaDetails/VisaDetailsGrid";
import TimeSheets from "./TimeSheets/TimeSheets";
import AllTimeSheets from "./TimeSheets/AllTimeSheets";
import WeeklyTimesheet from "./TimeSheets/WeeklyTimesheet";
import Companies from "./Companies/Companies";
import SelectCompany from "./Companies/SelectCompany";
import UserRole from "./Companies/UserRole";
import AddUserRole from "./Companies/AddUserRole";
import EditUserRole from "./Companies/EditUserRole";
import AddAdmin from "./Admin/AddAdmin";
import CompanyContact from "./Companies/CompanyContact";
import CompanyEmployees from "./Companies/CompanyEmployees";
import EmailTemplateForm from "./EmailTemplates/EmailTemplateForm";
import EmailTemplateList from "./EmailTemplates/EmailTemplateList";
import EmailTemplateEdit from "./EmailTemplates/EmailTemplateEdit";
import LeaveApplicationForm from "./LeaveApplicationForm/LeaveApplicationForm";
import AddLeaveBalance from "./LeaveApplicationForm/AddLeaveBalance";
import LeaveBalanceList from "./LeaveApplicationForm/AddLeaveBalance";
import AnnouncementForm from "./Announcements/AnnouncementForm";
import AnnouncementGrid from "./Announcements/AnnouncementGrid";
import ProfitAndLoss from "./Profit&Loss/ProfitAndLoss";
import ProspetEmployee from "./ProspetEmployee/ProspetEmployee";
import AddProspectEmployee from "./ProspetEmployee/AddProspectEmployee";
import ProspectDocument from "./ProspetEmployee/ProspectDocument";
import CandidateList from "./Candidates/CandidateList";
import CandidateForm from "./Candidates/CandidateForm";
import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import EmailForm from "./Recruiter/EmailForm";
import BulkMailForm from "./Recruiter/BulkMailForm";
import Contacts from "./Contacts/Contacts";
import ContactForm from "./Contacts/ContactForm";
import Files from "./Employee/Files";
import EmployeeFilesGrid from "./Employee/EmployeeFilesGrid";
import WeekFileUploader from "./EmployeeAccess/WeekFileUploader";
import AllEmployeeFiles from "./Employee/AllEmployeeFiles";
import EditCompany from "./Companies/EditCompany";
import AddCompany from "./Companies/AddCompany";
import Paystubs from "./Paystubs/Paystubs";
import PaystubsManagement from "./Paystubs/PaystubsManagement";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useSessionStorage("isLoggedIn", false);
  const [role, setRole] = useSessionStorage("role", "");
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  // ✅ Handle login and session restore
  const handleLogin = (userRole) => {
    if (sessionStorage.getItem("token")) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  };

  // ✅ Auto-redirect and session cleanup
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // If no token but loggedIn is still true, reset
    if (!token && isLoggedIn) {
      setIsLoggedIn(false);
      setRole("");
    }

    // If not logged in and not already on login/forgot/change-password → redirect
    const authPaths = ["/login", "/forgot-password", "/change-password"];
    const onAuthPage = authPaths.some((path) =>
      location.pathname.includes(path)
    );

    if (!isLoggedIn && !onAuthPage) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // ✅ Determine which pages should hide the sidebar
  const isAuthPage =
    location.pathname.includes("/login") ||
    location.pathname.includes("/forgot-password") ||
    location.pathname.includes("/change-password");

  const shouldRenderBreadcrumb = () => !isAuthPage;

  return (
    <div className="app">
      {/* ✅ Sidebar layout (visible only when logged in and not on auth pages) */}
      {isLoggedIn && !isAuthPage ? (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setIsLoggedIn={setIsLoggedIn}
            setRole={setRole}
          />

          <div
            style={{
              flex: 1,
              marginLeft: collapsed ? 100 : 295,
              backgroundColor: "#f8f9fa",
              overflowX: "auto",
              display: "flex",
              flexDirection: "column",
              transition: "margin-left 0.2s ease",
              height: "100vh",
            }}
          >
            {shouldRenderBreadcrumb() && <Breadcrumbs />}
            <Routes>{renderRoutes(role)}</Routes>
          </div>
        </div>
      ) : (
        // ✅ Auth-only routes (no sidebar)
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/change-password/:id"
            element={
              <ChangePasswordForm
                setIsLoggedIn={setIsLoggedIn}
                setRole={setRole}
              />
            }
          />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );

  // ✅ Role-based routes
  function renderRoutes(role) {
    // Normalize role - remove quotes and trim, handle both string and JSON-parsed values
    const normalizedRole = typeof role === 'string' 
      ? role.replace(/^"|"$/g, "").trim() 
      : String(role || "").replace(/^"|"$/g, "").trim();
    
    switch (normalizedRole) {
      // ---------------- ADMIN / SADMIN / GROUP_ADMIN ----------------
      case "ADMIN":
      case "SADMIN":
      case "GROUP_ADMIN":
        return (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/company/:companyId" element={<CompanyEmployees />} />
            <Route
              path="/profit-loss/:employeeId"
              element={<ProfitAndLoss />}
            />
            <Route path="/announcements" element={<AnnouncementGrid />} />
            <Route path="/addannouncements" element={<AnnouncementForm />} />
            <Route path="/apply-leave" element={<LeaveApplicationForm />} />
            <Route
              path="/addleavebalance/:employeeId"
              element={<LeaveBalanceList />}
            />
            <Route path="/employees" element={<Employee />} />
            <Route path="/adduser" element={<EmployeeForm mode="add" />} />
            <Route
              path="/editemployee/:employeeId"
              element={<EmployeeForm mode="edit" />}
            />
            <Route path="/addprospect" element={<AddProspectEmployee />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/orders/:employeeId" element={<PurchaseOrder />} />
            <Route
              path="/orders/:employeeId/:orderId/editorder"
              element={<PurchaseOrderForm mode="edit" />}
            />
            <Route
              path="/orders/:employeeId/addorder"
              element={<PurchaseOrderForm mode="add" />}
            />
            <Route
              path="/tracking/:employeeId"
              element={<WithHoldTracking />}
            />
            <Route
              path="/tracking/:employeeId/:trackingId/edittracking"
              element={<WithHoldTrackingForm mode="edit" />}
            />
            <Route
              path="/tracking/:employeeId/addtracking"
              element={<WithHoldTrackingForm mode="add" />}
            />
            <Route
              path="/editemployee/:employeeId/project-history"
              element={<ProjectHistory />}
            />
            <Route
              path="/editemployee/:employeeId/project-history/add-project"
              element={<ProjectHistoryForm mode="add" />}
            />
            <Route
              path="/editemployee/:employeeId/project-history/:projectId/editproject"
              element={<ProjectHistoryForm mode="edit" />}
            />
            <Route path="/projects" element={<AllProjects />} />
            <Route
              path="/editemployee/:employeeId/visa-details"
              element={<VisaDetails />}
            />
            <Route path="/visa-details" element={<VisaDetailsGrid />} />
            <Route
              path="/editemployee/:employeeId/visa-details/add-visa-details"
              element={<VisaDetailsForm mode="add" />}
            />
            <Route
              path="/editemployee/:employeeId/visa-details/:visaId/editvisadetails"
              element={<VisaDetailsForm mode="edit" />}
            />
            <Route
              path="/email-template/create"
              element={<EmailTemplateForm />}
            />
            <Route path="/email-templates" element={<EmailTemplateList />} />
            <Route
              path="/email-template/edit/:id"
              element={<EmailTemplateEdit />}
            />
            <Route path="/uploadedfiles" element={<EmployeeFilesGrid />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/addcontact" element={<ContactForm mode="add" />} />
            <Route
              path="/editcontact/:id"
              element={<ContactForm mode="edit" />}
            />
            <Route path="/companies" element={<Companies />} />
            <Route path="/addcompany" element={<AddCompany />} />
            <Route path="/editcompany/:companyId" element={<EditCompany />} />
            <Route path="/selectcompanies" element={<SelectCompany />} />
            <Route path="/email" element={<EmailForm />} />
            <Route path="/bulkemail" element={<BulkMailForm />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route
              path="/addcandidate"
              element={<CandidateForm mode="add" />}
            />
            <Route
              path="/editcandidate/:candidateID"
              element={<CandidateForm mode="edit" />}
            />
            <Route path="/marketing" element={<CandidateList inMarketing />} />
            <Route
              path="/marketing/editcandidate/:candidateID"
              element={<CandidateForm mode="edit" />}
            />
            <Route path="/timeSheets" element={<TimeSheets />} />
            <Route path="/alltimeSheets" element={<AllTimeSheets />} />
            <Route path="/weeklytimeSheets" element={<WeeklyTimesheet />} />
            <Route path="/allemployeefiles" element={<AllEmployeeFiles />} />
            <Route path="/paystubs" element={<PaystubsManagement />} />
            {role === "SADMIN" && (
              <>
                <Route path="/companyrole" element={<UserRole />} />
                <Route path="/addcompanyrole" element={<AddUserRole />} />
                <Route path="/editcompanyrole/:id" element={<EditUserRole />} />
                <Route path="/addadmin" element={<AddAdmin />} />
              </>
            )}
          </>
        );

      // ---------------- EMPLOYEE ----------------
      case "EMPLOYEE":
      case '"EMPLOYEE"': // Handle quoted role from sessionStorage
        return (
          <>
            <Route path="/" element={<EmployeeDetails />} />
            <Route path="/trackings" element={<Tracking />} />
            <Route path="/withholdSheet" element={<WithHoldSheet />} />
            <Route path="/timeSheets" element={<TimeSheets />} />
            <Route path="/weeklytimeSheets" element={<WeeklyTimesheet />} />
            <Route path="/contactus" element={<CompanyContact />} />
            <Route path="/myfiles" element={<Files />} />
            <Route path="/announcements" element={<AnnouncementGrid />} />
            <Route path="/uploads" element={<WeekFileUploader />} />
            <Route path="/paystubs" element={<Paystubs />} />
          </>
        );

      // ---------------- PROSPECT ----------------
      case "PROSPECT":
        return (
          <>
            <Route path="/" element={<ProspetEmployee />} />
            <Route path="/uploadDocs" element={<ProspectDocument />} />
          </>
        );

      // ---------------- RECRUITER ----------------
      case "RECRUITER":
        return (
          <>
            <Route path="/" element={<RecruiterDashboard />} />
            <Route path="/email" element={<EmailForm />} />
            <Route path="/bulkemail" element={<BulkMailForm />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/addcontact" element={<ContactForm mode="add" />} />
            <Route
              path="/editcontact/:id"
              element={<ContactForm mode="edit" />}
            />
            <Route path="/marketing" element={<CandidateList inMarketing />} />
            <Route
              path="/marketing/editcandidate/:candidateID"
              element={<CandidateForm mode="edit" />}
            />
          </>
        );

      // ---------------- SALES ----------------
      case "SALES":
        return (
          <>
            <Route path="/" element={<RecruiterDashboard />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route
              path="/addcandidate"
              element={<CandidateForm mode="add" />}
            />
            <Route
              path="/editcandidate/:candidateID"
              element={<CandidateForm mode="edit" />}
            />
            <Route path="/marketing" element={<CandidateList inMarketing />} />
            <Route
              path="/marketing/editcandidate/:candidateID"
              element={<CandidateForm mode="edit" />}
            />
          </>
        );

      // ---------------- REPORTING_MANAGER ----------------
      case "REPORTING_MANAGER":
        return (
          <>
            <Route path="/" element={<Employee />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/allemployeefiles" element={<AllEmployeeFiles />} />
          </>
        );

      // ---------------- DEFAULT ----------------
      default:
        return <Route path="/*" element={<Navigate to="/login" />} />;
    }
  }
}

export default App;
