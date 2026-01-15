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
          axios.get(`${API_BASE_URL}/user-company`, config),
          axios.get(`${API_BASE_URL}/users`, config),
        ]);
        setRoles(roleRes.data);
        setUsers(userRes.data);
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

  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`${API_BASE_URL}/user-company/${roleId}`, config);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      message.success("Role deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete role");
    }
  };

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
      dataIndex: ["company", "companyName"],
      render: (name) => name || "Unknown",
    },
    {
      title: "Default",
      dataIndex: "defaultCompany",
      render: (val) => (val === true || val === "true" ? "Yes" : "No"),
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <FiEdit2
            style={{ cursor: "pointer", fontSize: 18, color: "#000" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2b2be8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
            onClick={() => navigate(`/editcompanyrole/${record.id}`)}
          />

          <Popconfirm
            title="Delete this role?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <AiFillDelete
              style={{ cursor: "pointer", fontSize: 18, color: "#000" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
            />
          </Popconfirm>
        </Space>
      ),
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
            marginLeft: 30,
          }}
        >
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
          data={roles}
          loading={loading}
          pagination={true}
          rowKey="id"
        />
      </Card>
    </AnimatedPageWrapper>
  );
}
