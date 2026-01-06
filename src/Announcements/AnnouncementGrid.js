import React, { useEffect, useState } from "react";
import {
  Tag,
  message as antdMessage,
  Badge,
  Button,
  Card,
  Typography,
  Tooltip,
  Space,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ReloadOutlined,
  PlusCircleOutlined,
  SoundOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";

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

  // ✅ Format backend date array
  const formatDateArray = (arr) => {
    if (!arr || arr.length < 3) return "-";
    const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };

  // ✅ Fetch Announcements
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

  // ✅ Search filter
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

  // ✅ Column definitions
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          <SoundOutlined style={{ color: "#1677ff" }} />
          <Text strong style={{ cursor: "pointer" }}>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (msg) => (
        <Tooltip title={msg}>
          <span>{msg.length > 50 ? msg.slice(0, 50) + "..." : msg}</span>
        </Tooltip>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
      key: "createdBy",
      render: (by) => <Text>{by || "Admin"}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateArr) => <Text>{formatDateArray(dateArr)}</Text>,
      sorter: (a, b) =>
        new Date(formatDateArray(a.createdAt)) - new Date(formatDateArray(b.createdAt)),
    },
    {
      title: "Status",
      dataIndex: "recipients",
      key: "status",
      render: (recipients) => {
        const rec = recipients.find((r) => r.employeeId === employeeId);
        return rec?.readStatus ? (
          <Badge status="success" text="Read" />
        ) : (
          <Badge status="warning" text="Unread" />
        );
      },
      filters: [
        { text: "Read", value: "Read" },
        { text: "Unread", value: "Unread" },
      ],
      onFilter: (value, record) => {
        const rec = record.recipients.find((r) => r.employeeId === employeeId);
        return value === "Read" ? rec?.readStatus : !rec?.readStatus;
      },
    },
  ];

  // ✅ Page header actions
  const ActionsBar = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <Title level={3} style={{ marginBottom: 0 }}>
        My Announcements
      </Title>

      <Space>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }}
        />

        <Tooltip title="Reload">
          <Button icon={<ReloadOutlined />} onClick={fetchAnnouncements} />
        </Tooltip>

        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => navigate("/addannouncements")}
        >
          Add Announcement
        </Button>
      </Space>
    </div>
  );

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card
          bordered={false}
          style={{
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          {ActionsBar}

          <ReusableTable
            columns={columns}
            data={filteredData}
            rowKey="id"
            loading={loading}
            pagination={true}
            total={filteredData.length}
          />
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
