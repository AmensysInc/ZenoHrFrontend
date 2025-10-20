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
  Layout,
  Row,
  Col,
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
const { Content } = Layout;

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
    } finally {
      setLoading(false);
    }
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
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: "#1677ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
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
      render: (category) =>
        category ? <Tag color="blue">{category}</Tag> : <Tag>-</Tag>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
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
              icon={<EditOutlined />}
              shape="circle"
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
                icon={<DeleteOutlined />}
                danger
                shape="circle"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f6fa", padding: "24px" }}>
      <Content>
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          title={
            <Row justify="space-between" align="middle">
              <Col>
                <Space size="large">
                  <MailOutlined style={{ fontSize: 26, color: "#1677ff" }} />
                  <Title level={4} style={{ margin: 0 }}>
                    Email Templates
                  </Title>
                </Space>
              </Col>

              <Col>
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchTemplates}
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
                    >
                      Create New
                    </Button>
                  </Link>
                </Space>
              </Col>
            </Row>
          }
        >
          {error && (
            <Card
              size="small"
              style={{
                marginBottom: 16,
                border: "1px solid #ffccc7",
                background: "#fff2f0",
              }}
            >
              <Text type="danger">{error}</Text>
            </Card>
          )}

          <Table
            bordered
            columns={columns}
            dataSource={filteredTemplates}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: <Empty description="No email templates found" />,
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
}
