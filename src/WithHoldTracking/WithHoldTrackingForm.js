import React, { useState, useEffect, useRef } from "react";
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

// ⭐ Jodit React Editor (replaces CKEditor)
import JoditEditor from "jodit-react";

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

  const isEditMode = mode === "edit";

  // Jodit Editor ref
  const editor = useRef(null);

  // Auto calc
  const actualHours = Form.useWatch("actualHours", form) ?? 0;
  const actualRate = Form.useWatch("actualRate", form) ?? 0;
  const paidHours = Form.useWatch("paidHours", form) ?? 0;
  const paidRate = Form.useWatch("paidRate", form) ?? 0;

  const actualAmt = Number((actualHours * actualRate).toFixed(2));
  const paidAmt = Number((paidHours * paidRate).toFixed(2));
  const balance = Number((actualAmt - paidAmt).toFixed(2));

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const emp = await fetchEmployeeDetails(employeeId);
        if (emp) setEmployeeDetails(emp);

        const proj = await fetchProjectNames(employeeId);
        if (proj?.length > 0) {
          setProjectNames(
            proj.map((p) => `${p.subVendorOne || ""} / ${p.subVendorTwo || ""}`)
          );
        }

        if (isEditMode) {
          const tracking = await fetchTrackingDetails(trackingId);

          if (tracking) {
            form.setFieldsValue(tracking);
            setSelectedProjectName(tracking.projectName || "");
            setEditorHtml(tracking.excelData || "");
          }
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to load data");
      }
    };

    loadData();
  }, [employeeId, trackingId, isEditMode, form]);

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

      if (success) setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      message.error("Failed to save data");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
        {isEditMode ? "Edit WithHold Details" : "Add WithHold Details"}
      </Title>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* ⭐ JODIT EDITOR */}
        <Form.Item label="Excel Data">
          <JoditEditor
            ref={editor}
            value={editorHtml}
            config={{
              readonly: false,
              height: 350,
              allowResizeX: false,
              allowResizeY: false,
              toolbarSticky: false,
              spellcheck: false,
            }}
            onBlur={(newContent) => setEditorHtml(newContent)}
          />
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

      <Modal
        centered
        open={isModalOpen}
        onOk={() => navigate(`/tracking/${employeeId}`)}
      >
        <p>WithHold {isEditMode ? "Updated" : "Added"} successfully</p>
      </Modal>
    </div>
  );
}
