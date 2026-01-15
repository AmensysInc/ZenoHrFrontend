import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Typography, message } from "antd";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;
const { TextArea } = Input;

export default function EmailTemplateForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");

      const payload = {
        name: values.name,
        description: values.description || "",
        subject: values.subject,
        body: values.body,
        category: values.category || "",
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      const response = await axios.post(
        `${API_URL}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Template saved:", response.data);
      message.success("Email template created successfully");
      navigate("/email-templates");
    } catch (err) {
      console.error("Error saving template:", err);
      message.error("Failed to save the email template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPageWrapper>
      <Card
        style={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "16px 0 28px 0",
        }}
      >
        <Title level={4} style={titleStyle}>
          Create Email Template
        </Title>

        <div style={{ padding: "0 28px" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isActive: true,
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter template name" }]}
            >
              <Input placeholder="Template Name" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
            >
              <Input placeholder="Description" />
            </Form.Item>

            <Form.Item
              label="Subject"
              name="subject"
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input placeholder="Email Subject" />
            </Form.Item>

            <Form.Item
              label="Body"
              name="body"
              rules={[{ required: true, message: "Please enter body" }]}
            >
              <TextArea rows={6} placeholder="Email Body" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
            >
              <Input placeholder="Category" />
            </Form.Item>

            <Form.Item
              name="isActive"
              valuePropName="checked"
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
              <Button onClick={() => navigate("/email-templates")} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Template
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </AnimatedPageWrapper>
  );
}
