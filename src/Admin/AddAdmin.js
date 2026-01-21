import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, message, Select } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { fetchCompanies } from "../SharedComponents/services/CompaniesServies";

const { Option } = Select;

export default function AddAdmin() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companyData = await fetchCompanies(0, 100);
        setCompanies(companyData?.content || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        message.error("Failed to load companies");
      }
    };
    loadCompanies();
  }, []);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Create Admin/Group Admin user via the backend endpoint
      const params = new URLSearchParams({
        email: values.email,
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
        role: values.role || "ADMIN",
      });

      // Only include companyId in params if it's provided (optional for GROUP_ADMIN)
      if (values.companyId) {
        params.append('companyId', values.companyId);
      }

      const response = await axios.get(
        `${apiUrl}/admin/create-user?${params.toString()}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      if (response.data && response.data.includes("successfully")) {
        message.success("Admin created successfully!");
        form.resetFields();
        navigate("/companyrole"); // Navigate to user role management page
      } else {
        message.error(response.data || "Failed to create admin");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      message.error(
        error?.response?.data || "Error creating admin. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPageWrapper>
      <Card
        title={
          <span>
            <UserAddOutlined style={{ marginRight: 8 }} />
            Create New Admin
          </span>
        }
        style={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Enter last name" />
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
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
            initialValue="ADMIN"
          >
            <Select placeholder="Select role">
              <Option value="ADMIN">ADMIN</Option>
              <Option value="GROUP_ADMIN">GROUP_ADMIN</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Assign to Company"
            name="companyId"
            dependencies={['role']}
            rules={[
              { 
                required: false,
                validator: (_, value) => {
                  const role = form.getFieldValue('role');
                  if (role === 'ADMIN' && !value) {
                    return Promise.reject(new Error('Admin must be assigned to a company'));
                  }
                  return Promise.resolve();
                }
              },
            ]}
            help={(form.getFieldValue('role') === 'GROUP_ADMIN') 
              ? "Group Admin can have multiple companies. You can assign companies after creation using 'Add User Role' page, or select a company here to assign it now." 
              : "Admin must be assigned to a company"}
          >
            <Select
              placeholder={form.getFieldValue('role') === 'GROUP_ADMIN' ? "Optional - Select a company (or assign later)" : "Select a company"}
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {companies.map((company) => (
                <Option key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", gap: 10 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Create Admin
              </Button>
              <Button onClick={() => navigate("/companyrole")}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </AnimatedPageWrapper>
  );
}

