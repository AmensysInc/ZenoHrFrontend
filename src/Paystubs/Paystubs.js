import React, { useEffect, useState } from "react";
import { Card, Table, Typography, Button, message, Tag, Space, DatePicker } from "antd";
import { DownloadOutlined, DollarOutlined, CalendarOutlined } from "@ant-design/icons";
import axios from "axios";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import dayjs from "dayjs";

const { Title } = Typography;

export default function Paystubs() {
  const [paystubs, setPaystubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
  const employeeId = sessionStorage.getItem("id");

  useEffect(() => {
    fetchPaystubs();
  }, []);

  const fetchPaystubs = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/paystubs/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaystubs(response.data || []);
    } catch (error) {
      console.error("Error fetching paystubs:", error);
      message.error("Failed to load paystubs");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/paystubs/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Paystub downloaded successfully");
    } catch (error) {
      console.error("Error downloading paystub:", error);
      message.error("Failed to download paystub");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const columns = [
    {
      title: "Pay Period",
      key: "payPeriod",
      render: (_, record) => (
        <Space>
          <CalendarOutlined />
          <span>
            {formatDate(record.payPeriodStart)} - {formatDate(record.payPeriodEnd)}
          </span>
        </Space>
      ),
    },
    {
      title: "Month/Year",
      key: "monthYear",
      render: (_, record) => {
        if (record.month && record.year) {
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          return `${monthNames[record.month - 1]} ${record.year}`;
        }
        return "-";
      },
    },
    {
      title: "Gross Pay",
      dataIndex: "grossPay",
      render: (amount) => (
        <Space>
          <DollarOutlined style={{ color: "#52c41a" }} />
          <span style={{ fontWeight: 600, color: "#52c41a" }}>
            {formatCurrency(amount)}
          </span>
        </Space>
      ),
    },
    {
      title: "Net Pay",
      dataIndex: "netPay",
      render: (amount) => (
        <Space>
          <DollarOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontWeight: 600, color: "#1890ff" }}>
            {formatCurrency(amount)}
          </span>
        </Space>
      ),
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      ellipsis: true,
    },
    {
      title: "Uploaded",
      dataIndex: "uploadedAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record.id, record.fileName)}
        >
          Download
        </Button>
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
        <Title level={4} style={{ marginBottom: 24, textAlign: "center" }}>
          My Paystubs
        </Title>

        <Table
          columns={columns}
          dataSource={paystubs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} paystubs`,
          }}
        />
      </Card>
    </AnimatedPageWrapper>
  );
}

