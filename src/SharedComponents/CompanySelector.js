import React, { useEffect, useState } from "react";
import { Select, message } from "antd";
import { SwapOutlined } from "@ant-design/icons";

const { Option } = Select;

const CompanySelector = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState(
    Number(sessionStorage.getItem("defaultCompanyId"))
  );
  const userRole = sessionStorage.getItem("role");
  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

  // Only show for ADMIN users (SADMIN doesn't need it)
  if (userRole !== "ADMIN") {
    return null;
  }

  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("id");

        if (!userId || !token) {
          return;
        }

        setLoading(true);
        const response = await fetch(`${apiUrl}/user-company/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const roles = await response.json();
        const companyList = roles
          .map((role) => role.company)
          .filter((company) => company != null); // Filter out null companies

        setCompanies(companyList);

        // Set current company if not set or if it's not in the list
        const currentId = Number(sessionStorage.getItem("defaultCompanyId"));
        const currentCompany = companyList.find(
          (c) => c.companyId === currentId
        );

        if (companyList.length > 0) {
          if (!currentCompany) {
            // If current company not found, set the first one as default
            const firstCompany = companyList[0];
            sessionStorage.setItem("defaultCompanyId", firstCompany.companyId);
            setCurrentCompanyId(firstCompany.companyId);
          }
        }
      } catch (error) {
        console.error("Error fetching user companies:", error);
        message.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompanies();
  }, []);

  const handleCompanyChange = async (companyId) => {
    if (!companyId) return;

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("id");

    try {
      // Update the default company in user-company roles
      const rolesResponse = await fetch(`${apiUrl}/user-company/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!rolesResponse.ok) throw new Error("Failed to fetch user roles");
      const roles = await rolesResponse.json();

      // Update all roles: set selected as default, others as false
      await Promise.all(
        roles.map(async (role) => {
          const isSelected = Number(role.companyId) === Number(companyId);
          const updateBody = {
            id: role.id,
            userId: role.userId,
            companyId: role.companyId,
            role: role.role,
            defaultCompany: isSelected ? "true" : "false",
            createdAt: new Date(role.createdAt).toISOString().split("T")[0],
          };

          const updateResponse = await fetch(`${apiUrl}/user-company/${role.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateBody),
          });

          if (!updateResponse.ok) throw new Error("Failed to update role");
        })
      );

      // Update session storage
      sessionStorage.setItem("defaultCompanyId", companyId);
      setCurrentCompanyId(Number(companyId));

      // Trigger a storage event so other components can react
      window.dispatchEvent(new Event("storage"));

      // Reload the page to refresh all data with new company context
      window.location.reload();
    } catch (error) {
      console.error("Error updating default company:", error);
      message.error("Failed to switch company");
    }
  };

  if (companies.length === 0) {
    return null;
  }

  const currentCompany = companies.find(
    (c) => c.companyId === currentCompanyId
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <SwapOutlined style={{ color: "#fff", fontSize: 16 }} />
      <Select
        value={currentCompanyId}
        onChange={handleCompanyChange}
        loading={loading}
        style={{
          minWidth: 200,
          color: "#fff",
        }}
        dropdownStyle={{ color: "#000" }}
        suffixIcon={<SwapOutlined style={{ color: "#fff" }} />}
      >
        {companies.map((company) => (
          <Option key={company.companyId} value={company.companyId}>
            {company.companyName}
          </Option>
        ))}
      </Select>
      {currentCompany && (
        <span style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>
          {currentCompany.companyName}
        </span>
      )}
    </div>
  );
};

export default CompanySelector;

