import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Button,
  message,
  Space,
  Upload,
  Tooltip,
  Spin,
  Typography,
  Tag,
  Popconfirm,
} from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { get, post } from "../SharedComponents/httpClient ";
import _ from "lodash";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";

const { Option } = Select;
const { Title, Text } = Typography;

export default function TimeSheets() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeSheets, setTimeSheets] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [originalTimeSheets, setOriginalTimeSheets] = useState([]);

  const role = (sessionStorage.getItem("role") || "").replace(/"/g, "");
  const employeeId = sessionStorage.getItem("id");
  const defaultCompanyId = Number(sessionStorage.getItem("defaultCompanyId")) || null;

  // 🗓 Month and year options
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const yearOptions = Array.from({ length: 6 }, (_, i) => 2020 + i);

  // 🕒 Current date reference
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // ==========================
  // 🎯 INITIAL LOAD
  // ==========================
  useEffect(() => {
    if (role === "ADMIN" || role === "SADMIN" || role === "HR_MANAGER") {
      get("/employees")
        .then((res) => {
          const filtered = res.data?.content?.filter(
            (emp) => emp.company?.companyId === defaultCompanyId
          );
          setEmployees(filtered || []);
        })
        .catch(() => message.error("Failed to load employees"));
    } else {
      setSelectedEmployee(employeeId);
    }
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      get(`employees/${selectedEmployee}/projects`)
        .then((res) => setProjects(res.data?.content || []))
        .catch(() => message.error("Failed to fetch projects"));
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (selectedEmployee && selectedProject && selectedMonth && selectedYear) {
      loadTimeSheets();
      loadUploadedFiles();
    }
  }, [selectedEmployee, selectedProject, selectedMonth, selectedYear]);

  // ==========================
  // 📦 LOADERS
  // ==========================
  const loadTimeSheets = async () => {
    setLoading(true);
    try {
      const requestBody = {
        month: parseInt(selectedMonth, 10),
        year: selectedYear,
        employeeId: selectedEmployee,
        projectId: selectedProject.projectId,
      };
      const res = await post("/timeSheets/getAllTimeSheets", requestBody);
      const data = res.data || [];

      const filled = getFilledMonthData(data);
      setTimeSheets(filled);
      setOriginalTimeSheets(_.cloneDeep(filled));
    } catch (err) {
      message.error("Error loading timesheets");
    } finally {
      setLoading(false);
    }
  };

  const loadUploadedFiles = async () => {
    try {
      const monthName = monthOptions[parseInt(selectedMonth, 10) - 1];
      const res = await get(
        `/timeSheets/getUploadedFiles/${selectedEmployee}/${selectedProject.projectId}/${selectedYear}/${monthName}`
      );
      setUploadedFiles(res.data || []);
    } catch (err) {
      message.error("Failed to fetch uploaded files");
    }
  };

  // ==========================
  // 📅 HELPERS
  // ==========================
  const getDatesInMonth = (month, year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const dates = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const getAbbrevDay = (date) =>
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];

  const getFilledMonthData = (apiData) => {
    const dates = getDatesInMonth(selectedMonth, selectedYear);
    const dataMap = new Map(apiData.map((d) => [new Date(d.date).getTime(), d]));
    return dates.map((d) => ({
      ...dataMap.get(d.getTime()),
      date: d,
      day: getAbbrevDay(d),
      regularHours: dataMap.get(d.getTime())?.regularHours || 0,
      overTimeHours: dataMap.get(d.getTime())?.overTimeHours || 0,
      status: dataMap.get(d.getTime())?.status || null,
      __dirty: false,
    }));
  };

  // ==========================
  // ⚙️ EDIT HANDLER
  // ==========================
  const handleCellEdit = (field, newValue, recordDate) => {
    const isCurrentMonthYear =
      parseInt(selectedMonth, 10) === currentMonth &&
      parseInt(selectedYear, 10) === currentYear;

    if (!isCurrentMonthYear) return; // prevent editing older months
    setTimeSheets((prev) =>
      prev.map((t) =>
        t.date.getTime() === recordDate.getTime()
          ? { ...t, [field]: Number(newValue), __dirty: true }
          : t
      )
    );
  };

  // ==========================
  // 🧮 TABLE CONFIG
  // ==========================
  const isCurrentMonthYear =
    parseInt(selectedMonth, 10) === currentMonth &&
    parseInt(selectedYear, 10) === currentYear;

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (d) => d.toLocaleDateString(),
    },
    {
      title: "Day",
      dataIndex: "day",
      render: (day) => (
        <Text style={{ color: day === "Sun" || day === "Sat" ? "red" : "#000" }}>
          {day}
        </Text>
      ),
    },
    {
      title: "Regular Hours",
      dataIndex: "regularHours",
      render: (value, record) =>
        isCurrentMonthYear ? (
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) =>
              handleCellEdit("regularHours", e.target.value, record.date)
            }
            style={{ width: "80px", textAlign: "center" }}
          />
        ) : (
          <Text>{value}</Text>
        ),
    },
    {
      title: "Overtime Hours",
      dataIndex: "overTimeHours",
      render: (value, record) =>
        isCurrentMonthYear ? (
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) =>
              handleCellEdit("overTimeHours", e.target.value, record.date)
            }
            style={{ width: "80px", textAlign: "center" }}
          />
        ) : (
          <Text>{value}</Text>
        ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (status) => {
    //     if (status === "APPROVED") return <Tag color="green">APPROVED</Tag>;
    //     if (status === "REJECTED") return <Tag color="red">REJECTED</Tag>;
    //     return <Tag color="orange">PENDING</Tag>;
    //   },
    // },
    ...(role === "ADMIN"
      ? [
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Tooltip title="Approve">
                  <Button
                    icon={<CheckOutlined />}
                    size="small"
                    disabled={!isCurrentMonthYear}
                    onClick={() => handleStatusChange(record, "APPROVED")}
                  />
                </Tooltip>
                <Tooltip title="Reject">
                  <Button
                    icon={<StopOutlined />}
                    danger
                    size="small"
                    disabled={!isCurrentMonthYear}
                    onClick={() => handleStatusChange(record, "REJECTED")}
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]
      : []),
  ];

  // ==========================
  // ⚙️ ACTION HANDLERS
  // ==========================
  const handleStatusChange = async (timeSheet, newStatus) => {
    const updated = { ...timeSheet, status: newStatus };
    const payload = [
      {
        month: selectedMonth,
        year: selectedYear,
        employeeId: selectedEmployee,
        projectId: selectedProject.projectId,
        sheetId: timeSheet.sheetId,
        regularHours: timeSheet.regularHours,
        overTimeHours: timeSheet.overTimeHours,
        date: timeSheet.date.toISOString(),
        status: newStatus,
      },
    ];

    try {
      await post("/timeSheets/createTimeSheet", payload);
      setTimeSheets((prev) =>
        prev.map((t) => (t.date === timeSheet.date ? updated : t))
      );
      message.success(`Timesheet ${newStatus.toLowerCase()}`);
    } catch {
      message.error("Error updating status");
    }
  };

  const handleFileUpload = ({ fileList }) => setSelectedFiles(fileList);

const handleSubmit = async () => {
  if (!isCurrentMonthYear) {
    message.warning("You can only submit for the current month and year");
    return;
  }

  const dirtyData = timeSheets.filter((t) => t.__dirty);
  const uploadMonth = monthOptions[parseInt(selectedMonth, 10) - 1];

  try {
    // ✅ Attach required identifiers to each entry
    const payload = dirtyData.map((t) => ({
      ...t,
      employeeId: selectedEmployee,
      projectId: selectedProject.projectId,
      month: selectedMonth,
      year: selectedYear,
      date: t.date.toISOString(), // ensure ISO string
      notes: t.notes || null,
    }));

    // Save timesheets
    if (payload.length > 0) {
      await post("/timeSheets/createTimeSheet", payload);
      message.success("✅ Timesheets saved successfully!");
    }

    // Upload files (if any)
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((f) => formData.append("documents", f.originFileObj));

      await post(
        `/timeSheets/uploadfiles/${selectedEmployee}/${selectedProject.projectId}/${selectedYear}/${uploadMonth}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      message.success("📂 Files uploaded successfully!");
      loadUploadedFiles();
    }

    // Reset UI state
    setSelectedFiles([]);
    setTimeSheets((prev) => prev.map((t) => ({ ...t, __dirty: false })));
  } catch (err) {
    console.error(err);
    message.error("❌ Error submitting data");
  }
};


  const handleApproveAll = async () => {
    if (!isCurrentMonthYear) {
      message.warning("You can only approve for the current month and year");
      return;
    }

    const toApprove = timeSheets.filter(
      (t) => t.status !== "APPROVED" && (t.regularHours > 0 || t.overTimeHours > 0)
    );

    if (toApprove.length === 0) return message.info("No pending timesheets");

    try {
      const payload = toApprove.map((t) => ({
        ...t,
        status: "APPROVED",
        date: t.date.toISOString(),
      }));
      await post("/timeSheets/createTimeSheet", payload);
      setTimeSheets((prev) =>
        prev.map((t) =>
          toApprove.some((x) => x.date === t.date)
            ? { ...t, status: "APPROVED" }
            : t
        )
      );
      message.success("All timesheets approved!");
    } catch {
      message.error("Error approving all");
    }
  };

  const handleCancel = () => {
    setTimeSheets(_.cloneDeep(originalTimeSheets));
    setSelectedFiles([]);
    message.info("Changes reverted");
  };

  const handleDelete = async (fileName) => {
    if (!fileName || !selectedEmployee) return;
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(
        `${apiUrl}/timeSheets/deleteUploadedFile/${selectedEmployee}/${fileName}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete file");
      message.success("File deleted successfully");
      setUploadedFiles((prev) => prev.filter((f) => f.fileName !== fileName));
    } catch {
      message.error("Error deleting file");
    }
  };

  // ==========================
  // 🎨 RENDER
  // ==========================
  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card
          bordered={false}
          style={{ maxWidth: 1200, margin: "0 auto" }}
        >
          <Title level={4} style={{ marginBottom: 20 }}>Time Sheets</Title>
      <Space style={{ marginBottom: 20 }} wrap>
        {(role === "ADMIN" || role === "SADMIN" || role === "HR_MANAGER") && (
          <Select
            placeholder="Select Employee"
            style={{ width: 180 }}
            onChange={(val) => setSelectedEmployee(val)}
          >
            {employees.map((e) => (
              <Option key={e.employeeID} value={e.employeeID}>
                {e.firstName} {e.lastName}
              </Option>
            ))}
          </Select>
        )}
        <Select
          placeholder="Select Project"
          style={{ width: 180 }}
          value={selectedProject?.projectId}
          onChange={(val) =>
            setSelectedProject(projects.find((p) => p.projectId === val))
          }
        >
          {projects.map((p) => (
            <Option key={p.projectId} value={p.projectId}>
              {p.subVendorOne}/{p.subVendorTwo}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Month"
          style={{ width: 150 }}
          onChange={(val) => setSelectedMonth(val)}
        >
          {monthOptions.map((m, i) => (
            <Option key={i + 1} value={(i + 1).toString()}>
              {m}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Year"
          style={{ width: 120 }}
          onChange={(val) => setSelectedYear(val)}
        >
          {yearOptions.map((y) => (
            <Option key={y} value={y.toString()}>
              {y}
            </Option>
          ))}
        </Select>
      </Space>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={timeSheets}
          rowKey={(r) => r.date.getTime()}
          pagination={false}
          bordered
          size="middle"
        />
      </Spin>

      <div style={{ marginTop: 20 }}>
        <Upload
          multiple
          fileList={selectedFiles}
          beforeUpload={() => false}
          onChange={handleFileUpload}
          disabled={!isCurrentMonthYear || !selectedProject || !selectedMonth || !selectedYear}
        >
          <Button icon={<UploadOutlined />}>Select Files</Button>
        </Upload>

        {uploadedFiles.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <Title level={5}>Uploaded Files</Title>
            {uploadedFiles.map((file, i) => (
              <Space
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: 8,
                }}
              >
                <Text>{file.fileName}</Text>
                <Space>
                  <Tooltip title="Download">
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(file.fileUrl, "_blank")}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Delete this file?"
                    onConfirm={() => handleDelete(file.fileName)}
                  >
                    <Button icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Space>
              </Space>
            ))}
          </div>
        )}
      </div>

      <Space style={{ marginTop: 30 }}>
        {(role === "ADMIN" || role === "SADMIN" || role === "HR_MANAGER") && (
          <Button
            type="primary"
            icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
            onClick={handleApproveAll}
            disabled={!isCurrentMonthYear || timeSheets.length === 0}
          >
            Approve All
          </Button>
        )}
        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={handleSubmit}
          disabled={
            !isCurrentMonthYear ||
            (!timeSheets.some((t) => t.__dirty) && selectedFiles.length === 0)
          }
        >
          Submit
        </Button>
        <Button
          icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Space>
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
