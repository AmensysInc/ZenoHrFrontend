import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Select, Radio, Button, Card, Typography, message } from "antd";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;
const { Option } = Select;

const AddUserRole = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [assignedCompanies, setAssignedCompanies] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, companyRes] = await Promise.all([
          axios.get(`${API_URL}/users`, config),
          axios.get(`${API_URL}/companies?page=0&size=100`, config),
        ]);

        const filteredUsers = (userRes.data || []).filter(
          (user) =>
            user.role?.toUpperCase() !== "EMPLOYEE" &&
            user.role?.toUpperCase() !== "PROSPECT"
        );

        setEmployees(filteredUsers);
        setCompanies(companyRes.data?.content || []);
      } catch (err) {
        console.error("Error loading users or companies", err);
        setEmployees([]);
        setCompanies([]);
      }
    };

    fetchData();
  }, []);

  // Pre-fill userId from query params
  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      form.setFieldsValue({ userId });
      setSelectedUserId(userId);
    }
  }, [searchParams, form]);

  useEffect(() => {
    const fetchAssignedCompanies = async () => {
      if (!selectedUserId) {
        setAssignedCompanies([]);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/user-company`, config);

        const assigned = res.data
          .filter((item) => item.userId === selectedUserId)
          .map((item) => item.companyId);

        setAssignedCompanies(assigned);
      } catch (error) {
        console.error("Error fetching assigned companies", error);
      }
    };

    fetchAssignedCompanies();
  }, [selectedUserId]);

  const availableCompanies = companies.filter(
    (comp) => !assignedCompanies.includes(comp.companyId)
  );

  const handleSubmit = async (values) => {
    const payload = {
      userId: values.userId,
      companyId: parseInt(values.companyId),
      defaultCompany: values.defaultCompany,
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      setLoading(true);
      await axios.post(`${API_URL}/user-company`, payload, config);
      message.success("User role added successfully!");
      form.resetFields();
      setSelectedUserId(null);
      navigate("/companyrole");
    } catch (error) {
      console.error("Error adding user role", error);
      message.error("Failed to add user role");
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (value) => {
    setSelectedUserId(value);
    form.setFieldsValue({ companyId: undefined });
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
          Add Company User Role
        </Title>

        <div style={{ padding: "0 28px" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              defaultCompany: "true",
            }}
          >
            <Form.Item
              label="User"
              name="userId"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select
                placeholder="Select User"
                onChange={handleUserChange}
                showSearch
                optionFilterProp="children"
              >
                {employees.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                    {user.role ? ` – ${user.role}` : ""}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Company"
              name="companyId"
              rules={[{ required: true, message: "Please select a company" }]}
            >
              <Select
                placeholder={
                  selectedUserId
                    ? "Select Company"
                    : "Select User First"
                }
                disabled={!selectedUserId}
                showSearch
                optionFilterProp="children"
              >
                {availableCompanies.length > 0 ? (
                  availableCompanies.map((comp) => (
                    <Option key={comp.companyId} value={comp.companyId}>
                      {comp.companyName}
                    </Option>
                  ))
                ) : (
                  selectedUserId && (
                    <Option disabled value="">
                      No available companies
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label="Default Company"
              name="defaultCompany"
              rules={[
                { required: true, message: "Please select default company option" },
              ]}
            >
              <Radio.Group>
                <Radio value="true">True</Radio>
                <Radio value="false">False</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                onClick={() => navigate("/companyrole")}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add User Role
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </AnimatedPageWrapper>
  );
};

export default AddUserRole;
