import { useEffect, useState } from "react";
import axios from "axios";
import "./AddUserRole.css";
import { useNavigate } from "react-router-dom";

const AddUserRole = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [assignedCompanies, setAssignedCompanies] = useState([]);

  const [userId, setUserId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [defaultCompany, setDefaultCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ===============================
  // 🔄 LOAD USERS & COMPANIES
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, companyRes] = await Promise.all([
          axios.get(`${API_URL}/users`, config),
          axios.get(`${API_URL}/companies?page=0&size=100`, config),
        ]);

        // Filter out users with role 'EMPLOYEE' or 'PROSPECT'
        const filteredUsers = (userRes.data || []).filter(
          (user) =>
            user.role?.toUpperCase() !== "EMPLOYEE" &&
            user.role?.toUpperCase() !== "PROSPECT"
        );

        setEmployees(filteredUsers);
        setCompanies(companyRes.data?.content || []);
      } catch (err) {
        console.error("Error loading users or companies", err);
        setEmployees([]);
        setCompanies([]);
      }
    };

    fetchData();
  }, []);

  // ===============================
  // 📦 LOAD ASSIGNED COMPANIES FOR SELECTED USER
  // ===============================
  useEffect(() => {
    const fetchAssignedCompanies = async () => {
      if (!userId) {
        setAssignedCompanies([]);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/user-company`, config);

        // Collect all companyIds where this userId matches
        const assigned = res.data
          .filter((item) => item.userId === userId)
          .map((item) => item.companyId);

        setAssignedCompanies(assigned);
      } catch (error) {
        console.error("Error fetching assigned companies", error);
      }
    };

    fetchAssignedCompanies();
  }, [userId]);

  // ===============================
  // 🧮 FILTER COMPANIES (hide assigned)
  // ===============================
  const availableCompanies = companies.filter(
    (comp) => !assignedCompanies.includes(comp.companyId)
  );

  // ===============================
  // 💾 SUBMIT HANDLER
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !companyId || defaultCompany === "") {
      alert("Please select all fields including Default Company.");
      return;
    }

    const payload = {
      userId,
      companyId: parseInt(companyId),
      defaultCompany,
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/user-company`, payload, config);
      alert("User role added successfully!");
      setUserId("");
      setCompanyId("");
      setDefaultCompany("");
      navigate("/companyrole");
    } catch (error) {
      console.error("Error adding user role", error);
      alert("Failed to add user role.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // ✅ CHECKBOX HANDLER
  // ===============================
  const handleDefaultCheckboxChange = (value) => {
    setDefaultCompany((prev) => (prev === value ? "" : value));
  };

  // ===============================
  // 🎨 RENDER FORM
  // ===============================
  return (
    <div className="add-user-role-container">
      <h2>Add Company User Role</h2>
      <form onSubmit={handleSubmit}>
        {/* User Dropdown */}
        <label>
          User:
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {employees?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} {user.lastname}
                {user.role ? ` – ${user.role}` : ""}
              </option>
            ))}
          </select>
        </label>

        {/* Company Dropdown */}
        <label>
          Company:
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            disabled={!userId}
          >
            <option value="">
              {userId
                ? "-- Select Company --"
                : "-- Select User First --"}
            </option>
            {availableCompanies.length > 0 ? (
              availableCompanies.map((comp) => (
                <option key={comp.companyId} value={comp.companyId}>
                  {comp.companyName}
                </option>
              ))
            ) : (
              userId && <option disabled>No available companies</option>
            )}
          </select>
        </label>

        {/* Default Company Checkbox */}
        <label>
          Default Company:
          <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
            <label>
              <input
                type="checkbox"
                checked={defaultCompany === "true"}
                onChange={() => handleDefaultCheckboxChange("true")}
              />
              True
            </label>
            <label>
              <input
                type="checkbox"
                checked={defaultCompany === "false"}
                onChange={() => handleDefaultCheckboxChange("false")}
              />
              False
            </label>
          </div>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Add User Role"}
        </button>
      </form>
    </div>
  );
};

export default AddUserRole;
