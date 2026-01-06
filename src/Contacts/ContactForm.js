import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Card, Typography, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEmployee,
  fetchEmployeeDataById,
  updateEmployee,
} from "../SharedComponents/services/ContactServices";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;

export default function ContactForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (isEditMode && id) {
      const fetchData = async () => {
        try {
          const employeeData = await fetchEmployeeDataById(id);
          if (employeeData) {
            form.setFieldsValue(employeeData);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };
      fetchData();
    }
  }, [isEditMode, id, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const success = isEditMode
        ? await updateEmployee(id, values)
        : await createEmployee(values);

      if (success) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} contact:`,
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/contacts");
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
          {isEditMode ? "Edit" : "Add"} Contact
        </Title>

        <div style={{ padding: "0 28px" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: "Please enter first name" }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[{ required: true, message: "Please enter phone number" }]}
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="LinkedIn Profile"
              name="linkedinLink"
            >
              <Input placeholder="LinkedIn Profile URL" />
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
              <Button onClick={() => navigate("/contacts")} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Modal
          open={isModalOpen}
          onOk={handleModalClose}
          onCancel={handleModalClose}
          footer={[
            <Button key="ok" type="primary" onClick={handleModalClose}>
              OK
            </Button>,
          ]}
        >
          <p>Contact {isEditMode ? "Updated" : "Added"} successfully!</p>
        </Modal>
      </Card>
    </AnimatedPageWrapper>
  );
}
