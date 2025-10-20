import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Spin, message, Space, Button, Tooltip } from "antd";
import { MailOutlined, CopyOutlined, ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

export default function CompanyContact() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchCompanyEmail = async () => {
    try {
      setLoading(true);
      const employeeId = sessionStorage.getItem("id");
      const token = sessionStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${apiUrl}/employees/${employeeId}`, config);
      const companyEmail = response.data?.company?.email || "Unavailable";
      setEmail(companyEmail);
    } catch (error) {
      console.error("Error fetching company email:", error);
      setEmail("Unavailable");
      message.error("Failed to fetch company contact email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyEmail();
  }, [apiUrl]);

  const handleCopy = () => {
    if (email && email !== "Unavailable") {
      navigator.clipboard.writeText(email);
      message.success("Email copied to clipboard!");
    } else {
      message.warning("No valid email to copy.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: "30px" }}
    >
      <Card
        bordered={false}
        style={{
          maxWidth: 600,
          margin: "0 auto",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Title level={3}>
            <MailOutlined style={{ color: "#1677ff", marginRight: 10 }} />
            Company Contact
          </Title>

          {loading ? (
            <Spin size="large" tip="Fetching contact details..." />
          ) : email === "Unavailable" ? (
            <div>
              <InfoCircleOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />
              <Text type="danger" style={{ marginLeft: 8, fontSize: 16 }}>
                Company email not available
              </Text>
              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchCompanyEmail}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Text style={{ fontSize: 16 }}>
                For any company-related queries, reach out at:
              </Text>

              <Space
                direction="horizontal"
                align="center"
                style={{
                  background: "#f5f9ff",
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "1px solid #d6e4ff",
                  justifyContent: "center",
                  width: "fit-content",
                  margin: "0 auto",
                }}
              >
                <MailOutlined style={{ color: "#1677ff" }} />
                <Text copyable={{ text: email }} strong>
                  {email}
                </Text>
                <Tooltip title="Copy to clipboard">
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                  />
                </Tooltip>
              </Space>

              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={fetchCompanyEmail}
              >
                Refresh
              </Button>
            </>
          )}
        </Space>
      </Card>
    </motion.div>
  );
}
