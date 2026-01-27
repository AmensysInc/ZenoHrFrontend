import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Spin,
  message,
  Space,
  Button,
  Tooltip,
} from "antd";
import {
  MailOutlined,
  CopyOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

export default function CompanyContact() {
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [documentName, setDocumentName] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ==========================
  // Fetch Company Details
  // ==========================
  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      // Parse id from sessionStorage (stored as JSON)
      let employeeId = null;
      try {
        const idStr = sessionStorage.getItem("id");
        employeeId = idStr ? JSON.parse(idStr) : null;
      } catch {
        employeeId = sessionStorage.getItem("id"); // Fallback for non-JSON values
      }

      const response = await axios.get(
        `${apiUrl}/employees/${employeeId}`,
        { headers: getAuthHeaders() }
      );

      const company = response.data?.company || {};

      setEmail(company.email || "Unavailable");
      setCompanyId(company.companyId || null);
      setDocumentName(company.documentName || null);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch company contact details.");
      setEmail("Unavailable");
      setCompanyId(null);
      setDocumentName(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  // ==========================
  // Copy Email
  // ==========================
  const handleCopy = () => {
    if (email && email !== "Unavailable") {
      navigator.clipboard.writeText(email);
      message.success("Email copied to clipboard!");
    }
  };

  // ==========================
  // Download Company File (JWT SAFE)
  // ==========================
  const downloadCompanyFile = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/companies/${companyId}/download-document`,
        {
          headers: getAuthHeaders(),
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = documentName || "company-document";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      message.error("Failed to download company document");
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 30 }}
    >
      <Card
        bordered={false}
        style={{
          maxWidth: 600,
          margin: "0 auto",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%", textAlign: "center" }}>
          <Title level={3}>
            <MailOutlined style={{ color: "#1677ff", marginRight: 10 }} />
            Company Contact
          </Title>

          {loading ? (
            <Spin size="large" />
          ) : email === "Unavailable" ? (
            <>
              <InfoCircleOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />
              <Text type="danger">Company details not available</Text>
              <Button icon={<ReloadOutlined />} onClick={fetchCompanyDetails}>
                Retry
              </Button>
            </>
          ) : (
            <>
              {/* ================= Email ================= */}
              <Text>For company-related queries:</Text>

              <Space
                align="center"
                style={{
                  background: "#f5f9ff",
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "1px solid #d6e4ff",
                }}
              >
                <MailOutlined />
                <Text strong>{email}</Text>
                <Tooltip title="Copy">
                  <Button type="text" icon={<CopyOutlined />} onClick={handleCopy} />
                </Tooltip>
              </Space>

              {/* ================= Company Document ================= */}
              <div style={{ marginTop: 20 }}>
                <Title level={5}>Weekly Report template</Title>

                {documentName ? (
                  <Space>
                    <FileOutlined style={{ color: "#1677ff" }} />
                    <Text>{documentName}</Text>
                    <Tooltip title="Download">
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={downloadCompanyFile}
                      />
                    </Tooltip>
                  </Space>
                ) : (
                  <Text type="secondary">No document uploaded</Text>
                )}
              </div>

              <Button icon={<ReloadOutlined />} onClick={fetchCompanyDetails}>
                Refresh
              </Button>
            </>
          )}
        </Space>
      </Card>
    </motion.div>
  );
}
