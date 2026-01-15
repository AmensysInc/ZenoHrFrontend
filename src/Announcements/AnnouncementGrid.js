import React, { useEffect, useState } from "react";
import {
  Tag,
  Spin,
  message as antdMessage,
  Badge,
  Button,
  Card,
  Typography,
  Tooltip,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusCircleOutlined,
  SoundOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title, Text } = Typography;

export default function EmployeeAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const token = sessionStorage.getItem("token");
  const employeeId = sessionStorage.getItem("id");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const authHeader = { Authorization: `Bearer ${token}` };

  const formatDateArray = (arr) => {
    if (!arr || arr.length < 3) return "-";
    const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/announcements`, {
        headers: authHeader,
      });

      const employeeAnnouncements = res.data.filter((a) =>
        a.recipients.some((r) => r.employeeId === employeeId)
      );

      setAnnouncements(employeeAnnouncements);
      setFilteredData(employeeAnnouncements);
    } catch (err) {
      console.error(err);
      antdMessage.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredData(announcements);
    } else {
      const lower = search.toLowerCase();
      setFilteredData(
        announcements.filter(
          (a) =>
            a.title.toLowerCase().includes(lower) ||
            a.message.toLowerCase().includes(lower) ||
            a.type.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, announcements]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text) => (
        <Space>
          <SoundOutlined style={{ color: "#1677ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
      render: (msg) => (
        <Tooltip title={msg}>
          {msg.length > 50 ? msg.slice(0, 50) + "..." : msg}
        </Tooltip>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => {
        let color = "blue";
        let icon = <SoundOutlined />;

        if (type === "URGENT") {
          color = "red";
          icon = <ExclamationCircleOutlined />;
        } else if (type === "EVENT") {
          color = "green";
          icon = <CalendarOutlined />;
        }

        return (
          <Tag color={color} icon={icon}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      render: (by) => <Text>{by || "Admin"}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (dateArr) => formatDateArray(dateArr),
    },
    {
      title: "Status",
      dataIndex: "recipients",
      render: (recipients) => {
        const rec = recipients.find((r) => r.employeeId === employeeId);
        return rec?.readStatus ? (
          <Badge status="success" text="Read" />
        ) : (
          <Badge status="warning" text="Unread" />
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
          My Announcements
        </Title>

        <Spin spinning={loading} tip="Loading announcements...">
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
              icon={<PlusCircleOutlined />}
              onClick={() => navigate("/addannouncements")}
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
              Add Announcement
            </Button>
          </div>
          <ReusableTable
            columns={columns}
            data={filteredData}
            pagination={{ pageSize: 8 }}
            loading={loading}
          />
        </Spin>
      </Card>
    </AnimatedPageWrapper>
  );
}
