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
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import "./EditUserRole.css";

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

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /** Fetch role, user, and company data **/
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

  /** Submit Handler **/
  const handleSubmit = async (values) => {
    try {
      await axios.put(`${API_URL}/user-company/${id}`, values, config);
      if (values.defaultCompany) {
        sessionStorage.setItem("defaultCompanyId", values.companyId);
      }
      message.success("User role updated successfully!");
      navigate("/companyrole");
    } catch (err) {
      console.error("Error updating role:", err);
      message.error("Failed to update user role.");
    }
  };

  if (loading) {
    return (
      <div className="edit-user-role-loading">
        <Spin size="large" tip="Loading user role..." />
      </div>
    );
  }

  return (
    <div className="edit-user-role-container">
      <Card
        bordered={false}
        className="edit-user-role-card"
        title={
          <div className="edit-user-role-header">
            <Button
              icon={<ArrowLeftOutlined />}
              type="link"
              onClick={() => navigate("/companyrole")}
            >
              Back
            </Button>
            <Title level={3}>Edit User Role</Title>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className="edit-user-role-form"
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              block
            >
              Update Role
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditUserRole;
