import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Modal,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function AddProspectEmployee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      const response = await fetch(`${apiUrl}/employees/prospect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        setIsModalOpen(true);
      } else {
        message.error("Failed to add prospect employee");
      }
    } catch (error) {
      console.error(error);
      message.error("Error adding employee");
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Add Prospect Employee
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          onBench: "",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Last Name" name="lastName">
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email Address"
          name="emailID"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Email Address" />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: "Please select date of birth" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Name of the College"
          name="clgOfGrad"
          rules={[{ required: true, message: "Please enter college name" }]}
        >
          <Input placeholder="College Name" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNo"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>

        <Form.Item
          label="Working / Bench"
          name="onBench"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select Status">
            <Option value="Working">Working</Option>
            <Option value="OnProject">On Project</Option>
            <Option value="OnVacation">On Vacation</Option>
            <Option value="OnSick">On Sick</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Submit
          </Button>
          <Button onClick={() => navigate("/employees")}>Cancel</Button>
        </Form.Item>
      </Form>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
      >
        <p>Prospect Employee added successfully!</p>
      </Modal>
    </div>
  );
}
