import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Space, Button, Popconfirm, message } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");
  const recruiterId = sessionStorage.getItem("id");

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/bulkmails/${recruiterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      message.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recruiterId) fetchContacts();
  }, [recruiterId, token]);

  const handleEdit = (id) => {
    navigate(`/editcontact/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/bulkmails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      message.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      message.error("Failed to delete contact");
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <FiEdit2
            style={{ cursor: "pointer", fontSize: 18 }}
            onClick={() => handleEdit(record.id)}
            title="Edit Contact"
          />
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <AiFillDelete
              style={{ cursor: "pointer", fontSize: 18, color: "red" }}
              title="Delete Contact"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <Title level={3} style={{ margin: 0 }}>
          Contacts List
        </Title>
        <Button type="primary" onClick={() => navigate("/addcontact")}>
          Add Contact
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={contacts}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
