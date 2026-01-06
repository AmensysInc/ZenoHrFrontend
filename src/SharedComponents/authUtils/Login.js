import React, { useState } from "react";
import { Input, Button, Typography, Form, message, Spin, Checkbox } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./authUtils";

const { Title, Text } = Typography;

export default function Login({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;
    setIsLoading(true);
    const error = await loginUser(email, password, onLogin, navigate);
    if (error) message.error(error);
    else message.success("Login successful!");
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Login Form */}
      <div style={styles.leftPanel}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={styles.loginForm}
        >
          <Title level={1} style={styles.title}>
            Login
          </Title>
          <Text style={styles.subtitle}>Login to your account.</Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            requiredMark={false}
            style={{ marginTop: 32 }}
          >
            <Form.Item
              name="email"
              label={<span style={styles.label}>E-mail Address</span>}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={styles.label}>Password</span>}
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                style={styles.input}
              />
            </Form.Item>

            <div style={styles.formOptions}>
              <Checkbox style={styles.rememberMe}>Remember me</Checkbox>
              <Link to="/forgot-password" style={styles.resetPassword}>
                Reset Password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={styles.signInBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ color: "white" }} spin />
                    }
                    size="small"
                  />{" "}
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>
        </motion.div>
      </div>

      {/* Right Panel - Image Background */}
      <div style={styles.rightPanel}>
        <img
          src={process.env.PUBLIC_URL + "/login-bg.png"}
          alt="Login background"
          style={styles.backgroundImage}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  // Left Panel
  leftPanel: {
    flex: 1,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  loginForm: {
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    color: "#1e3a8a",
    fontSize: "2.5rem",
    fontWeight: 600,
    marginBottom: "12px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
  },
  label: {
    color: "#1e3a8a",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  formOptions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  rememberMe: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  resetPassword: {
    color: "#1e3a8a",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  signInBtn: {
    width: "100%",
    padding: "14px",
    background: "#1e40af",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 500,
    height: "48px",
  },
  signupLink: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "0.9rem",
  },
  signupAnchor: {
    color: "#1e3a8a",
    textDecoration: "none",
    fontWeight: 600,
  },
  // Right Panel
  rightPanel: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  heroContent: {
    textAlign: "center",
    zIndex: 2,
    position: "relative",
  },
  heroTitle: {
    color: "white",
    fontSize: "2.5rem",
    fontWeight: 600,
    lineHeight: 1.3,
    marginBottom: "40px",
  },
  highlight: {
    color: "#fbbf24",
  },
  documentVisual: {
    width: "350px",
    height: "220px",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    transform: "rotate(-12deg)",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    marginBottom: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  documentText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "1.2rem",
    fontWeight: 700,
    letterSpacing: "2px",
    textAlign: "center",
    transform: "rotate(12deg)",
  },
  navDots: {
    position: "absolute",
    bottom: "-100px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "12px",
  },
  dot: {
    width: "40px",
    height: "8px",
    borderRadius: "4px",
    background: "rgba(255, 255, 255, 0.4)",
    cursor: "pointer",
  },
  dotActive: {
    background: "#fbbf24",
  },
};