import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Card,
  Space,
  message,
  Popconfirm,
  Typography,
  Tooltip,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

export default function EmailTemplateList() {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemplates(response.data);
      setFilteredTemplates(response.data);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
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
      key: "name",
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: "#1677ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
      render: (subject) => (
        <Tooltip title={subject}>
          <Text>{subject}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) =>
        category ? <Tag color="blue">{category}</Tag> : <Tag>-</Tag>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Template">
            <Button
              shape="circle"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => navigate(`/email-template/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this template?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Delete Template">
              <Button
                shape="circle"
                icon={<DeleteOutlined style={{ color: "red" }} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        className="shadow-lg rounded-2xl"
        title={
          <div className="flex justify-between items-center">
            {/* Left Side - Title */}
            <Space size="large">
              <MailOutlined style={{ fontSize: 26, color: "#1677ff" }} />
              <Title level={4} style={{ margin: 0 }}>
                Email Templates
              </Title>
            </Space>

            {/* Right Side - Buttons */}
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchTemplates}
                title="Refresh Templates"
                type="default"
                shape="round"
              >
                Refresh
              </Button>

              <Link to="/email-template/create">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  shape="round"
                  style={{
                    backgroundColor: "#1677ff",
                    border: "none",
                  }}
                >
                  Create New
                </Button>
              </Link>
            </Space>
          </div>
        }
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredTemplates}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: <Empty description="No email templates found" />,
          }}
        />
      </Card>
    </div>
  );
}
