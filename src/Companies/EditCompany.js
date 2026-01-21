import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Upload,
  Divider,
} from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCompany() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);

  const [form] = Form.useForm();

  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

  // ==========================
  // Auth Header
  // ==========================
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ==========================
  // Fetch Company
  // ==========================
  useEffect(() => {
    if (!companyId) {
      message.error("Invalid company id");
      navigate("/companies");
      return;
    }

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${apiUrl}/companies/${companyId}`, {
          headers: getAuthHeaders(),
        });

        const company = resp.data || {};

        form.setFieldsValue({
          companyName: company.companyName || "",
          email: company.email || "",
          phoneNo: company.phoneNo || "",
          addressLine1: company.addressLine1 || "",
        });

        // ✅ Existing document
        if (company.documentName) {
          setExistingFile({
            name: company.documentName,
          });
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to load company");
        navigate("/companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, apiUrl, form, navigate]);

  // ==========================
  // Upload Props
  // ==========================
  const uploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file);
      return false;
    },
    maxCount: 1,
    accept: ".pdf,.doc,.docx,.xls,.xlsx",
    onRemove: () => setSelectedFile(null),
  };

  // ==========================
  // Download Existing File
  // ==========================
  const downloadExistingFile = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/companies/${companyId}/download-document`,
        {
          headers: {
            ...getAuthHeaders(),
          },
          responseType: "blob", // IMPORTANT
        }
      );

      // Create download link
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = existingFile?.name || "company-document";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      message.error("Failed to download document");
    }
  };

  // ==========================
  // Submit Handler
  // ==========================
  const onFinish = async (values) => {
    setSubmitting(true);

    try {
      // 1️⃣ Update Company (JSON)
      await axios.put(
        `${apiUrl}/companies/${companyId}`,
        {
          companyName: values.companyName,
          email: values.email,
          phoneNo: values.phoneNo,
          addressLine1: values.addressLine1,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      // 2️⃣ Upload New Document (Optional)
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);

        await axios.post(
          `${apiUrl}/companies/${companyId}/upload-document`,
          fileData,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
      }

      message.success("Company updated successfully");
      navigate("/companies");
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Error updating company");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================
  // Loading UI
  // ==========================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  // ==========================
  // UI
  // ==========================
  return (
    <Card
      title="Edit Company"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phoneNo">
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="addressLine1">
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* ==========================
            Existing Document
           ========================== */}
        {existingFile && (
          <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <strong>Reporting template:</strong>
              <div style={{ marginTop: 6 }}>
                📄 {existingFile.name}
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={downloadExistingFile}
                >
                  Download
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ==========================
            Upload New Document
           ========================== */}
        <Form.Item label="Status Report Template">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            PDF, DOC, DOCX, XLS, XLSX
          </div>
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", gap: 10 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Save
            </Button>
            <Button onClick={() => navigate("/companies")}>Cancel</Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}