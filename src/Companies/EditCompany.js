import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Spin } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCompany() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token"); // adjust key if you use different
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!companyId) {
      message.error("Missing company id");
      navigate("/companies");
      return;
    }

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${apiUrl}/companies/${companyId}`, {
          headers: getAuthHeaders(),
        });
        // Expected response: company object
        const company = resp.data || {};
        // prefill form fields (only fields we have)
        form.setFieldsValue({
          companyName: company.companyName ?? "",
          email: company.email ?? "",
          phone: company.phone ?? "",
          address: company.address ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch company", err);
        message.error("Failed to load company details");
        navigate("/companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Build payload - include fields you want to update
      const payload = {
        companyName: values.companyName,
        email: values.email,
        phone: values.phone,
        address: values.address,
      };

      const resp = await axios.put(
        `${apiUrl}/companies/${companyId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      // If backend returns updated company:
      if (resp.status === 200 || resp.status === 201) {
        message.success("Company updated successfully");
        navigate("/companies");
      } else {
        message.error("Failed to update company");
      }
    } catch (err) {
      console.error("Update error", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Error updating company";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: 16,
        maxWidth: 800,
        margin: "0 auto",
      }}
      title="Edit Company"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          companyName: "",
          email: "",
          phone: "",
          address: "",
        }}
      >
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[
            { required: true, message: "Please enter company name" },
            { max: 100, message: "Max 100 characters" },
          ]}
        >
          <Input placeholder="Company name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Enter a valid email" },
            { required: true, message: "Please enter email" },
          ]}
        >
          <Input placeholder="contact@company.com" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: false },
            { max: 25, message: "Max 25 characters" },
          ]}
        >
          <Input placeholder="+91 12345 67890" />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[{ required: false }]}>
          <Input.TextArea rows={4} placeholder="Address / location" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
            >
              Save Changes
            </Button>
            <Button
              onClick={() => {
                navigate("/companies");
              }}
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
