import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message, Spin } from "antd";
import { LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { updatePassword } from "../authUtils/authUtils";

const { Title, Text } = Typography;

export default function ChangePasswordForm({ setIsLoggedIn, setRole }) {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (values) => {
    const userId = id || sessionStorage.getItem("id");
    const { password } = values;

    if (!userId || !password) {
      message.error("Invalid user or password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updatePassword(userId, password);

      if (response.ok) {
        message.success("Password updated successfully! Please log in again.");

        // ✅ Proper logout and state update
        sessionStorage.clear();
        setIsLoggedIn(false);
        setRole("");

        // ✅ Wait for state to propagate, then navigate
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        message.error("Failed to update password. Try again.");
      }
    } catch (error) {
      console.error("Error in password update:", error);
      message.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
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
          <div style={styles.header}>
            <Title level={2} style={styles.title}>
              Change Password
            </Title>
            <Text style={styles.subtitle}>
              Set a new password for your <b>Zeno HR & PAY</b> account
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            style={{ marginTop: 25 }}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined style={{ color: "#8b8b8b" }} />}
                placeholder="Enter new password"
                style={styles.input}
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
                      new Error("Passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined style={{ color: "#8b8b8b" }} />}
                placeholder="Confirm password"
                style={styles.input}
              />
            </Form.Item>

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
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </motion.div>
          </Form>
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
  button: {
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    border: "none",
    fontWeight: 600,
    height: "48px",
    borderRadius: 12,
  },
};
