import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import {
  Card,
  Typography,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Tag,
  Space,
  Upload,
  message,
  Spin,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CloudUploadOutlined,
  SaveOutlined,
  FileOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

dayjs.extend(require("dayjs/plugin/weekday"));
dayjs.extend(require("dayjs/plugin/weekOfYear"));

const { Title, Text } = Typography;

export default function WeeklyTimesheet() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8082";
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week")
  );
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [times, setTimes] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------- Data Fetch ----------
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    if (selectedProjectId) {
      fetchTimesheetData();
      fetchUploadedFiles();
    }
  }, [selectedProjectId, currentWeekStart]);

  const employeeId = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiUrl}/employees/${employeeId}/projects`,
        {
          params: { page: 0, size: 50 },
          headers: authHeader,
        }
      );
      setProjects(res.data.content || []);
    } catch (err) {
      message.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () =>
    Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, "day"));

  const fetchTimesheetData = async () => {
    try {
      setLoading(true);
      const weekDates = getWeekDays();
      const uniqueMonthYear = [
        ...new Set(weekDates.map((d) => `${d.month() + 1}-${d.year()}`)),
      ];
      const tempTimes = {};
      for (const pair of uniqueMonthYear) {
        const [month, year] = pair.split("-").map(Number);
        const res = await axios.post(
          `${apiUrl}/timeSheets/getAllTimeSheets`,
          {
            employeeId,
            projectId: selectedProjectId,
            month,
            year,
          },
          { headers: { ...authHeader, "Content-Type": "application/json" } }
        );
        (res.data || []).forEach((entry) => {
          const dateStr = dayjs(entry.date).format("YYYY-MM-DD");
          tempTimes[dateStr] = {
            regularHours: entry.regularHours,
            overTimeHours: entry.overTimeHours,
            status: entry.status,
          };
        });
      }
      setTimes(tempTimes);
    } catch (err) {
      message.error("Error fetching timesheet data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const monthName = dayjs(currentWeekStart).format("MMMM");
      const res = await axios.get(
        `${apiUrl}/timeSheets/getUploadedFiles/${employeeId}/${selectedProjectId}/${currentWeekStart.year()}/${monthName}`,
        { headers: authHeader }
      );
      setUploadedFiles(res.data);
    } catch {
      setUploadedFiles([]);
    }
  };

  // ---------- Time Input ----------
  const handleTimeChange = (date, field, value) => {
    setTimes((prev) => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [field]: value },
    }));
  };

  const isApproved = (date) => times[date]?.status === "APPROVED";

  const getTotalHours = (field) => {
    return getWeekDays().reduce(
      (sum, d) => sum + Number(times[d.format("YYYY-MM-DD")]?.[field] || 0),
      0
    );
  };

  // ---------- File Upload ----------
  const handleFileUpload = ({ fileList }) =>
    setSelectedFiles(fileList.map((f) => f.originFileObj));
  const handleDownload = async (fileName) => {
    try {
      const monthName = dayjs(currentWeekStart).format("MMMM");
      const res = await axios.get(
        `${apiUrl}/timeSheets/downloadFile/${employeeId}/${selectedProjectId}/${currentWeekStart.year()}/${monthName}/${fileName}`,
        { headers: authHeader, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error("Download failed.");
    }
  };
  const handleDelete = async (fileName) => {
    try {
      await axios.delete(
        `${apiUrl}/timeSheets/deleteUploadedFile/${employeeId}/${fileName}`,
        {
          headers: authHeader,
        }
      );
      message.success("File deleted.");
      fetchUploadedFiles();
    } catch {
      message.error("Failed to delete file.");
    }
  };

  // ---------- Save ----------
  const handleSave = async () => {
    if (!selectedProjectId)
      return message.warning("Please select a project first.");
    try {
      setLoading(true);
      const entries = getWeekDays()
        .filter((d) => !isApproved(d.format("YYYY-MM-DD")))
        .map((d) => {
          const dateStr = d.format("YYYY-MM-DD");
          const t = times[dateStr] || {};
          return {
            employeeId,
            projectId: selectedProjectId,
            date: d.valueOf(),
            regularHours: Number(t.regularHours || 0),
            overTimeHours: Number(t.overTimeHours || 0),
            month: d.month() + 1,
            year: d.year(),
          };
        });
      if (entries.length)
        await axios.post(`${apiUrl}/timeSheets/createTimeSheet`, entries, {
          headers: { ...authHeader, "Content-Type": "application/json" },
        });

      if (selectedFiles.length > 0) {
        const fd = new FormData();
        fd.append("employeeID", employeeId);
        selectedFiles.forEach((f) => fd.append("documents", f));
        const monthName = dayjs(currentWeekStart).format("MMMM");
        await axios.post(
          `${apiUrl}/timeSheets/uploadfiles/${employeeId}/${selectedProjectId}/${currentWeekStart.year()}/${monthName}`,
          fd,
          { headers: { ...authHeader, "Content-Type": "multipart/form-data" } }
        );
        setSelectedFiles([]);
        fetchUploadedFiles();
      }
      message.success("Timesheet saved successfully!");
    } catch {
      message.error("Failed to save timesheet.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Columns ----------
  const columns = getWeekDays().map((d) => {
    const dateStr = d.format("YYYY-MM-DD");
    const approved = isApproved(dateStr);
    return {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>
            <CalendarOutlined /> {d.format("ddd, MMM D")}
          </div>
          {approved && <Tag color="green">Approved</Tag>}
        </div>
      ),
      dataIndex: dateStr,
      align: "center",
      render: () => (
        <Space direction="vertical">
          <InputNumber
            min={0}
            max={24}
            value={times[dateStr]?.regularHours || 0}
            onChange={(val) => handleTimeChange(dateStr, "regularHours", val)}
            disabled={approved}
            placeholder="Reg"
          />
          <InputNumber
            min={0}
            max={24}
            value={times[dateStr]?.overTimeHours || 0}
            onChange={(val) => handleTimeChange(dateStr, "overTimeHours", val)}
            disabled={approved}
            placeholder="OT"
          />
        </Space>
      ),
    };
  });

  const dataSource = [
    { key: "1" }, // empty row since we’re not mapping per user
  ];

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card bordered={false}>
          <Title level={4} style={{ marginBottom: 20 }}>
            Weekly Timesheet
          </Title>

        <Space wrap size="large" style={{ marginBottom: 25 }}>
          <Select
            placeholder="Select Project"
            style={{ width: 260 }}
            value={selectedProjectId}
            onChange={setSelectedProjectId}
            options={projects.map((p) => ({
              value: p.projectId,
              label: `${p.subVendorOne || ""} / ${p.subVendorTwo || ""}`,
            }))}
          />
          <DatePicker
            picker="week"
            value={currentWeekStart}
            onChange={(val) => setCurrentWeekStart(val.startOf("week"))}
            format={(value) => {
              if (!value) return "";
              const start = value.startOf("week").format("MMM D");
              const end = value.endOf("week").format("MMM D, YYYY");
              return `${start} - ${end}`;
            }}
          />
          <Button
            icon={<LeftOutlined />}
            onClick={() =>
              setCurrentWeekStart(currentWeekStart.subtract(7, "day"))
            }
          >
            Prev
          </Button>
          <Button
            icon={<RightOutlined />}
            onClick={() => setCurrentWeekStart(currentWeekStart.add(7, "day"))}
          >
            Next
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Save
          </Button>
        </Space>
        {loading ? (
          <div style={{ textAlign: "center", margin: "50px 0" }}>
            <Spin size="large" tip="Loading timesheet..." />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              bordered
              style={{ marginBottom: 30 }}
              scroll={{ x: true }}
            />

            <Space size="large" style={{ marginBottom: 25 }}>
              <Tag color="blue">
                Total Hours: {getTotalHours("regularHours")}
              </Tag>
              <Tag color="purple">
                Overtime: {getTotalHours("overTimeHours")}
              </Tag>
            </Space>
            <Card
              type="inner"
              title={<Text strong>Upload Files</Text>}
              extra={<CloudUploadOutlined />}
              style={{ borderRadius: 10 }}
            >
              <Upload
                multiple
                showUploadList={{ showRemoveIcon: true }}
                beforeUpload={() => false}
                onChange={handleFileUpload}
              >
                <Button icon={<FileOutlined />}>Select Files</Button>
              </Upload>

              {uploadedFiles.length > 0 && (
                <ul style={{ marginTop: 20, listStyle: "none", padding: 0 }}>
                  {uploadedFiles.map((file, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #f0f0f0",
                        padding: "8px 0",
                      }}
                    >
                      <span>{file.fileName}</span>
                      <Space>
                        <DownloadOutlined
                          style={{ color: "#1677ff", cursor: "pointer" }}
                          onClick={() => handleDownload(file.fileName)}
                        />
                        <DeleteOutlined
                          style={{ color: "#ff4d4f", cursor: "pointer" }}
                          onClick={() => handleDelete(file.fileName)}
                        />
                      </Space>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
