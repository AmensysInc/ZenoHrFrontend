import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  message,
  Typography,
  Spin,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ProspectEmployee() {
  const [form] = Form.useForm();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem("id");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeId) fetchEmployee();
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const emp = response.data;

      // convert date strings to dayjs objects
      const formatted = {
        ...emp,
        dob: emp.dob ? dayjs(emp.dob) : null,
        startDateWithAmensys: emp.startDateWithAmensys
          ? dayjs(emp.startDateWithAmensys)
          : null,
      };

      form.setFieldsValue(formatted);
    } catch (error) {
      console.error("Error fetching employee:", error);
      message.error("Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const token = sessionStorage.getItem("token");

      const formattedData = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        startDateWithAmensys: values.startDateWithAmensys
          ? values.startDateWithAmensys.format("YYYY-MM-DD")
          : null,
      };

      const response = await axios.put(
        `${apiUrl}/employees/prospect/${employeeId}`,
        formattedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        message.success("Employee details updated successfully!");
        navigate("/uploadDocs");
      } else {
        message.error("Failed to update employee details.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      message.error("Error updating employee details.");
    }
  };

  return (
    <Spin spinning={loading}>
      <Card
        style={{
          maxWidth: 1000,
          margin: "30px auto",
          padding: "24px",
          borderRadius: "12px",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
          Employee Details
        </Title>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Middle Name"
                name="middleName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Middle Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Last Name" name="lastName">
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Date of Birth" name="dob" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="MM/DD/YYYY" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Father's Name"
                name="fatherName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Father's full name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="SSN" name="ssn" rules={[{ required: true }]}>
                <Input type="number" placeholder="SSN" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Phone Number" name="phoneNo" rules={[{ required: true }]}>
                <Input type="number" placeholder="Phone Number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Email" name="emailID" rules={[{ required: true }]}>
                <Input type="email" placeholder="Email Address" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Current Work Location"
                name="currentWorkLocation"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Full address" rows={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Residential Address"
                name="residentialAddress"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Full address" rows={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Home Country Address"
                name="homeCountryAddress"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Full address" rows={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Emergency Contact"
                name="emergencyContactDetails"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Name, Phone, Address" rows={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Visa Status" name="visaStatus" rules={[{ required: true }]}>
                <Input placeholder="Visa Status" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="University of Graduation"
                name="clgOfGrad"
                rules={[{ required: true }]}
              >
                <Input placeholder="University Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Bachelor's Degree"
                name="bachelorsDegree"
                rules={[{ required: true }]}
              >
                <Input placeholder="Bachelor's Degree" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Master's Degree"
                name="mastersDegree"
                rules={[{ required: true }]}
              >
                <Input placeholder="Master's Degree" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Bank Name" name="bankName" rules={[{ required: true }]}>
                <Input placeholder="Bank Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Account Type" name="accType" rules={[{ required: true }]}>
                <Input placeholder="Account Type" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Routing Number"
                name="routingNumber"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="Routing Number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Account Number"
                name="accNumber"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="Account Number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Marital Status"
                name="maritalStatus"
                rules={[{ required: true }]}
              >
                <Input placeholder="Marital Status" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="IT Filing State"
                name="itFilingState"
                rules={[{ required: true }]}
              >
                <Input placeholder="IT Filing State" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Need Insurance"
                name="needInsurance"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Option">
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Start Date with Amensys"
                name="startDateWithAmensys"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "center", marginTop: 30 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
              Update
            </Button>
            <Link to="/">
              <Button danger>Cancel</Button>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
}
