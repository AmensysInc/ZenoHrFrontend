import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Typography,
  message,
  Spin,
} from "antd";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;
const { Option } = Select;

const EditUserRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  const [form] = Form.useForm();
  const [userName, setUserName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleRes, userRes, companyRes] = await Promise.all([
          axios.get(`${API_URL}/user-company/${id}`, config),
          axios.get(`${API_URL}/users`, config),
          axios.get(`${API_URL}/companies`, config),
        ]);

        const roleData = roleRes.data;
        form.setFieldsValue({
          role: roleData.role || "",
          companyId: roleData.companyId || "",
          defaultCompany: roleData.defaultCompany || false,
        });

        const matchedUser = userRes.data.find(
          (u) => u.id === roleData.userId
        );
        setUserName(
          matchedUser
            ? `${matchedUser.firstname} ${matchedUser.lastname}`
            : "User not found"
        );
        setCompanies(companyRes.data.content || []);
      } catch (err) {
        console.error("Error loading data:", err);
        message.error("Failed to fetch user role data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, API_URL, form]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await axios.put(`${API_URL}/user-company/${id}`, values, config);
      if (values.defaultCompany) {
        sessionStorage.setItem("defaultCompanyId", values.companyId);
      }
      message.success("User role updated successfully!");
      navigate("/companyrole");
    } catch (err) {
      console.error("Error updating role:", err);
      message.error("Failed to update user role.");
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
          Edit User Role
        </Title>

        <div style={{ padding: "0 28px" }}>
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item label="User">
                <Input value={userName} readOnly />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select placeholder="Select a role">
                  <Option value="ADMIN">ADMIN</Option>
                  <Option value="EMPLOYEE">EMPLOYEE</Option>
                  <Option value="RECRUITER">RECRUITER</Option>
                  <Option value="SALES">SALES</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="companyId"
                label="Company"
                rules={[{ required: true, message: "Please select a company" }]}
              >
                <Select placeholder="Select company">
                  {companies.map((company) => (
                    <Option key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="defaultCompany"
                label="Default Company"
                valuePropName="checked"
              >
                <Switch checkedChildren="True" unCheckedChildren="False" />
              </Form.Item>

              <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
                <Button
                  onClick={() => navigate("/companyrole")}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Update Role
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Card>
    </AnimatedPageWrapper>
  );
};

export default EditUserRole;
