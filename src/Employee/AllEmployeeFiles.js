import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import {
  Card,
  Typography,
  DatePicker,
  Table,
  Button,
  Space,
  Tag,
  message,
  Spin,
  Modal,
  List,
  Input,
  Select,
} from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  DownloadOutlined,
  FileOutlined,
  MailOutlined,
  EyeOutlined,
} from "@ant-design/icons";

dayjs.extend(isoWeek);

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AllEmployeesWeeklyFiles() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8082";

  /* =============================
     STATE
  ==============================*/
  const [weekStart, setWeekStart] = useState(dayjs().startOf("week"));
  const [appliedWeek, setAppliedWeek] = useState(dayjs().startOf("week"));
  const [weekRangeLabel, setWeekRangeLabel] = useState("");

  const [allFiles, setAllFiles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeFiles, setEmployeeFiles] = useState([]);
  const [activeWeek, setActiveWeek] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  /* EMAIL MODAL */
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState([]);
  const [emailBcc, setEmailBcc] = useState([]);
  const [emailBody, setEmailBody] = useState("");

  const token = sessionStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  /* =============================
     HELPERS
  ==============================*/
  const getWeekKey = (date) => `${date.year()}-W${date.isoWeek()}`;

  const getWeekRangeLabel = (date) => {
    const start = date.startOf("week");
    const end = date.endOf("week");
    return `${start.format("MMM DD, YYYY")} – ${end.format("MMM DD, YYYY")}`;
  };

  /* =============================
     FETCH FILES
  ==============================*/
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/employees/files/all`,
        { headers: authHeader }
      );

      const data = res.data || [];
      setAllFiles(data);

      const uniqueEmployees = Object.values(
        data.reduce((acc, curr) => {
          acc[curr.employeeId] = {
            employeeId: curr.employeeId,
            employeeName: curr.employeeName,
            email: curr.employeeEmail, // must come from API
          };
          return acc;
        }, {})
      );

      setEmployees(uniqueEmployees);
    } catch {
      message.error("Failed to load employee files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    setWeekRangeLabel(getWeekRangeLabel(appliedWeek));
  }, []);

  /* =============================
     APPLY WEEK
  ==============================*/
  const handleShowResults = () => {
    setAppliedWeek(weekStart);
    setWeekRangeLabel(getWeekRangeLabel(weekStart));
  };

  /* =============================
     VIEW DOCS
  ==============================*/
  const handleViewDocs = (employee) => {
    const selectedWeek = getWeekKey(appliedWeek);

    const empFiles = allFiles.filter(
      (f) => f.employeeId === employee.employeeId
    );

    let filesForWeek = empFiles.filter((f) => f.week === selectedWeek);
    let finalWeek = selectedWeek;

    if (filesForWeek.length === 0 && empFiles.length > 0) {
      finalWeek = [...empFiles].sort((a, b) =>
        b.week.localeCompare(a.week)
      )[0].week;

      filesForWeek = empFiles.filter((f) => f.week === finalWeek);
      message.info(`Showing latest available week (${finalWeek})`);
    }

    setSelectedEmployee(employee);
    setEmployeeFiles(filesForWeek);
    setActiveWeek(finalWeek);
    setViewModalOpen(true);
  };

  /* =============================
     VIEW FILE
  ==============================*/
  const handleViewFile = async (file) => {
    try {
      // Use the week from the file object, or fallback to activeWeek
      const week = file.week || activeWeek;
      const encodedFileName = encodeURIComponent(file.fileName);
      
      const res = await axios.get(
        `${apiUrl}/employees/${file.employeeId}/files/week/${week}/${encodedFileName}`,
        { headers: authHeader, responseType: "blob" }
      );

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error("View file error:", err);
      message.error("Failed to open file");
    }
  };

  /* =============================
     DOWNLOAD
  ==============================*/
  const handleDownload = async (file) => {
    try {
      // Use the week from the file object, or fallback to activeWeek
      const week = file.week || activeWeek;
      const encodedFileName = encodeURIComponent(file.fileName);
      
      const res = await axios.get(
        `${apiUrl}/employees/${file.employeeId}/files/week/${week}/${encodedFileName}`,
        { headers: authHeader, responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success("File downloaded successfully");
    } catch (err) {
      console.error("Download error:", err);
      message.error("Download failed");
    }
  };

  /* =============================
     OPEN EMAIL MODAL
  ==============================*/
  const openEmailModal = () => {
    if (selectedEmployees.length === 0) {
      message.warning("Select at least one employee");
      return;
    }

    const emails = selectedEmployees
      .map(e => e.email)
      .filter(Boolean);

    setEmailTo(emails);     // checked employees → TO
    setEmailBcc([]);        // empty initially
    setEmailBody(
      `Hello,\n\nPlease upload your weekly documents for ${getWeekKey(appliedWeek)}.\n\nThank you.`
    );
    setEmailModalOpen(true);
  };

  /* =============================
     SEND EMAIL
  ==============================*/
  const handleSendEmail = async () => {
    if (emailTo.length === 0 || !emailBody) {
      message.warning("At least one To email and Body are required");
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/employees/send-email`,
        {
          to: emailTo,
          bcc: emailBcc,
          body: emailBody,
          week: getWeekKey(appliedWeek),
        },
        { headers: authHeader }
      );

      message.success("Email sent successfully");

      setEmailModalOpen(false);
      setSelectedRowKeys([]);
      setSelectedEmployees([]);
      setEmailTo([]);
      setEmailBcc([]);
      setEmailBody("");
    } catch {
      message.error("Failed to send email");
    }
  };

  /* =============================
     TABLE CONFIG
  ==============================*/
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedEmployees(rows);
    },
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDocs(record)}>
          View Docs
        </Button>
      ),
    },
  ];

  /* =============================
     RENDER
  ==============================*/
  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card bordered={false}>
          <Title level={4} style={{ marginBottom: 20 }}>All Employees – Weekly Uploaded Files</Title>

        <Space wrap style={{ marginBottom: 20 }}>
          <DatePicker
            picker="week"
            value={weekStart}
            onChange={(v) => v && setWeekStart(v.startOf("week"))}
          />
          <Button icon={<LeftOutlined />} onClick={() => setWeekStart(weekStart.subtract(7, "day"))} />
          <Button icon={<RightOutlined />} onClick={() => setWeekStart(weekStart.add(7, "day"))} />
          <Button type="primary" onClick={handleShowResults}>Show Results</Button>

          <Button
            type="primary"
            icon={<MailOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={openEmailModal}
          >
            Send Email
          </Button>

          {weekRangeLabel && <Tag color="blue">{weekRangeLabel}</Tag>}
          <Tag icon={<CalendarOutlined />} color="purple">
            {getWeekKey(appliedWeek)}
          </Tag>
        </Space>

        {loading ? (
          <Spin />
        ) : (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={employees}
            rowKey="employeeId"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* VIEW DOCS MODAL */}
      <Modal
        open={viewModalOpen}
        title={`Files uploaded by ${selectedEmployee?.employeeName} (${activeWeek})`}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={600}
      >
        {employeeFiles.length === 0 ? (
          <Text type="secondary">No files uploaded.</Text>
        ) : (
          <List
            dataSource={employeeFiles}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewFile(file)}
                  >
                    View
                  </Button>,
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </Button>,
                ]}
              >
                <FileOutlined style={{ marginRight: 8 }} />
                {file.fileName}
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* EMAIL MODAL */}
      <Modal
        open={emailModalOpen}
        title="Send Email"
        onCancel={() => setEmailModalOpen(false)}
        onOk={handleSendEmail}
        okText="Send"
        width={600}
      >
        <Text strong>To</Text>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={emailTo}
          onChange={setEmailTo}
        >
          {selectedEmployees.map(emp => (
            <Option key={emp.email} value={emp.email}>
              {emp.employeeName} ({emp.email})
            </Option>
          ))}
        </Select>

        <Text strong style={{ marginTop: 12, display: "block" }}>BCC</Text>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={emailBcc}
          onChange={setEmailBcc}
        >
          {selectedEmployees.map(emp => (
            <Option key={emp.email} value={emp.email}>
              {emp.employeeName} ({emp.email})
            </Option>
          ))}
        </Select>

        <Text strong style={{ marginTop: 12, display: "block" }}>Body</Text>
        <TextArea
          rows={6}
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
        />
      </Modal>
      </div>
    </AnimatedPageWrapper>
  );
}
