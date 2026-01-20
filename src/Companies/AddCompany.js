import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCompany() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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
  // Submit Handler
  // ==========================
  const onFinish = async (values) => {
    setSubmitting(true);

    try {
      // 1️⃣ Create Company (JSON)
      const response = await axios.post(
        `${apiUrl}/companies`,
        {
          companyName: values.companyName,
          email: values.email,
          phoneNo: values.phoneNo,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          secondaryEmail: values.secondaryEmail,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      const newCompanyId = response.data?.companyId;

      // 2️⃣ Upload Document (Optional)
      if (selectedFile && newCompanyId) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);

        await axios.post(
          `${apiUrl}/companies/${newCompanyId}/upload-document`,
          fileData,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
      }

      message.success("Company created successfully");
      navigate("/companies");
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Error creating company");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <Card
      title="Add New Company"
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
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          label="Secondary Email"
          name="secondaryEmail"
          rules={[{ type: "email", message: "Please enter a valid email" }]}
        >
          <Input placeholder="Enter secondary email (optional)" />
        </Form.Item>

        <Form.Item label="Phone Number" name="phoneNo">
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item label="Address Line 1" name="addressLine1">
          <Input.TextArea rows={2} placeholder="Enter address line 1" />
        </Form.Item>

        <Form.Item label="Address Line 2" name="addressLine2">
          <Input.TextArea rows={2} placeholder="Enter address line 2 (optional)" />
        </Form.Item>

        <Form.Item label="City" name="city">
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item label="State" name="state">
          <Input placeholder="Enter state" />
        </Form.Item>

        <Form.Item label="Zip Code" name="zipCode">
          <Input placeholder="Enter zip code" />
        </Form.Item>

        {/* ==========================
            Upload Document
           ========================== */}
        <Form.Item label="Upload Document (Optional)">
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
              Create Company
            </Button>
            <Button onClick={() => navigate("/companies")}>Cancel</Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}

