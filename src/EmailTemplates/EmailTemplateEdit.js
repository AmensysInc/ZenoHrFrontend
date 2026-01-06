import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Typography, message, Spin } from "antd";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;
const { TextArea } = Input;

export default function EmailTemplateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        form.setFieldsValue({
          name: response.data.name,
          description: response.data.description || "",
          subject: response.data.subject,
          body: response.data.body,
          category: response.data.category || "",
          isActive: response.data.isActive,
        });
      } catch (err) {
        console.error("Error fetching template:", err);
        message.error("Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, API_URL, form]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
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

      await axios.put(`${API_URL}/messages/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      message.success("Email template updated successfully");
      navigate("/email-templates");
    } catch (err) {
      console.error("Error updating template:", err);
      message.error("Failed to update the template");
    } finally {
      setSubmitting(false);
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
          Edit Email Template
        </Title>

        <div style={{ padding: "0 28px" }}>
          <Spin spinning={loading}>
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
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Update Template
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Card>
    </AnimatedPageWrapper>
  );
}
