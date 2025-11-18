import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Typography,
  Button,
  message,
  Space,
  Spin,
  Tooltip,
  Modal,
  Input,
} from "antd";
import { MailOutlined, ReloadOutlined } from "@ant-design/icons";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";

const { Title, Text } = Typography;

export default function Tracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const employeeId = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");

  const [trackings, setTrackings] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Email modal states
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailFields, setEmailFields] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  // ✅ Fetch both employee details and tracking data on mount
  useEffect(() => {
    Promise.all([fetchTrackings(), fetchEmployeeEmail()]);
  }, []);

  const fetchTrackings = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axios.get(`${apiUrl}/employees/${employeeId}/trackings`, config);
      setTrackings(res.data?.content || []);
    } catch (err) {
      console.error("Error fetching trackings:", err);
      message.error("Failed to load tracking details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeEmail = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axios.get(`${apiUrl}/employees/${employeeId}`, config);
      setEmployeeEmail(res.data?.emailID || "");
    } catch (err) {
      console.error("Failed to fetch employee email:", err);
      message.warning("Could not fetch employee email.");
    }
  };

  // 📨 Open Email Modal
  const handleSendEmail = () => {
    if (!employeeEmail) {
      message.warning("Employee email not available.");
      return;
    }

    // Pre-fill template
    setEmailFields({
      to: employeeEmail,
      cc: "",
      subject: "WithHold / Tracking Details Update",
      body: `
        Hi,

        Please find your latest WithHold and tracking details below.

        Regards,<br/>
        HR / Admin Team
      `,
    });

    setEmailModalVisible(true);
  };

  // ✅ Confirm Email Send
  const handleConfirmSend = async () => {
    const { to, cc, subject, body } = emailFields;
    try {
      await axios.post(
        `${apiUrl}/auth/resetPassword`,
        {
          email: to,
          cc,
          subject,
          body,
          category: "WITHHOLD_EMP",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Email sent successfully!");
      setEmailModalVisible(false);
    } catch (err) {
      console.error("Failed to send email:", err);
      message.error("Error sending email.");
    }
  };

  const columns = [
    { title: "S.No", dataIndex: "index", render: (_, __, i) => i + 1 },
    { title: "Month", dataIndex: "month" },
    { title: "Year", dataIndex: "year" },
    { title: "Actual Hours", dataIndex: "actualHours" },
    { title: "Actual Rate", dataIndex: "actualRate" },
    { title: "Actual Amount", dataIndex: "actualAmt" },
    { title: "Paid Hours", dataIndex: "paidHours" },
    { title: "Paid Rate", dataIndex: "paidRate" },
    { title: "Paid Amount", dataIndex: "paidAmt" },
    { title: "Balance", dataIndex: "balance" },
  ];

  return (
    <Card
      bordered={false}
      style={{
        margin: "2rem auto",
        maxWidth: 1200,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        borderRadius: 12,
        background: "#fff",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div className="d-flex justify-content-between align-items-center">
          <Title level={3} style={{ marginBottom: 0 }}>
            Tracking Details
          </Title>
          <Space>
            <Tooltip title="Refresh">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchTrackings}
                type="default"
              />
            </Tooltip>

            <Tooltip title="Send Email">
              <Button
                type="primary"
                icon={<MailOutlined />}
                onClick={handleSendEmail}
                disabled={!employeeEmail}
              >
                Send Email
              </Button>
            </Tooltip>
          </Space>
        </div>

        <Spin spinning={loading} tip="Loading tracking data...">
          <Table
            columns={columns}
            dataSource={trackings}
            rowKey={(record, index) => index}
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Spin>

        <Text type="secondary">
          Logged in as: <b>{employeeEmail || "N/A"}</b>
        </Text>
      </Space>

      {/* 📨 Email Modal */}
      <Modal
        title="Send WithHold / Tracking Email"
        open={emailModalVisible}
        onOk={handleConfirmSend}
        onCancel={() => setEmailModalVisible(false)}
        okText="Send Email"
        width={700}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>To:</Text>
          <Input value={emailFields.to} disabled />

          <Text strong>CC:</Text>
          <Input
            placeholder="Optional"
            value={emailFields.cc}
            onChange={(e) =>
              setEmailFields({ ...emailFields, cc: e.target.value })
            }
          />

          <Text strong>Subject:</Text>
          <Input
            value={emailFields.subject}
            onChange={(e) =>
              setEmailFields({ ...emailFields, subject: e.target.value })
            }
          />

          <Text strong>Body:</Text>
          <FroalaEditor
            model={emailFields.body}
            onModelChange={(html) =>
              setEmailFields({ ...emailFields, body: html })
            }
          />
        </Space>
      </Modal>
    </Card>
  );
}
