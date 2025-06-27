import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "./UserRole.css";
import { BsFillPersonPlusFill } from "react-icons/bs";

const UserRole = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleRes = await axios.get("http://localhost:8082/user-company", config);
        const userRes = await axios.get("http://localhost:8082/users", config);

        setRoles(roleRes.data);
        setUsers(userRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (role) => {
    navigate(`/editcompanyrole/${role.id}`);
  };

  const handleAdd = () => {
    navigate("/addcompanyrole");
  };

  const getUserFullName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : "Unknown";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-role-container">
      <div className="header-with-add">
        <h2>User Role Information</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
                  <Link
                    className="add-user-link"
                    to="/addcompanyrole"
                    style={{ marginRight: "10px" }}
                  >
                    <BsFillPersonPlusFill size={25} title="Add DefaultCompany" />
                  </Link>
                </div>
      </div>
      <table className="user-role-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Company</th>
            <th>Default</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{getUserFullName(role.userId)}</td>
              <td>{role.company?.companyName || "Unknown"}</td>
              <td>{role.defaultCompany === "true" || role.defaultCompany === true ? "✅ Yes" : "No"}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(role)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRole;