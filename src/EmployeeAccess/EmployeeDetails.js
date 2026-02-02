import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Descriptions,
  Typography,
  Spin,
  Tag,
  Row,
  Col,
  Button,
  message,
} from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const EmployeeDetails = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [employee, setEmployee] = useState(null);
  const [reportingManager, setReportingManager] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      // Parse id from sessionStorage (stored as JSON)
      let employeeId = null;
      try {
        const idStr = sessionStorage.getItem("id");
        employeeId = idStr ? JSON.parse(idStr) : null;
      } catch {
        employeeId = sessionStorage.getItem("id"); // Fallback for non-JSON values
      }
      
      const token = sessionStorage.getItem("token");

      if (!employeeId || !token) {
        message.error("Invalid session. Please log in again.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(`${apiUrl}/employees/${employeeId}`, config);
      const employeeData = response.data;
      setEmployee(employeeData);
      
      // Always show employee info - it's already set above
      // Fetch Reporting Manager details if assigned (optional)
      if (employeeData && employeeData.reportingManagerId) {
        try {
          const managerResponse = await axios.get(`${apiUrl}/users/${response.data.reportingManagerId}`, config);
          const managerData = managerResponse.data;
          
          // Try to get phone number from Employee table if Reporting Manager is also an Employee
          try {
            const employeeResponse = await axios.get(`${apiUrl}/employees/by-email/${managerData.email}`, config);
            if (employeeResponse.data && employeeResponse.data.phoneNo) {
              managerData.phoneNo = employeeResponse.data.phoneNo;
            }
          } catch (empErr) {
            // Reporting Manager is not an Employee, phone number will be null
            console.log("Reporting Manager is not an Employee, phone number not available");
          }
          
          setReportingManager(managerData);
        } catch (err) {
          console.error("Error fetching reporting manager:", err);
        }
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      message.error("Failed to load employee details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Loading Employee Details..." />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center mt-5">
        <Title level={4} type="danger">
          No employee details found.
        </Title>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 850,
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
          <Col>
            <Title level={3} style={{ color: "#2d3748", marginBottom: 0 }}>
              <UserOutlined /> Employee Profile
            </Title>
            <Text type="secondary">
              Personal and professional information overview
            </Text>
          </Col>
        </Row>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          size="middle"
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="First Name">
            {employee.firstName || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Last Name">
            {employee.lastName || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            <MailOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            {employee.emailID || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Phone Number">
            <PhoneOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            {employee.phoneNo || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Date of Birth">
            <CalendarOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            {employee.dob || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Company">
            <HomeOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            {employee.company?.companyName || "N/A"}
          </Descriptions.Item>

          {reportingManager && (
            <>
              <Descriptions.Item label="Reporting Manager Name">
                <UserOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                {reportingManager.firstname} {reportingManager.lastname}
              </Descriptions.Item>

              <Descriptions.Item label="Reporting Manager Email">
                <MailOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                {reportingManager.email || "-"}
              </Descriptions.Item>

              {reportingManager.phoneNo && (
                <Descriptions.Item label="Reporting Manager Phone">
                  <PhoneOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                  {reportingManager.phoneNo}
                </Descriptions.Item>
              )}
            </>
          )}

          <Descriptions.Item label="Working Status">
            {employee.onBench === "On Bench" ? (
              <Tag color="red">On Bench</Tag>
            ) : employee.onBench === "Working" ? (
              <Tag icon={<CheckCircleOutlined />} color="green">
                Working
              </Tag>
            ) : employee.onBench === "OnProject" ? (
              <Tag color="blue">On Project</Tag>
            ) : employee.onBench === "OnVacation" ? (
              <Tag color="orange">On Vacation</Tag>
            ) : employee.onBench === "OnSick" ? (
              <Tag color="purple">On Sick</Tag>
            ) : employee.onBench ? (
              <Tag>{employee.onBench}</Tag>
            ) : (
              <Tag icon={<CheckCircleOutlined />} color="green">
                Active
              </Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Joining Date">
            {employee.joiningDate || "-"}
          </Descriptions.Item>
        </Descriptions>

        {(() => {
          // Parse role from sessionStorage (stored as JSON)
          let userRole = "";
          try {
            const roleStr = sessionStorage.getItem("role");
            userRole = roleStr ? JSON.parse(roleStr) : "";
          } catch {
            userRole = sessionStorage.getItem("role") || "";
          }
          userRole = String(userRole).replace(/^"|"$/g, "").trim(); // Clean up role string
          
          // Hide buttons for EMPLOYEE role
          if (userRole === "EMPLOYEE" || userRole === '"EMPLOYEE"') {
            return null;
          }
          
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 30,
                gap: 20,
              }}
            >
              <Link to="/trackings">
                <Button
                  type="primary"
                  style={{
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  View WithHold Tracking
                </Button>
              </Link>

              <Link to="/withholdSheet">
                <Button
                  style={{
                    background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  View WithHold Sheet
                </Button>
              </Link>
            </div>
          );
        })()}
      </Card>
    </motion.div>
  );
};

export default EmployeeDetails;
