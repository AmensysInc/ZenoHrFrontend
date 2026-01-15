import React, { useState, useEffect } from "react";
import { Card, Typography, Space, Button, Popconfirm, message } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

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
      setContacts(res.data.map((c) => ({ ...c, key: c.id })));
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

  const handleEdit = (id) => navigate(`/editcontact/${id}`);

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
            onClick={() => handleEdit(record.id)}
            title="Edit Contact"
          />

          <Popconfirm
            title="Delete this contact?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <AiFillDelete
              style={{ cursor: "pointer", fontSize: 18, color: "#000" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
              title="Delete Contact"
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
          Contacts List
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
          <Button
            icon={<BsFillPersonPlusFill />}
            onClick={() => navigate("/addcontact")}
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
            Add Contact
          </Button>
        </div>

        <ReusableTable
          columns={columns}
          data={contacts}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </AnimatedPageWrapper>
  );
}
