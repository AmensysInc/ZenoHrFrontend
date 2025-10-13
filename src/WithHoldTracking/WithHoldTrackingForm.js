import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Modal,
  Typography,
  Space,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";

import {
  createTracking,
  fetchEmployeeDetails,
  fetchProjectNames,
  fetchTrackingDetails,
  updateTracking,
} from "../SharedComponents/services/WithHoldService";

const { Title } = Typography;
const { Option } = Select;

export default function WithHoldTrackingForm({ mode }) {
  const navigate = useNavigate();
  const { trackingId, employeeId } = useParams();

  const [form] = Form.useForm();
  const [editorHtml, setEditorHtml] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");

  const monthOptions = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const typeOptions = ["revenue", "payment", "expense", "tax", "deductions"];
  const statusOptions = ["pending", "received", "paid"];
  const yearOptions = Array.from({ length: 110 }, (_, i) => 1990 + i);

  const isEditMode = mode === "edit";

  // ✅ Watch values for dynamic calculation
  const actualHours = Form.useWatch("actualHours", form) ?? 0;
  const actualRate  = Form.useWatch("actualRate",  form) ?? 0;
  const paidHours   = Form.useWatch("paidHours",   form) ?? 0;
  const paidRate    = Form.useWatch("paidRate",    form) ?? 0;

  const actualAmt = Number(((actualHours || 0) * (actualRate || 0)).toFixed(2));
  const paidAmt   = Number(((paidHours   || 0) * (paidRate   || 0)).toFixed(2));
  const balance   = Number((actualAmt - paidAmt).toFixed(2));

  // ✅ Fetch employee and tracking data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empResponse = await fetchEmployeeDetails(employeeId);
        if (empResponse) setEmployeeDetails(empResponse);

        const projResponse = await fetchProjectNames(employeeId);
        if (projResponse?.length > 0) {
          const list = projResponse.map(
            (p) => `${p.subVendorOne || ""} / ${p.subVendorTwo || ""}`
          );
          setProjectNames(list);
        }

        if (isEditMode) {
          const trackingResponse = await fetchTrackingDetails(trackingId);
          if (trackingResponse) {
            form.setFieldsValue(trackingResponse);
            setSelectedProjectName(trackingResponse.projectName || "");
            setEditorHtml(trackingResponse.excelData || "");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load form data");
      }
    };
    fetchData();
  }, [employeeId, trackingId, mode, form, isEditMode]);

  // ✅ Handle form submit
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        projectName: selectedProjectName,
        excelData: editorHtml,
        actualAmt,
        paidAmt,
        balance,
      };

      const success = isEditMode
        ? await updateTracking(trackingId, payload)
        : await createTracking(employeeId, payload);

      if (success) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Something went wrong while saving data");
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate(`/tracking/${employeeId}`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate(`/tracking/${employeeId}`);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
        {isEditMode ? "Edit WithHold Details" : "Add WithHold Details"}
      </Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
      >
{/*         
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name">
              <Input value={employeeDetails.firstName || ""} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name">
              <Input value={employeeDetails.lastName || ""} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="month" label="Month" rules={[{ required: true }]}>
              <Select placeholder="Select Month">
                {monthOptions.map((m) => (
                  <Option key={m} value={m}>
                    {m}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <Select placeholder="Select Year">
                {yearOptions.map((y) => (
                  <Option key={y} value={y}>
                    {y}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Project Name" required>
              <Select
                placeholder="Select Project"
                value={selectedProjectName}
                onChange={setSelectedProjectName}
              >
                {projectNames.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                {typeOptions.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="actualHours" label="Actual Hours">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="actualRate" label="Actual Rate">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="paidHours" label="Paid Hours">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="paidRate" label="Paid Rate">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Actual Amount">
              <InputNumber disabled value={actualAmt} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Paid Amount">
              <InputNumber disabled value={paidAmt} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Balance">
              <InputNumber disabled value={balance} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Select Status">
                {statusOptions.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="billRate" label="Bill Rate">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row> */}

        {/* Froala Editor */}
        <Form.Item label="Excel Data">
          <FroalaEditor model={editorHtml} onModelChange={setEditorHtml} />
        </Form.Item>

        {/* Buttons */}
        <Form.Item>
          <Space style={{ float: "right" }}>
            <Button onClick={() => navigate(`/tracking/${employeeId}`)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Success Modal */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <p>WithHold {isEditMode ? "Updated" : "Added"} successfully</p>
      </Modal>
    </div>
  );
}
