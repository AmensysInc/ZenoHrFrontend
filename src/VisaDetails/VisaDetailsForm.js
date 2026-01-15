import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Modal,
  message,
  Card,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  createVisa,
  updateVisa,
  fetchVisaDetails,
  fetchEmployeeDetails,
} from "../SharedComponents/services/VisaDetailsService";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function VisaDetailsForm({ mode }) {
  const navigate = useNavigate();
  const { visaId, employeeId } = useParams();

  const [form] = Form.useForm();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEditMode = mode === "edit";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await fetchEmployeeDetails(employeeId);
        if (employeeResponse) {
          setEmployeeDetails(employeeResponse);
        }

        if (isEditMode) {
          const response = await fetchVisaDetails(visaId);
          const formattedData = {
            ...response,
            visaStartDate: response.visaStartDate
              ? dayjs(response.visaStartDate)
              : null,
            visaExpiryDate: response.visaExpiryDate
              ? dayjs(response.visaExpiryDate)
              : null,
            i94Date: response.i94Date ? dayjs(response.i94Date) : null,
          };
          form.setFieldsValue(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isEditMode, employeeId, visaId, form]);

  const handleNavigate = () => {
    navigate(`/editemployee/${employeeId}/visa-details`);
  };

  const handleSubmit = async (values) => {
    const start = new Date(values.visaStartDate);
    const expiry = new Date(values.visaExpiryDate);

    if (start >= expiry) {
      message.error("Visa Expiry Date must be after Start Date");
      return;
    }

    const payload = {
      ...values,
      visaStartDate: values.visaStartDate
        ? values.visaStartDate.format("YYYY-MM-DD")
        : null,
      visaExpiryDate: values.visaExpiryDate
        ? values.visaExpiryDate.format("YYYY-MM-DD")
        : null,
      i94Date: values.i94Date ? values.i94Date.format("YYYY-MM-DD") : null,
    };

    try {
      if (isEditMode) {
        await updateVisa(visaId, payload);
      } else {
        await createVisa(employeeId, payload);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving visa details:", error);
      message.error("Failed to save visa details");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    handleNavigate();
  };

  return (
    <AnimatedPageWrapper>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "16px 0 28px 0",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <Title level={4} style={{ ...titleStyle, paddingBottom: 12 }}>
          {isEditMode ? "Edit Visa Details" : "Add Visa Details"}
        </Title>
        <p style={{ textAlign: "center", color: "#555", marginBottom: 20 }}>
          {employeeDetails.firstName} {employeeDetails.lastName}
        </p>

        <div style={{ padding: "0 28px" }}>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name">
                <Input value={employeeDetails.firstName} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name">
                <Input value={employeeDetails.lastName} disabled />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Visa Start Date"
                name="visaStartDate"
                rules={[{ required: true, message: "Please select start date" }]}
              >
                <DatePicker className="w-100" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Visa Expiry Date"
                name="visaExpiryDate"
                rules={[{ required: true, message: "Please select expiry date" }]}
              >
                <DatePicker className="w-100" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Visa Type"
                name="visaType"
                rules={[{ required: true, message: "Please select visa type" }]}
              >
                <Select placeholder="Select Visa Type">
                  <Option value="H1B">H1B</Option>
                  <Option value="H4AD">H4 EAD</Option>
                  <Option value="CPT">CPT</Option>
                  <Option value="OPT">OPT(Extension)</Option>
                  <Option value="GREENCARD">Green Card</Option>
                  <Option value="CITIZEN">US CITIZEN</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="I-94 Date" name="i94Date">
                <DatePicker className="w-100" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="LCA Number" name="lcaNumber">
                <Input placeholder="Enter LCA Number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="LCA Wage" name="lcaWage">
                <Input placeholder="Enter LCA Wage" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Job Title" name="jobTitle">
                <Input placeholder="Enter Job Title" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="I140 Status" name="i140Status">
                <Select placeholder="Select I140 Status">
                  <Option value="Pending">Pending</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Denied">Denied</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="GC Status" name="gcStatus">
                <Select placeholder="Select GC Status">
                  <Option value="Not Applied">Not Applied</Option>
                  <Option value="In Process">In Process</Option>
                  <Option value="Approved">Approved</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Attorney" name="attorney">
                <Input placeholder="Enter Attorney Name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Receipt" name="receipt">
                <Input placeholder="Enter Receipt Number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Residential Address"
                name="residentialAddress"
              >
                <Input placeholder="Enter Residential Address" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Comments" name="comments">
                <TextArea rows={3} placeholder="Enter any comments..." />
              </Form.Item>
            </Col>
          </Row>

          <div
            className="d-flex justify-content-end"
            style={{ gap: 12, marginTop: 16 }}
          >
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Submit"}
            </Button>
            <Button danger onClick={handleNavigate}>
              Cancel
            </Button>
          </div>
          </Form>

          <Modal
            open={isModalOpen}
            onOk={handleModalClose}
            onCancel={handleModalClose}
            title="Success"
          >
            <p>
              Visa details {isEditMode ? "updated" : "added"} successfully for{" "}
              {employeeDetails.firstName} {employeeDetails.lastName}.
            </p>
          </Modal>
        </div>
      </Card>
    </AnimatedPageWrapper>
  );
}
