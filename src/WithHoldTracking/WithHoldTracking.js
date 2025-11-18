import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  message,
  Collapse,
  Modal,
  Pagination,
  Row,
  Col,
  Input,
} from "antd";
import {
  MailOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

// --- ReactQuill imports ---
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// ---------------------------

import {
  getEmployeeDetails,
  getTrackingForEmployee,
  resetPassword,
  updateTracking,
} from "../SharedComponents/services/WithHoldService";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function WithHoldTracking() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [trackings, setTrackings] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editorValues, setEditorValues] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Email modal state
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailFields, setEmailFields] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    loadTrackings();
  }, [currentPage, pageSize]);

  const loadTrackings = async () => {
    try {
      setLoading(true);
      const trackingResponse = await getTrackingForEmployee(
        employeeId,
        currentPage,
        pageSize
      );
      const detailsData = await getEmployeeDetails(employeeId);

      setTrackings(trackingResponse.content || []);
      setTotalPages(trackingResponse.totalPages || 1);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
        email: detailsData.emailID,
      });

      const initValues = {};
      (trackingResponse.content || []).forEach((t) => {
        initValues[t.trackingId] = t.excelData || "";
      });
      setEditorValues(initValues);
    } catch (error) {
      console.error("Error loading trackings:", error);
      message.error("Failed to load tracking data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = () => {
    if (!userDetail.email) {
      message.warning("Email not available for this user.");
      return;
    }

    setEmailFields({
      to: userDetail.email,
      cc: "",
      subject: `WithHold Details for ${userDetail.first} ${userDetail.last}`,
      body: `
        Hi ${userDetail.first},<br/><br/>
        Please find the latest WithHold details attached or updated.<br/><br/>
        Regards,<br/>
        HR / Admin Team
      `,
    });

    setEmailModalVisible(true);
  };

  const handleConfirmSend = async () => {
    try {
      const { to, cc, subject, body } = emailFields;

      await resetPassword({
        email: to,
        cc,
        subject,
        body,
        category: "ADMIN",
      });

      message.success("Email sent successfully.");
      setEmailModalVisible(false);
    } catch (error) {
      console.error("Email send failed:", error);
      message.error("Failed to send email.");
    }
  };

  const handleAddTracking = () => {
    navigate(`/tracking/${employeeId}/addtracking`);
  };

  const handleEditTracking = (trackingId) => {
    navigate(`/tracking/${employeeId}/${trackingId}/edittracking`);
  };

  const handleEditorChange = (trackingId, html) => {
    setEditorValues((prev) => ({ ...prev, [trackingId]: html }));
  };

  const handleSaveExcel = async (trackingId) => {
    try {
      const tracking = trackings.find((t) => t.trackingId === trackingId);
      if (!tracking) return;

      const updated = { ...tracking, excelData: editorValues[trackingId] || "" };
      await updateTracking(trackingId, updated);

      setTrackings((prev) =>
        prev.map((t) =>
          t.trackingId === trackingId
            ? { ...t, excelData: editorValues[trackingId] || "" }
            : t
        )
      );
      message.success("Excel data saved successfully.");
    } catch (error) {
      console.error("Error saving excel data:", error);
      message.error("Failed to save excel data.");
    }
  };

  const grouped = groupByProject(trackings);

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: "2rem" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        {userDetail.first} {userDetail.last} — WithHold Details
      </Title>

      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Button
          type="primary"
          icon={<MailOutlined />}
          onClick={handleSendEmail}
          disabled={!userDetail.email}
        >
          Send Email
        </Button>
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddTracking}>
          New WithHold
        </Button>
      </Space>

      {Object.keys(grouped).length === 0 ? (
        <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
          No tracking data found.
        </Text>
      ) : (
        <Collapse accordion bordered={false}>
          {Object.entries(grouped).map(([projectName, projectTrackings]) => {
            const totalBalance = projectTrackings.reduce(
              (sum, t) => sum + (t.balance || 0),
              0
            );

            const columns = [
              { title: "Month", dataIndex: "month", key: "month" },
              { title: "Year", dataIndex: "year", key: "year" },
              { title: "Project", dataIndex: "projectName", key: "projectName" },
              { title: "Actual Hours", dataIndex: "actualHours", key: "actualHours" },
              { title: "Actual Rate", dataIndex: "actualRate", key: "actualRate" },
              { title: "Actual Amount", dataIndex: "actualAmt", key: "actualAmt" },
              { title: "Paid Hours", dataIndex: "paidHours", key: "paidHours" },
              { title: "Paid Rate", dataIndex: "paidRate", key: "paidRate" },
              { title: "Paid Amount", dataIndex: "paidAmt", key: "paidAmt" },
              {
                title: "Balance",
                dataIndex: "balance",
                key: "balance",
                render: (val) => (
                  <Text strong type={val >= 0 ? "success" : "danger"}>
                    {val}
                  </Text>
                ),
              },
              { title: "Type", dataIndex: "type", key: "type" },
              { title: "Status", dataIndex: "status", key: "status" },
              { title: "Bill Rate", dataIndex: "billRate", key: "billRate" },
              {
                title: "Action",
                key: "action",
                render: (_, record) => (
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditTracking(record.trackingId)}
                  >
                    Edit
                  </Button>
                ),
              },
            ];

            return (
              <Panel
                header={
                  <Space>
                    <Text strong>Project:</Text>
                    <Text>{projectName}</Text>
                    <Text type="secondary">(Total Balance: {totalBalance})</Text>
                  </Space>
                }
                key={projectName}
              >
                <Card bordered={true}>
                  <Table
                    columns={columns}
                    dataSource={projectTrackings}
                    rowKey="trackingId"
                    pagination={false}
                    size="small"
                    loading={loading}
                  />

                  {projectTrackings.map((t) => (
                    <Card
                      key={t.trackingId}
                      type="inner"
                      title={`Excel Data — ${t.month} ${t.year}`}
                      style={{ marginTop: 24 }}
                    >
                      <ReactQuill
                        theme="snow"
                        value={editorValues[t.trackingId] || ""}
                        onChange={(html) =>
                          handleEditorChange(t.trackingId, html)
                        }
                      />

                      <Button
                        icon={<SaveOutlined />}
                        type="primary"
                        size="small"
                        style={{ marginTop: 12 }}
                        onClick={() => handleSaveExcel(t.trackingId)}
                      >
                        Save Excel Data
                      </Button>
                    </Card>
                  ))}

                  <Row justify="end" style={{ marginTop: 24 }}>
                    <Pagination
                      current={currentPage + 1}
                      pageSize={pageSize}
                      total={totalPages * pageSize}
                      onChange={(page) => setCurrentPage(page - 1)}
                      showSizeChanger={false}
                    />
                  </Row>
                </Card>
              </Panel>
            );
          })}
        </Collapse>
      )}

      {/* Email Modal */}
      <Modal
        title="Send WithHold Email"
        open={emailModalVisible}
        onOk={handleConfirmSend}
        onCancel={() => setEmailModalVisible(false)}
        okText="Send"
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
          <ReactQuill
            theme="snow"
            value={emailFields.body}
            onChange={(html) =>
              setEmailFields({ ...emailFields, body: html })
            }
          />
        </Space>
      </Modal>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Text>Operation successful</Text>
      </Modal>
    </div>
  );
}

function groupByProject(trackings) {
  if (!Array.isArray(trackings)) return {};
  return trackings.reduce((acc, t) => {
    const key = t.projectName || "Unknown Project";
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
}
