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
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card
          bordered={false}
          style={styles.card}
          hoverable
          className="shadow-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div style={styles.header}>
              <Title level={2} style={styles.title}>
                Welcome Back
              </Title>
              <Text type="secondary">
                Log in to your <b>Zeno HR & PAY</b> account
              </Text>
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
                />
              </Form.Item>

              <div style={styles.forgot}>
                <Link to="/forgot-password" style={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>

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
            </Form>

            {/* <div style={styles.footer}>
              <Text type="secondary">
                Don’t have an account?{" "}
                <Link to="/signup" style={styles.signupLink}>
                  Sign Up
                </Link>
              </Text>
            </div> */}
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
    padding: "20px",
  },
  card: {
    width: 400,
    borderRadius: 16,
    background: "white",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    padding: "30px 35px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "4px",
    color: "#2d3748",
  },
  forgot: {
    textAlign: "right",
    marginBottom: "20px",
  },
  forgotLink: {
    color: "#667eea",
    textDecoration: "none",
  },
  button: {
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    border: "none",
    fontWeight: 600,
    transition: "0.3s",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
  },
  signupLink: {
    color: "#764ba2",
    fontWeight: 600,
  },
};
