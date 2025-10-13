import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Space, Tooltip, message, Popconfirm, Button } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
        const roleRes = await axios.get(`${API_BASE_URL}/user-company`, config);
        const userRes = await axios.get(`${API_BASE_URL}/users`, config);
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

  const handleEdit = (role) => {
    navigate(`/editcompanyrole/${role.id}`);
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
      key: "userId",
      render: (userId) => getUserFullName(userId),
    },
    {
      title: "Company",
      dataIndex: ["company", "companyName"],
      key: "company",
      render: (companyName) => companyName || "Unknown",
    },
    {
      title: "Default",
      dataIndex: "defaultCompany",
      key: "defaultCompany",
      render: (defaultCompany) =>
        defaultCompany === "true" || defaultCompany === true ? "✅ Yes" : "No",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <FiEdit2
              onClick={() => handleEdit(record)}
              style={{ cursor: "pointer", color: "#1890ff" }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this role?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <AiFillDelete
                style={{ cursor: "pointer", color: "red" }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="shadow-lg rounded-2xl"
      title={
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Title level={4} style={{ margin: 0 }}>
            User Role Information
          </Title>
          <Link to="/addcompanyrole">
            <Button type="primary" icon={<BsFillPersonPlusFill />}>
              Add Role
            </Button>
          </Link>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        bordered
      />
    </Card>
  );
}
