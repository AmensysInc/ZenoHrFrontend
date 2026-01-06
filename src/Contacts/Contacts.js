import React, { useState, useEffect } from "react";
import { Space, Button, Popconfirm, message } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ReusableTable from "../components/ReusableTable";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";

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
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
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
            description="This action cannot be undone."
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

  // Button style
  const primaryActionBtn = {
    backgroundColor: "#0D2A4D",
    color: "#fff",
    borderRadius: 8,
    height: 40,
    fontWeight: 500,
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  // Header with Add Contact button
  const extraHeader = (
    <div
      style={{
        marginBottom: 16,
        padding: "0 28px",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Button
        style={primaryActionBtn}
        icon={<BsFillPersonPlusFill />}
        onClick={() => navigate("/addcontact")}
      >
        Add Contact
      </Button>
    </div>
  );

  return (
    <AnimatedPageWrapper>
      <ReusableTable
        title="Contacts List"
        columns={columns}
        data={contacts}
        loading={loading}
        pagination={{ pageSize: 10 }}
        extraHeader={extraHeader}
      />
    </AnimatedPageWrapper>
  );
}
