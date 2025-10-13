import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Tag,
  Spin,
  Space,
  Divider,
  Tooltip,
} from "antd";
import {
  TeamOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
    DashboardOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [visaDetails, setVisaDetails] = useState([]);
  const [companyBalances, setCompanyBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [empRes, poRes, visaRes, balanceRes] = await Promise.all([
          axios.get(`${API_URL}/employees?page=0&size=10`, { headers }),
          axios.get(`${API_URL}/orders?page=0&size=10`, { headers }),
          axios.get(`${API_URL}/visa-details?page=0&size=10`, { headers }),
          axios.get(`${API_URL}/trackings/company-balance`, { headers }),
        ]);

        setEmployees(empRes.data.content || []);
        setPurchaseOrders(poRes.data.content || []);

        // Filter & Sort Visas expiring in next 180 days
        const today = new Date();
        const next180Days = new Date();
        next180Days.setDate(today.getDate() + 180);

        const filteredVisas = (visaRes.data.content || []).sort((a, b) => {
          const aDate = new Date(a.visaExpiryDate);
          const bDate = new Date(b.visaExpiryDate);

          const aExpiringSoon = aDate >= today && aDate <= next180Days;
          const bExpiringSoon = bDate >= today && bDate <= next180Days;

          if (aExpiringSoon && !bExpiringSoon) return -1;
          if (!aExpiringSoon && bExpiringSoon) return 1;
          return aDate - bDate;
        });

        setVisaDetails(filteredVisas);
        setCompanyBalances(balanceRes.data || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, API_URL]);

  // --- Helper Functions ---
  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "N/A";
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isExpiringSoon = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const next180 = new Date();
    next180.setDate(today.getDate() + 180);
    return date >= today && date <= next180;
  };

  // --- Table Columns ---
  const companyBalanceCols = [
    {
      title: "Company",
      dataIndex: "companyName",
      render: (text, record) => (
        <Link to={`/company/${record.companyId}`} style={{ color: "#1677ff" }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Total Balance ($)",
      dataIndex: "totalBalance",
      align: "right",
      render: (val) => (
        <Text strong style={{ color: "#1890ff" }}>
          {val?.toFixed(2)}
        </Text>
      ),
    },
  ];

  const employeeCols = [
    {
      title: "Name",
      render: (emp) => `${emp.firstName} ${emp.lastName}`,
    },
    { title: "Email", dataIndex: "emailID" },
    { title: "Phone", dataIndex: "phoneNo" },
    { title: "Company", render: (emp) => emp.company?.companyName || "N/A" },
    { title: "Created At", render: (emp) => formatDate(emp.createdAt) },
  ];

  const poCols = [
    { title: "Employee", dataIndex: "employeeName" },
    { title: "Date of Joining", dataIndex: "dateOfJoining" },
    { title: "Project End", dataIndex: "projectEndDate" },
    { title: "Bill Rate", dataIndex: "billRate" },
    { title: "Client", dataIndex: "endClientName" },
  ];

  const visaCols = [
    { title: "Employee", dataIndex: "employeeName" },
    { title: "Visa Type", dataIndex: "visaType" },
    { title: "Start Date", dataIndex: "visaStartDate" },
    {
      title: "Expiry Date",
      dataIndex: "visaExpiryDate",
      render: (val) =>
        isExpiringSoon(val) ? (
          <Tag color="red" style={{ fontWeight: 600 }}>
            {val}
          </Tag>
        ) : (
          <Text>{val}</Text>
        ),
    },
    { title: "I140 Status", dataIndex: "i140Status" },
  ];

  // --- Main Render ---
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <Space>
          <DashboardOutlined style={{ color: "#1677ff" }} />
          Dashboard
        </Space>
      </Title>

      {loading ? (
        <Spin size="large" style={{ display: "block", marginTop: 80 }} />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* --- Company Balances --- */}
          <Card
            title={
              <Space>
                <DollarOutlined style={{ color: "#389e0d" }} />
                <Text strong>Company Balances</Text>
              </Space>
            }
            bordered
            bodyStyle={{ padding: "12px 24px" }}
          >
            <Table
              size="middle"
              dataSource={companyBalances}
              columns={companyBalanceCols}
              rowKey={(record, idx) => idx}
              pagination={false}
            />
          </Card>

          {/* --- Employees --- */}
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: "#1677ff" }} />
                <Text strong>Recent Employees</Text>
              </Space>
            }
            bordered
            bodyStyle={{ padding: "12px 24px" }}
          >
            <Table
              size="middle"
              dataSource={employees}
              columns={employeeCols}
              rowKey="employeeID"
              pagination={false}
            />
          </Card>

          {/* --- Purchase Orders --- */}
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: "#fa8c16" }} />
                <Text strong>Recent Purchase Orders</Text>
              </Space>
            }
            bordered
            bodyStyle={{ padding: "12px 24px" }}
          >
            <Table
              size="middle"
              dataSource={purchaseOrders}
              columns={poCols}
              rowKey="orderId"
              pagination={false}
            />
          </Card>

          {/* --- Visa Details --- */}
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: "#cf1322" }} />
                <Text strong>Visa Details (Next 180 Days Highlighted)</Text>
              </Space>
            }
            bordered
            bodyStyle={{ padding: "12px 24px" }}
          >
            <Table
              size="middle"
              dataSource={visaDetails}
              columns={visaCols}
              rowKey="visaId"
              pagination={false}
            />
          </Card>
        </Space>
      )}
    </div>
  );
}
