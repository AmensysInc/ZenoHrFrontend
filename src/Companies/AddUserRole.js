import { useEffect, useState } from "react";
import axios from "axios";
import "./AddUserRole.css";
import { useNavigate } from "react-router-dom";

const AddUserRole = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [userId, setUserId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [defaultCompany, setDefaultCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, companyRes] = await Promise.all([
          axios.get(`${API_URL}/users`, config),
          axios.get(`${API_URL}/companies?page=0&size=100`, config),
        ]);

        // Ensure the response is as expected
        setEmployees(userRes.data || []);
        setCompanies(companyRes.data?.content || []);
      } catch (err) {
        console.error("Error loading users or companies", err);
        setEmployees([]);
        setCompanies([]);
      }
    };

    fetchData();
  }, []);

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

  const handleDefaultCheckboxChange = (value) => {
    setDefaultCompany((prev) => (prev === value ? "" : value));
  };

  return (
    <div className="add-user-role-container">
      <h2>Add Company User Role</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User:
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">-- Select User --</option>
            {employees?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} {user.lastname}
              </option>
            ))}
          </select>
        </label>

        <label>
          Company:
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">-- Select Company --</option>
            {companies?.map((comp) => (
              <option key={comp.companyId} value={comp.companyId}>
                {comp.companyName}
              </option>
            ))}
          </select>
        </label>

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

        {/* <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">-- Select Role --</option>
            <option value="ADMIN">ADMIN</option>
            <option value="RECRUITER">RECRUITER</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="SALES">SALES</option>
          </select>
        </label> */}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Add User Role"}
        </button>
      </form>
    </div>
  );
};

export default AddUserRole;