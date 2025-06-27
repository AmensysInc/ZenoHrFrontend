import { useEffect, useState } from "react";
import "./SelectCompany.css";

const SelectCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [defaultCompanyId, setDefaultCompanyId] = useState(
    Number(sessionStorage.getItem("defaultCompanyId"))
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("id");

        if (!userId || !token) {
          throw new Error("Missing user ID or token");
        }

        const response = await fetch(
          `http://localhost:8082/user-company/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const roles = await response.json();
        const companyList = roles.map((role) => role.company); // Extract only the company info

        setCompanies(companyList);

        const selectedCompany = companyList.find(
          (c) => c.companyId === defaultCompanyId
        );
        if (selectedCompany) {
          setSelectedCompanyName(selectedCompany.companyName);
        }
      } catch (error) {
        console.error("Error fetching user companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompanies();
  }, [defaultCompanyId]);

  const handleSelect = async (companyId, companyName) => {
    const userId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    let userRole = sessionStorage.getItem("role");

    if (!userId || !token || !userRole) {
      console.error("Missing userId, token or role in sessionStorage");
      return;
    }
    // Clean the role string from sessionStorage if needed
    userRole = userRole.replace(/^"|"$/g, "");
    setUpdating(true);
    try {
      // 1. Get all user-company roles for the current user
      const rolesResponse = await fetch(
        `http://localhost:8082/user-company/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!rolesResponse.ok) throw new Error("Failed to fetch user roles");
      const roles = await rolesResponse.json();
      await Promise.all(
        roles.map(async (role) => {
          const cleanedRole = role.role ? role.role.replace(/^"|"$/g, "") : "";
          const updateBody = {
            id: role.id,
            userId: role.userId,
            companyId: role.companyId,
            role: cleanedRole,
            defaultCompany: "false",
            createdAt: new Date(role.createdAt).toISOString().split("T")[0],
          };

          const updateResponse = await fetch(
            `http://localhost:8082/user-company/${role.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateBody),
            }
          );

          if (!updateResponse.ok) throw new Error("Failed to update role");
        })
      );

      const selectedRole = roles.find(
        (role) => Number(role.companyId) === Number(companyId)
      );

      if (selectedRole) {
        const cleanedRole = selectedRole.role
          ? selectedRole.role.replace(/^"|"$/g, "")
          : "";
        const updatedRole = {
          id: selectedRole.id,
          userId: selectedRole.userId,
          companyId: selectedRole.companyId,
          role: cleanedRole,
          defaultCompany: "true",
          createdAt: new Date(selectedRole.createdAt)
            .toISOString()
            .split("T")[0],
        };

        const updateResponse = await fetch(
          `http://localhost:8082/user-company/${selectedRole.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRole),
          }
        );

        if (!updateResponse.ok)
          throw new Error("Failed to update selected role");
      } else {
        // Create new role for selected company
        const newRole = {
          userId,
          companyId,
          role: userRole,
          defaultCompany: "true",
          createdAt: new Date().toISOString().split("T")[0],
        };

        const createResponse = await fetch(
          "http://localhost:8082/user-company",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newRole),
          }
        );

        if (!createResponse.ok) throw new Error("Failed to create new role");
      }
      sessionStorage.setItem("defaultCompanyId", companyId);
      setDefaultCompanyId(companyId);
      setSelectedCompanyName(companyName);
    } catch (error) {
      console.error("Error updating default company:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>Company List</h2>

      {selectedCompanyName && (
        <p className="selected-company">
          Selected Company: <strong>{selectedCompanyName}</strong>
        </p>
      )}

      <table className="company-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Company ID</th>
            <th>Company Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company.companyId}
              className={
                company.companyId === defaultCompanyId ? "highlight-row" : ""
              }
            >
              <td>
                <button
                  className={`select-btn ${
                    company.companyId === defaultCompanyId ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleSelect(company.companyId, company.companyName)
                  }
                  disabled={updating || company.companyId === defaultCompanyId}
                >
                  {company.companyId === defaultCompanyId
                    ? "Selected"
                    : "Select"}
                </button>
              </td>
              <td>{company.companyId}</td>
              <td>{company.companyName}</td>
              <td>{company.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelectCompany;