import React, { useState } from "react";
import { Card, Input, Button, Typography, Form, message, Spin } from "antd";
import { MailOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
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
    <div style={styles.wrapper}>
      {/* Animated background */}
      <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={styles.animatedBg}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <Card bordered={false} style={styles.card}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div style={styles.header}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Title level={2} style={styles.title}>
                  Welcome Back
                </Title>
                <Text style={styles.subtitle}>
                  Log in to your <b>Zeno HR & PAY</b> account
                </Text>
              </motion.div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              requiredMark={false}
              style={{ marginTop: 30 }}
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined style={{ color: "#8b8b8b" }} />}
                  placeholder="Enter your email"
                  style={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: "#8b8b8b" }} />}
                  placeholder="Enter your password"
                  style={styles.input}
                />
              </Form.Item>

              <div style={styles.forgot}>
                <Link to="/forgot-password" style={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  style={styles.button}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spin
                        indicator={<LoadingOutlined style={{ color: "white" }} spin />}
                        size="small"
                      />{" "}
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </motion.div>
            </Form>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    overflow: "hidden",
    padding: "20px",
  },
  animatedBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    background: "linear-gradient(120deg, #667eea, #764ba2, #6b73ff, #000dff)",
    backgroundSize: "300% 300%",
    filter: "blur(80px)",
    opacity: 0.6,
  },
  card: {
    width: 420,
    borderRadius: 18,
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    padding: "40px 35px",
    position: "relative",
    zIndex: 1,
    backdropFilter: "blur(12px)",
  },
  header: {
    textAlign: "center",
    marginBottom: "25px",
  },
  title: {
    color: "#2d3748",
    fontWeight: 700,
    marginBottom: "6px",
  },
  subtitle: {
    color: "#6b7280",
  },
  input: {
    borderRadius: 10,
  },
  forgot: {
    textAlign: "right",
    marginBottom: "25px",
  },
  forgotLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: 500,
  },
  button: {
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    border: "none",
    fontWeight: 600,
    height: "48px",
    borderRadius: 12,
  },
  footer: {
    textAlign: "center",
    marginTop: 25,
  },
  signupLink: {
    color: "#764ba2",
    fontWeight: 600,
  },
};
