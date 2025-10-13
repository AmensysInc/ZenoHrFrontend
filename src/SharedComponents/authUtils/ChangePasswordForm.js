import React, { useState } from "react";
import { logoutUser, updatePassword } from "./authUtils";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Alert,
  Space,
} from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ChangePasswordForm = ({ setIsLoggedIn, setRole }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(setIsLoggedIn, setRole, navigate);
  };

  const handleChangePassword = async (values) => {
    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const userId = sessionStorage.getItem("id");

      // ✅ Updated payload includes category
      const payload = {
        userId,
        password,
        category: "CHANGE_PASSWORD",
      };

      await updatePassword(payload);
      handleLogout();
    } catch (error) {
      setErrorMessage(error.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
        padding: "20px",
      }}
    >
      <Card
        title={
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Change Password
          </Title>
        }
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              closable
              onClose={() => setErrorMessage("")}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleChangePassword}
            autoComplete="off"
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 6, message: "Password must be at least 6 characters long" },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match.")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                style={{ borderRadius: 6 }}
              >
                Confirm
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Want to go back?{" "}
              <a onClick={() => navigate("/login")}>Return to Login</a>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
