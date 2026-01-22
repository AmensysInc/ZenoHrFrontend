import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Space,
  Tooltip,
  message,
  Popconfirm,
  Button,
  Tag,
} from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;

export default function UserRole() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleRes, userRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/user-company`, config).catch(() => ({ data: [] })), // Handle 403 gracefully
          axios.get(`${API_BASE_URL}/users`, config),
        ]);
        setRoles(roleRes.data || []);
        setUsers(userRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load roles or users.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const getUserFullName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : "Unknown";
  };

  const getUserRole = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.role || "—";
  };

  const handleDelete = async (roleId, userId, userRole) => {
    try {
      // Always delete the user completely, not just the role
      // This ensures complete deletion for all roles (ADMIN, GROUP_ADMIN, REPORTING_MANAGER, EMPLOYEE, etc.)
      await axios.delete(`${API_BASE_URL}/users/${userId}`, config);
      message.success("User deleted successfully. All associated roles, employee records, and assignments have been removed.");
      
      // Refresh data to update the list
      const [roleRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/user-company`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/users`, config),
      ]);
      setRoles(roleRes.data || []);
      setUsers(userRes.data || []);
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete: " + (error.response?.data?.message || error.message));
    }
  };

  // Combine users with their roles - show all users, even without UserCompanyRole entries
  const combinedData = React.useMemo(() => {
    // Create a map of userId -> UserCompanyRole entries
    const roleMap = new Map();
    roles.forEach(role => {
      if (!roleMap.has(role.userId)) {
        roleMap.set(role.userId, []);
      }
      roleMap.get(role.userId).push(role);
    });

    // Create combined list: users with roles, and users without roles
    const result = [];
    
    // Add all UserCompanyRole entries (users with company assignments)
    roles.forEach(role => {
      result.push({
        id: role.id,
        userId: role.userId,
        userCompanyRoleId: role.id,
        hasCompanyRole: true,
      });
    });

    // Add users without UserCompanyRole entries
    users.forEach(user => {
      if (!roleMap.has(user.id)) {
        result.push({
          id: `user-${user.id}`, // Unique ID for users without roles
          userId: user.id,
          userCompanyRoleId: null,
          hasCompanyRole: false,
        });
      }
    });

    return result;
  }, [roles, users]);

  const columns = [
    {
      title: "User",
      dataIndex: "userId",
      render: (id) => getUserFullName(id),
    },
    {
      title: "Role",
      render: (_, record) => {
        const role = getUserRole(record.userId);
        const colorMap = {
          ADMIN: "volcano",
          SADMIN: "magenta",
          EMPLOYEE: "green",
          RECRUITER: "geekblue",
          PROSPECT: "gold",
          GROUP_ADMIN: "blue",
          REPORTING_MANAGER: "cyan",
          HR_MANAGER: "orange",
        };
        return (
          <Tag color={colorMap[role] || "default"} style={{ fontWeight: 500 }}>
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Company",
      render: (_, record) => {
        if (!record.hasCompanyRole) {
          return <span style={{ color: "#999" }}>No Company</span>;
        }
        const roleEntry = roles.find(r => r.id === record.userCompanyRoleId);
        return roleEntry?.company?.companyName || "Unknown";
      },
    },
    {
      title: "Default",
      render: (_, record) => {
        if (!record.hasCompanyRole) {
          return <span style={{ color: "#999" }}>—</span>;
        }
        const roleEntry = roles.find(r => r.id === record.userCompanyRoleId);
        return (roleEntry?.defaultCompany === true || roleEntry?.defaultCompany === "true") ? "Yes" : "No";
      },
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => {
        const userRole = getUserRole(record.userId);
        const rolesRequiringCompany = ["ADMIN", "GROUP_ADMIN", "REPORTING_MANAGER", "HR_MANAGER"];
        const requiresCompany = rolesRequiringCompany.includes(userRole);
        
        if (!record.hasCompanyRole) {
          return (
            <Space size="middle">
              <Tooltip title={requiresCompany ? "This role requires a company assignment" : "Add company role"}>
                <Button
                  type={requiresCompany ? "primary" : "link"}
                  onClick={() => navigate(`/addcompanyrole?userId=${record.userId}`)}
                  style={requiresCompany ? { padding: "4px 8px" } : { padding: 0 }}
                >
                  {requiresCompany ? "Assign Company" : "Add Role"}
                </Button>
              </Tooltip>
            </Space>
          );
        }
        return (
          <Space size="middle">
            <FiEdit2
              style={{ cursor: "pointer", fontSize: 18, color: "#000" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2b2be8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
              onClick={() => navigate(`/editcompanyrole/${record.userCompanyRoleId}`)}
            />

            <Popconfirm
              title="Delete this user completely?"
              description="This will delete the user completely, including all roles, employee records (if applicable), and remove their assignments from employees."
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.userCompanyRoleId, record.userId, userRole)}
            >
              <AiFillDelete
                style={{ cursor: "pointer", fontSize: 18, color: "#000" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <AnimatedPageWrapper>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "16px 0 28px 0",
          margin: "0 28px",
        }}
      >
        <Title level={4} style={titleStyle}>
          User Role Info
        </Title>

        <TableFilter />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
            marginLeft: 30,
          }}
        >
          <Link to="/addadmin" style={{ textDecoration: "none" }}>
            <Button
              icon={<BsFillPersonPlusFill />}
              style={{
                backgroundColor: "#52c41a",
                color: "#fff",
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                border: "none",
              }}
            >
              Create Admin
            </Button>
          </Link>
          <Link to="/addcompanyrole" style={{ textDecoration: "none" }}>
            <Button
              icon={<BsFillPersonPlusFill />}
              style={{
                backgroundColor: "#0D2A4D",
                color: "#fff",
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                border: "none",
              }}
            >
              Add Role
            </Button>
          </Link>
        </div>

        <ReusableTable
          columns={columns}
          data={combinedData}
          loading={loading}
          pagination={true}
          rowKey="id"
        />
      </Card>
    </AnimatedPageWrapper>
  );
}
