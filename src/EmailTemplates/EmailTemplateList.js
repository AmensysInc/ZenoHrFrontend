import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  message,
  Popconfirm,
  Typography,
  Empty,
  Card,
  Tag,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { AiFillDelete, AiFillEdit } from "react-icons/ai";

import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title, Text } = Typography;

// System template categories that should be shown prominently
const SYSTEM_CATEGORIES = ["FORGOT_PASSWORD", "LOGIN_DETAILS", "CHANGE_PASSWORD", "WELCOME"];

export default function EmailTemplateList() {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    initializeAndFetchTemplates();
  }, []);

  const initializeAndFetchTemplates = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      
      // Initialize default templates if they don't exist
      try {
        await axios.post(
          `${API_URL}/messages/initialize-defaults`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (initErr) {
        // Ignore errors if templates already exist
        console.log("Default templates may already exist");
      }
      
      // Fetch all templates
      const response = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Sort templates: system templates first, then others
      const sortedTemplates = response.data.sort((a, b) => {
        const aIsSystem = SYSTEM_CATEGORIES.includes(a.category);
        const bIsSystem = SYSTEM_CATEGORIES.includes(b.category);
        if (aIsSystem && !bIsSystem) return -1;
        if (!aIsSystem && bIsSystem) return 1;
        return 0;
      });
      
      setTemplates(sortedTemplates);
      setFilteredTemplates(sortedTemplates);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, category) => {
    // Check if it's a system template
    if (SYSTEM_CATEGORIES.includes(category)) {
      message.warning("System templates cannot be deleted. You can edit them instead.");
      return;
    }
    
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setFilteredTemplates((prev) => prev.filter((t) => t.id !== id));
      message.success("Template deleted successfully!");
    } catch (err) {
      console.error("Error deleting template:", err);
      message.error("Failed to delete the template.");
    }
  };

  const columns = [
    { 
      title: "Name", 
      dataIndex: "name",
      render: (name, record) => (
        <Space>
          <span>{name}</span>
          {SYSTEM_CATEGORIES.includes(record.category) && (
            <Tag color="blue">System</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      ellipsis: true,
      render: (subject) => subject || "-",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => (
        <Tag color={SYSTEM_CATEGORIES.includes(category) ? "blue" : "default"}>
          {category || "-"}
        </Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (isActive) => (
        <span style={{ color: "#000000" }}>{isActive ? "Yes" : "No"}</span>
      ),
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <AiFillEdit
            style={{ color: "#000", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2b2be8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
            onClick={() => navigate(`/email-template/edit/${record.id}`)}
          />

          {SYSTEM_CATEGORIES.includes(record.category) ? (
            <AiFillDelete
              style={{ color: "#ccc", cursor: "not-allowed" }}
              title="System templates cannot be deleted"
            />
          ) : (
            <Popconfirm
              title="Delete this template?"
              onConfirm={() => handleDelete(record.id, record.category)}
            >
              <AiFillDelete
                style={{ color: "#000", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
              />
            </Popconfirm>
          )}
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
          Email Templates
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
          <Link to="/email-template/create" style={{ textDecoration: "none" }}>
            <Button
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
                padding: "0 16px",
                border: "none",
              }}
            >
              + Create New
            </Button>
          </Link>
        </div>

        <ReusableTable
          columns={columns}
          data={filteredTemplates}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: <Empty description="No email templates found" />,
          }}
        />
      </Card>
    </AnimatedPageWrapper>
  );
}
