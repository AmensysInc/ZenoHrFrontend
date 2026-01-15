import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  Collapse,
  Modal,
  Pagination,
  Row,
  Input,
  message,
} from "antd";
import {
  MailOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import JoditEditor from "jodit-react";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";

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
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editorValues, setEditorValues] = useState({});

  // ------- Email Modal States -------
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const emailEditorRef = useRef(null);

  const editorRefs = useRef({});

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

  // ---------------- EMAIL POPUP --------------------
  const openEmailModal = () => {
    if (!userDetail.email) {
      message.warning("Email not available for this user.");
      return;
    }
    setEmailSubject("");
    setEmailBody("");
    setIsEmailModalVisible(true);
  };

  const handleEmailSend = async () => {
    if (!emailSubject.trim()) {
      message.warning("Please enter subject.");
      return;
    }
    if (!emailBody.trim()) {
      message.warning("Please enter email body.");
      return;
    }

    try {
      setSendingEmail(true);

      // Modify your API call if needed
      await resetPassword({
        email: userDetail.email,
        category: "WITH_HOLD",
        subject: emailSubject,
        body: emailBody,
      });

      message.success("Email sent successfully.");
      setIsEmailModalVisible(false);
    } catch (error) {
      console.error("Email send failed:", error);
      message.error("Failed to send email.");
    } finally {
      setSendingEmail(false);
    }
  };

  // ---------------- TRACKING LOGIC --------------------
  const handleAddTracking = () => {
    navigate(`/tracking/${employeeId}/addtracking`);
  };

  const handleEditTracking = (trackingId) => {
    navigate(`/tracking/${employeeId}/${trackingId}/edittracking`);
  };

  const handleEditorChange = (trackingId, html) => {
    setEditorValues((prev) => ({
      ...prev,
      [trackingId]: html,
    }));
  };

  const handleSaveExcel = async (trackingId) => {
    try {
      const tracking = trackings.find((t) => t.trackingId === trackingId);
      if (!tracking) return;

      const updated = {
        ...tracking,
        excelData: editorValues[trackingId] || "",
      };

      await updateTracking(trackingId, updated);

      setTrackings((prev) =>
        prev.map((t) =>
          t.trackingId === trackingId
            ? { ...t, excelData: editorValues[trackingId] }
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
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card>
          <Title level={4} style={{ marginBottom: 20 }}>
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
          onClick={openEmailModal}
          disabled={!userDetail.email}
        >
          Send Email
        </Button>

        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddTracking}>
          New WithHold
        </Button>
      </Space>

      {Object.keys(grouped).length === 0 ? (
        <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
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
              { title: "Month", dataIndex: "month" },
              { title: "Year", dataIndex: "year" },
              { title: "Project", dataIndex: "projectName" },
              { title: "Actual Hours", dataIndex: "actualHours" },
              { title: "Actual Rate", dataIndex: "actualRate" },
              { title: "Actual Amount", dataIndex: "actualAmt" },
              { title: "Paid Hours", dataIndex: "paidHours" },
              { title: "Paid Rate", dataIndex: "paidRate" },
              { title: "Paid Amount", dataIndex: "paidAmt" },
              {
                title: "Balance",
                dataIndex: "balance",
                render: (val) => (
                  <Text strong type={val >= 0 ? "success" : "danger"}>
                    {val}
                  </Text>
                ),
              },
              { title: "Type", dataIndex: "type" },
              { title: "Status", dataIndex: "status" },
              { title: "Bill Rate", dataIndex: "billRate" },
              {
                title: "Action",
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
                <Card bordered>
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
                      title="Excel Data"
                      style={{ marginTop: 24 }}
                    >
                      <JoditEditor
                        ref={(el) => (editorRefs.current[t.trackingId] = el)}
                        value={editorValues[t.trackingId] || ""}
                        config={{
                          readonly: false,
                          height: 300,
                        }}
                        onBlur={(content) =>
                          handleEditorChange(t.trackingId, content)
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

        </Card>

        {/* Email Modal */}
        <Modal
          title="Send WithHold Email"
          open={isEmailModalVisible}
          onCancel={() => setIsEmailModalVisible(false)}
          onOk={handleEmailSend}
          confirmLoading={sendingEmail}
          okText="Send Email"
          cancelText="Cancel"
          width={700}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>To:</Text>
            <Input value={userDetail.email} disabled />

            <Text strong>Subject:</Text>
            <Input
              placeholder="Enter subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />

            <Text strong>Body:</Text>
            <JoditEditor
              ref={emailEditorRef}
              value={emailBody}
              config={{
                readonly: false,
                height: 250,
              }}
              onBlur={(newContent) => setEmailBody(newContent)}
            />
          </Space>
        </Modal>
      </div>
    </AnimatedPageWrapper>
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
