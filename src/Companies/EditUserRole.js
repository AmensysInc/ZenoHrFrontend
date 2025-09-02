import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditUserRole.css";

const EditUserRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleData, setRoleData] = useState({
    role: "",
    userId: "",
    defaultCompany: false,
    companyId: "",
  });

  const [userName, setUserName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch role data
        const roleResponse = await axios.get(
          `${API_URL}/user-company/${id}`,
          config
        );
        setRoleData(roleResponse.data);

        // Fetch users and find the matching user
        const userResponse = await axios.get(`${API_URL}/users`, config);
        const matchedUser = userResponse.data.find(
          (user) => user.id === roleResponse.data.userId
        );

        if (matchedUser) {
          setUserName(`${matchedUser.firstname} ${matchedUser.lastname}`);
        } else {
          setUserName("User not found");
        }

        // Fetch companies
        const companyResponse = await axios.get(`${API_URL}/companies`, config);
        setCompanies(companyResponse.data.content);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setRoleData({ ...roleData, defaultCompany: value === "true" });
    } else {
      setRoleData({ ...roleData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/user-company/${id}`, roleData, config);
      if (roleData.defaultCompany === true) {
        sessionStorage.setItem("defaultCompanyId", roleData.companyId);
      }
      alert("Role updated successfully!");
      navigate("/companyrole");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-user-role-container">
      <h2>Edit User Role</h2>
      <form onSubmit={handleSubmit} className="edit-user-role-form">
        {/* <label>
          Role:
          <select
            name="role"
            value={roleData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="RECRUITER">RECRUITER</option>
            <option value="SALES">SALES</option>
          </select>
        </label> */}

        <label>
          User:
          <input type="text" value={userName} readOnly />
        </label>

        <label>
          Company:
          <select
            name="companyId"
            value={roleData.companyId}
            onChange={handleChange}
            required
          >
            <option value="">Select Company</option>
            {Array.isArray(companies) &&
              companies.map((company) => (
                <option key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </option>
              ))}
          </select>
        </label>

        <label>
          Default Company:
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <label>
              <input
                type="checkbox"
                name="defaultCompany"
                value="true"
                checked={roleData.defaultCompany === true}
                onChange={handleChange}
              />
              True
            </label>
            <label>
              <input
                type="checkbox"
                name="defaultCompany"
                value="false"
                checked={roleData.defaultCompany === false}
                onChange={handleChange}
              />
              False
            </label>
          </div>
        </label>

        <button type="submit">Update Role</button>
      </form>
    </div>
  );
};

export default EditUserRole;