import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Typography, Card, Space } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { post } from "../httpClient ";

const { Title, Paragraph, Text } = Typography;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sendDetailsSuccess, setSendDetailsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    try {
      const payload = {
        email: values.email,
        category: "FORGOT_PASSWORD",
      };

      const response = await post("/auth/resetPassword", payload);

      if (response.status === 200 || response.status === 201) {
        setSendDetailsSuccess(true);
        setError(null);
      }
    } catch (err) {
      setError("Email does not exist");
      console.error("An error occurred:", err);
    }
  };

  const handleCloseSuccess = () => {
    setSendDetailsSuccess(false);
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f6fa",
        padding: "20px",
      }}
    >
      <Card
        title={
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Forgot Password?
          </Title>
        }
        style={{
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          borderRadius: 12,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {error && (
            <Alert
              message={error}
              type="error"
              closable
              onClose={() => setError(null)}
              showIcon
            />
          )}

          {sendDetailsSuccess && (
            <Alert
              message="Temporary password details emailed successfully!"
              type="success"
              closable
              onClose={handleCloseSuccess}
              showIcon
            />
          )}

          <Paragraph style={{ textAlign: "center" }}>
            Don’t worry. Resetting your password is easy — just tell us the email address you registered with{" "}
            <Text strong>ZenoPay</Text>.
          </Paragraph>

          <Form layout="vertical" onFinish={handleForgotPassword}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{ borderRadius: 6 }}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Remembered your password?{" "}
              <a onClick={() => navigate("/login")}>Back to Login</a>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}
