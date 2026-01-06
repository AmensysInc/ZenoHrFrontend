import React, { useEffect, useState } from "react";
import { StarFilled } from "@ant-design/icons";
import ReusableTable from "../components/ReusableTable";
import {
  Card,
  Typography,
  Tag,
  Spin,
  Space,
  Divider,
  Row,
  Col,
  Avatar,
  Button,
} from "antd";

import {
  TeamOutlined,
  FileTextOutlined,
  BankOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";

const { Title, Text: AntText } = Typography;

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [visaDetails, setVisaDetails] = useState([]);
  const [companyBalances, setCompanyBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAllEmployees, setShowAllEmployees] = useState(false);

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

        const today = new Date();
        const next180Days = new Date();
        next180Days.setDate(today.getDate() + 180);

        const filteredVisas = (visaRes.data.content || []).sort((a, b) => {
          const aDate = new Date(a.visaExpiryDate);
          const bDate = new Date(b.visaExpiryDate);

          const aExp = aDate >= today && aDate <= next180Days;
          const bExp = bDate >= today && bDate <= next180Days;

          if (aExp && !bExp) return -1;
          if (!aExp && bExp) return 1;
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

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "N/A";
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const isExpiringSoon = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const next180 = new Date();
    next180.setDate(today.getDate() + 180);
    return date >= today && date <= next180;
  };

  const displayEmployeeCount = showAllEmployees ? employees.length : 8;

  const poCols = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      render: (name) => <AntText strong>{name}</AntText>,
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    { title: "Joining Date", dataIndex: "dateOfJoining" },
    {
      title: "Project End",
      dataIndex: "projectEndDate",
      sorter: (a, b) => new Date(a.projectEndDate) - new Date(b.projectEndDate),
    },
    {
      title: "Bill Rate",
      dataIndex: "billRate",
      align: "right",
      render: (rate) => `$${rate}/hr`,
      sorter: (a, b) => a.billRate - b.billRate,
    },
    {
      title: "Client",
      dataIndex: "endClientName",
      sorter: (a, b) => a.endClientName.localeCompare(b.endClientName),
    },
  ];

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "24px", marginTop: -24 }}>
        <Title level={2} style={{ marginBottom: 24, marginLeft: 4 }}>
          Dashboard
        </Title>

        {loading ? (
          <Spin size="large" style={{ display: "block", marginTop: 80 }} />
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Company Balances */}
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: "16px 0 28px 0",
                margin: "0px 4px",
              }}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DollarOutlined style={{ color: "#646464ff", fontSize: 18 }} />
                  <AntText strong style={{ fontSize: 16, color: "#262626" }}>
                    Company Balances
                  </AntText>
                </div>
              }
              bordered
              bodyStyle={{ padding: "16px" }}
            >
              <Row gutter={[16, 16]}>
                {companyBalances.map((item, idx) => {
                  const balance = item.totalBalance || 0;
                  const color = "#8c8c8c";

                  return (
                    <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Link
                        to={`/company/${item.companyId}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card
                          hoverable
                          style={{
                            width: "100%",
                            borderRadius: 8,
                            borderLeft: `6px solid ${color}`,
                          }}
                          bodyStyle={{ padding: "16px" }}
                        >
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Space>
                              <BankOutlined style={{ color }} />
                              <AntText strong style={{ fontSize: 16 }}>
                                {item.companyName}
                              </AntText>
                            </Space>

                            <Divider style={{ margin: "8px 0" }} />

                            <AntText type="secondary" style={{ fontSize: 12 }}>
                              Total Balance
                            </AntText>

                            <AntText strong style={{ fontSize: 22, color }}>
                              ${balance.toFixed(2)}
                            </AntText>
                          </Space>
                        </Card>
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </Card>

            {/* Recent Employees */}
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: "16px 0 28px 0",
                margin: "0px 4px",
              }}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TeamOutlined style={{ color: "#646464ff" }} />
                  <AntText strong style={{ fontSize: 16 }}>
                    Recent Employees
                  </AntText>
                </div>
              }
              bordered
              bodyStyle={{ padding: "16px" }}
            >
              <Row gutter={[16, 16]}>
                {employees.slice(0, displayEmployeeCount).map((emp) => {
                  const createdDate = formatDate(emp.createdAt);
                  const isNew =
                    (new Date() - new Date(createdDate)) /
                      (1000 * 60 * 60 * 24) <=
                    7;
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={emp.employeeID}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 12,
                          textAlign: "center",
                          border: "1px solid #d9d9d9",
                          position: "relative",
                        }}
                      >
                        {isNew && (
                          <StarFilled
                            style={{
                              position: "absolute",
                              top: 16,
                              left: 16,
                              fontSize: 20,
                              color: "#FFD700",
                            }}
                          />
                        )}

                        <Space
                          direction="vertical"
                          style={{ width: "100%" }}
                          size="small"
                        >
                          <Avatar
                            size={80}
                            icon={<UserOutlined />}
                            style={{
                              margin: "16px auto 8px",
                              backgroundColor: "#676767ff",
                            }}
                          />

                          <AntText
                            strong
                            style={{
                              fontSize: 18,
                              display: "block",
                              marginTop: 8,
                            }}
                          >
                            {emp.firstName} {emp.lastName}
                          </AntText>

                          <AntText
                            type="secondary"
                            style={{
                              fontSize: 14,
                              display: "block",
                            }}
                          >
                            {emp.company?.companyName || "N/A"}
                          </AntText>

                          <AntText
                            style={{
                              fontSize: 14,
                              display: "block",
                              marginTop: 16,
                            }}
                          >
                            {emp.phoneNo || "N/A"}
                          </AntText>

                          <AntText
                            style={{
                              fontSize: 14,
                              color: "#787878ff",
                              display: "block",
                              cursor: "pointer",
                            }}
                          >
                            {emp.emailID}
                          </AntText>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {employees.length > 8 && (
                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setShowAllEmployees(!showAllEmployees)}
                    style={{
                      minWidth: 150,
                      color: "#000000ff",
                      backgroundColor: "#fdfafaff",
                      borderColor: "#d9d9d9",
                    }}
                  >
                    {showAllEmployees
                      ? "Show Less"
                      : `Show All (${employees.length})`}
                  </Button>
                </div>
              )}
            </Card>

            {/* Purchase Orders */}
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: "16px 0 28px 0",
                margin: "0px 4px",
              }}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FileTextOutlined style={{ color: "#646464ff" }} />
                  <AntText strong style={{ fontSize: 16 }}>
                    Recent Purchase Orders
                  </AntText>
                </div>
              }
            >
              <ReusableTable
                columns={poCols}
                data={purchaseOrders}
                loading={loading}
                rowKey="orderId"
                pagination={false}
              />
            </Card>

            {/* Visa Details */}
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: "16px 0 28px 0",
                margin: "0px 4px",
              }}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ClockCircleOutlined
                    style={{ color: "#646464ff", fontSize: 18 }}
                  />
                  <AntText strong style={{ fontSize: 16 }}>
                    Visa Details
                  </AntText>
                </div>
              }
              bordered
              bodyStyle={{ padding: "24px" }}
            >
              <Row gutter={[24, 24]}>
                {visaDetails.map((visa) => {
                  const expiringSoon = isExpiringSoon(visa.visaExpiryDate);

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={visa.visaId}>
                      <Card
                        hoverable
                        style={{
                          background: "#0D2A4C",
                          borderRadius: 16,
                          color: "white",
                          position: "relative",
                          overflow: "hidden",
                          minHeight: 260,
                          padding: "14px 18px",
                        }}
                      >
                        <Space
                          direction="vertical"
                          style={{ width: "100%" }}
                          size={8}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <div>
                              <AntText
                                style={{
                                  color: "rgba(255,255,255,0.8)",
                                  fontSize: 11,
                                }}
                              >
                                Employee Name :
                              </AntText>
                              <AntText
                                strong
                                style={{
                                  color: "white",
                                  fontSize: 15,
                                  display: "block",
                                  marginTop: 2,
                                }}
                              >
                                {visa.employeeName}
                              </AntText>
                            </div>

                            <Avatar
                              size={50}
                              icon={<UserOutlined />}
                              style={{
                                backgroundColor: "rgba(255,255,255,0.2)",
                                border: "2px solid white",
                              }}
                            />
                          </div>

                          <Divider
                            style={{
                              borderColor: "rgba(255,255,255,0.3)",
                              margin: "6px 0",
                            }}
                          />

                          <div
                            style={{
                              marginBottom: 6,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <AntText
                              style={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                            >
                              Visa Type :
                            </AntText>
                            <AntText
                              strong
                              style={{ color: "white", fontSize: 14 }}
                            >
                              {visa.visaType}
                            </AntText>
                          </div>

                          <div
                            style={{
                              marginBottom: 6,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <AntText
                              style={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                            >
                              Start Date :
                            </AntText>
                            <AntText
                              strong
                              style={{ color: "white", fontSize: 14 }}
                            >
                              {visa.visaStartDate}
                            </AntText>
                          </div>

                          <div
                            style={{
                              marginBottom: 6,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <AntText
                              style={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                            >
                              Expiration Date :
                            </AntText>

                            {expiringSoon ? (
                              <Tag
                                color="error"
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  padding: "2px 6px",
                                }}
                              >
                                {visa.visaExpiryDate}
                              </Tag>
                            ) : (
                              <AntText
                                strong
                                style={{ color: "white", fontSize: 14 }}
                              >
                                {visa.visaExpiryDate}
                              </AntText>
                            )}
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              padding: "8px",
                              background:
                                visa.i140Status === "Approved"
                                  ? "rgba(255, 255, 255, 1)"
                                  : "rgba(152, 153, 153, 0.3)",
                              borderRadius: 8,
                              textAlign: "center",
                              border: "1px solid rgba(255,255,255,0.3)",
                            }}
                          >
                            <AntText
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              I140: {visa.i140Status}
                            </AntText>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </Space>
        )}
      </div>
    </AnimatedPageWrapper>
  );
}
