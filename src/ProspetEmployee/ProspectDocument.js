import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Upload, Button, Card, message, Typography, Space } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function ProspectDocument() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");

  const documentLabels = {
    educational: "Educational Documents",
    passport: "Passport Copy",
    workStatus: "Work Status Documents",
    w4Form: "W-4 Form",
    i9Form: "I-9 Form",
    usIdProof: "US ID Proof",
    voidCheck: "Void Check",
    lcaDocument: "LCA Document (H1B Visa)",
    ssnCopy: "SSN Copy",
  };

  // Store each file and its Upload fileList
  const [documents, setDocuments] = useState(
    Object.fromEntries(
      Object.keys(documentLabels).map((key) => [key, { file: null, fileList: [] }])
    )
  );

  const handleFileChange = (info, key) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: {
        file: info.file.originFileObj,
        fileList: [info.file],
      },
    }));
  };

  const handleRemove = (key) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: { file: null, fileList: [] },
    }));
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      Object.values(documents).forEach((doc) => {
        if (doc.file) formData.append("documents", doc.file);
      });

      const response = await fetch(`${apiUrl}/employees/prospectFiles/${employeeId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 200) {
        message.success("Documents uploaded successfully!");
        navigate("/");
      } else {
        message.error("Failed to upload documents");
      }
    } catch (error) {
      console.error(error);
      message.error("Error uploading documents");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
      <Card bordered>
        <Title level={4} style={{ textAlign: "center", marginBottom: 24 }}>
          Prospect Document Upload
        </Title>

        <Form layout="vertical" onFinish={onSubmit}>
          {Object.keys(documentLabels).map((key) => (
            <Form.Item key={key} label={documentLabels[key]}>
              <Space>
                <Upload
                  beforeUpload={() => false} // prevent auto-upload
                  fileList={documents[key].fileList}
                  onChange={(info) => handleFileChange(info, key)}
                  onRemove={() => handleRemove(key)}
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Space>
            </Form.Item>
          ))}

          <Form.Item style={{ textAlign: "center", marginTop: 32 }}>
            <Button type="primary" htmlType="submit" size="large">
              Upload Documents
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
