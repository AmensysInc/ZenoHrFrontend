import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Modal,
  Alert,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import dayjs from "dayjs";
import {
  createEmployee,
  fetchEmployeeDataById,
  sendLoginDetails,
  updateEmployee,
} from "../SharedComponents/services/EmployeeServices";
import { fetchCompanies } from "../SharedComponents/services/CompaniesServies";

const { Title } = Typography;
const { Option } = Select;

export default function EmployeeForm({ mode }) {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendDetailsSuccess, setSendDetailsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const isEditMode = mode === "edit";

  // ✅ Fetch Companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyData = await fetchCompanies(0, 10);
        console.log("Fetched Companies:", companyData?.content);
        setCompanies(companyData?.content || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch Employee Data (Edit Mode)
  useEffect(() => {
    if (isEditMode && employeeId) {
      const fetchData = async () => {
        try {
          const data = await fetchEmployeeDataById(employeeId);
          if (data) {
            form.setFieldsValue({
              ...data,
              dob: data.dob ? dayjs(data.dob) : null,
              company: data.company?.companyId
                ? String(data.company.companyId)
                : data.company?.id
                ? String(data.company.id)
                : "",
            });
          }
        } catch (err) {
          console.error("Error fetching employee:", err);
        }
      };
      fetchData();
    }
  }, [isEditMode, employeeId, form]);

  // ✅ Password Validation
  const isValidPassword = (value) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return pattern.test(value);
  };

  // ✅ Submit Handler
const onFinish = async (values) => {
  try {
    console.log("Form Values:", values);

    if (!values.company) {
      setError("Please select a company before submitting.");
      return;
    }

    if (values.password && !isValidPassword(values.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
      );
      return;
    }

    const payload = {
      ...values,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      companyId: String(values.company), // ✅ Convert to string instead of Number
    };

    delete payload.company;
    console.log("Submitting Payload:", payload); // Should show companyId: "1"

    const success = isEditMode
      ? await updateEmployee(employeeId, payload)
      : await createEmployee(payload);

    if (success) setIsModalOpen(true);
  } catch (err) {
    console.error("Error:", err);
    setError(err?.response?.data?.message || "An unknown error occurred.");
  }
};
  

  // ✅ Send Login Details
  const handleSendDetails = async () => {
    const values = form.getFieldsValue();
    const success = await sendLoginDetails(values.emailID);
    if (success) setSendDetailsSuccess(true);
    else setError("Error sending login details.");
  };

  // ✅ Modal Controls
  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/employees");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/employees");
  };

  // ✅ Navigation Handlers
  const handleGoToProjects = () => {
    navigate(`/editemployee/${employeeId}/project-history`);
  };
  const handleGoToVisaDetails = () => {
    navigate(`/editemployee/${employeeId}/visa-details`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        {isEditMode ? "Edit Employee" : "Add Employee"}
      </Title>

      {error && (
        <Alert
          message={error}
          type="error"
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {sendDetailsSuccess && (
        <Alert
          message="Login details emailed successfully"
          type="success"
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          onBench: "",
          company: "",
        }}
      >
        {/* ================== Personal Details ================== */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="First Name" maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="lastName">
              <Input placeholder="Last Name" maxLength={50} />
            </Form.Item>
          </Col>
        </Row>

        {/* ================== Contact Details ================== */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="emailID"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNo"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Col>
        </Row>

        {/* ================== DOB & College ================== */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: "Please select DOB" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="College Name" name="clgOfGrad">
              <Input placeholder="College Name" />
            </Form.Item>
          </Col>
        </Row>

        {/* ================== Company & Status ================== */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true, message: "Please select company" }]}
            >
              <Select
                placeholder="Select Company"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {companies.map((comp) => (
                  <Option
                    key={comp.companyId ?? comp.id}
                    value={String(comp.companyId ?? comp.id)}
                  >
                    {comp.companyName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Working Status"
              name="onBench"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select Status">
                <Option value="Working">On Bench</Option>
                <Option value="OnProject">On Project</Option>
                <Option value="OnVacation">On Vacation</Option>
                <Option value="OnSick">On Sick</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* ================== Password ================== */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Password" name="password">
              <Input.Password placeholder="Password" />
            </Form.Item>
          </Col>
        </Row>

        {/* ================== Buttons ================== */}
        <Form.Item style={{ textAlign: "center", marginTop: 16 }}>
          {isEditMode && (
            <Button
              type="default"
              onClick={handleSendDetails}
              style={{ marginRight: 8 }}
            >
              Send Login Details
            </Button>
          )}
          <Button
            type="default"
            onClick={() => navigate("/employees")}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </Form.Item>

        {/* ================== Extra Actions ================== */}
        {isEditMode && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Space>
              <Button type="primary" onClick={handleGoToProjects}>
                View Project History
              </Button>
              <Button type="primary" onClick={handleGoToVisaDetails}>
                View Visa Details
              </Button>
            </Space>
          </div>
        )}
      </Form>

      {/* ================== Modal ================== */}
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Employee {isEditMode ? "updated" : "added"} successfully!</p>
      </Modal>
    </div>
  );
}
