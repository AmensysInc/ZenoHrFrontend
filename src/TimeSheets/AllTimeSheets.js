import React, { useEffect, useState } from "react";
import { get, post } from "../SharedComponents/httpClient ";
import { Table, Select, Checkbox, Button, Modal, Input, Tag } from "antd";
import { FaCheck, FaTimes } from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import { IoNotifications } from "react-icons/io5";

const { Option } = Select;
const { TextArea } = Input;

const AllTimeSheets = () => {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [timeSheets, setTimeSheets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [docsModalVisible, setDocsModalVisible] = useState(false);

  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteEmployeeId, setNoteEmployeeId] = useState(null);
  const [noteProjectId, setNoteProjectId] = useState(null);

  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [reminderEmployee, setReminderEmployee] = useState(null);
  const [reminderText, setReminderText] = useState("");

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await get("/companies?page=0&size=100");
        if (response.data && response.data.content) {
          setCompanies(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch employees and projects
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        const response = await get("/employees?page=0&size=1000");
        if (!response.data.content) {
          setLoading(false);
          return;
        }

        const employeesWithProjects = await Promise.all(
          response.data.content.map(async (employee) => {
            try {
              const projectResponse = await get(`/employees/${employee.employeeID}/projects`);
              let filteredProjects = projectResponse.data.content || [];
              if (!showAllProjects) {
                filteredProjects = filteredProjects.filter((p) => p.projectStatus === "Active");
              }
              filteredProjects = filteredProjects.map((project) => ({
                ...project,
                projectEndDate: new Date(project.projectEndDate),
              }));
              return { ...employee, projects: filteredProjects };
            } catch (err) {
              return { ...employee, projects: [] };
            }
          })
        );

        setAllEmployees(employeesWithProjects);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAllEmployees();
  }, [showAllProjects]);

  // Filter employees by company and paginate
  useEffect(() => {
    let filtered = allEmployees;
    if (selectedCompanyId) {
      filtered = allEmployees.filter((emp) => {
        const companyId =
          emp.company?.companyId || emp.company?.companyID || emp.companyId || emp.companyID;
        return companyId?.toString() === selectedCompanyId.toString();
      });
    }
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);
    setEmployees(paginated);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [allEmployees, selectedCompanyId, currentPage, pageSize]);

  // Fetch timesheets
  useEffect(() => {
    const fetchTimeSheets = async () => {
      if (selectedMonth && selectedYear) {
        try {
          const response = await post("/timeSheets/getAllTimeSheetsByMonthYear", {
            month: selectedMonth,
            year: selectedYear,
          });
          setTimeSheets(response.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchTimeSheets();
  }, [selectedMonth, selectedYear]);

  const findRegularHours = (empId, projectId, date) => {
    const sheet = timeSheets.find(
      (ts) =>
        ts.empId === empId &&
        ts.projectId === projectId &&
        new Date(ts.date).getDate() === date
    );
    return sheet?.regularHours || 0;
  };

  const renderDates = () => {
    if (!selectedMonth || !selectedYear) return [];
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => {
      const date = new Date(selectedYear, selectedMonth - 1, i + 1);
      return { date, isWeekend: [0, 6].includes(date.getDay()) };
    });
  };

  const handleApprove = async (employee, project) => {
    const updated = timeSheets.map((ts) =>
      ts.empId === employee.employeeID &&
      ts.projectId === project.projectId &&
      new Date(ts.date).getMonth() + 1 === selectedMonth &&
      new Date(ts.date).getFullYear() === selectedYear
        ? { ...ts, status: "APPROVED" }
        : ts
    );
    setTimeSheets(updated);
    const payload = updated.filter((ts) => ts.status === "APPROVED").map((ts) => ({
      ...ts,
      date: new Date(ts.date).toISOString(),
    }));
    await post("/timeSheets/createTimeSheet", payload);
  };

  const handleReject = async (employee, project) => {
    const updated = timeSheets.map((ts) =>
      ts.empId === employee.employeeID &&
      ts.projectId === project.projectId &&
      new Date(ts.date).getMonth() + 1 === selectedMonth &&
      new Date(ts.date).getFullYear() === selectedYear
        ? { ...ts, status: "REJECTED" }
        : ts
    );
    setTimeSheets(updated);
    const payload = updated.filter((ts) => ts.status === "REJECTED").map((ts) => ({
      ...ts,
      date: new Date(ts.date).toISOString(),
    }));
    await post("/timeSheets/createTimeSheet", payload);
  };

  const fetchUploadedFiles = async (employeeId, projectId) => {
    try {
      const token = sessionStorage.getItem("token");
      const monthName = new Date(selectedYear, selectedMonth - 1, 1).toLocaleString("default", {
        month: "long",
      });
      const response = await get(
        `/timeSheets/getUploadedFiles/${employeeId}/${projectId}/${selectedYear}/${monthName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUploadedDocs(response.data);
      setDocsModalVisible(true);
    } catch (err) {
      console.error(err);
      Modal.error({ title: "Failed to fetch uploaded documents" });
    }
  };

  const handleOpenNotes = async (employeeId, projectId) => {
    try {
      const response = await post("/timeSheets/getAllTimeSheets", {
        month: selectedMonth,
        year: selectedYear,
        employeeId,
        projectId,
      });
      const note = response.data.find((sheet) => sheet.notes)?.notes || "";
      setNoteEmployeeId(employeeId);
      setNoteProjectId(projectId);
      setNoteText(note);
      setNotesModalVisible(true);
    } catch (err) {
      console.error(err);
      setNoteText("");
      setNotesModalVisible(true);
    }
  };

  const handleSaveNote = async () => {
    const existingSheet = timeSheets.find(
      (sheet) =>
        sheet.empId === noteEmployeeId &&
        sheet.projectId === noteProjectId &&
        new Date(sheet.date).getMonth() + 1 === selectedMonth &&
        new Date(sheet.date).getFullYear() === selectedYear
    );
    const sheetId = existingSheet?.sheetId || null;

    const payload = [
      {
        month: selectedMonth,
        year: selectedYear,
        employeeId: noteEmployeeId,
        projectId: noteProjectId,
        sheetId,
        date: new Date(selectedYear, selectedMonth - 1, 1),
        notes: noteText,
      },
    ];
    await post("/timeSheets/createTimeSheet", payload);
    Modal.success({ title: "Note saved successfully" });
    setNotesModalVisible(false);
  };

  const handleOpenReminder = (employee) => {
    setReminderEmployee(employee);
    setReminderText("");
    setReminderModalVisible(true);
  };

  const handleSendReminder = async () => {
    if (!reminderText.trim()) {
      Modal.warning({ title: "Reminder message cannot be empty" });
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      const fromEmail = "nanisainathchowdary@gmail.com";
      const employeeEmail = reminderEmployee.emailID;
      if (!employeeEmail) {
        Modal.warning({ title: "Employee email missing" });
        return;
      }

      const formData = new FormData();
      formData.append("fromEmail", fromEmail);
      formData.append("subject", "Reminder Notification");
      formData.append("body", reminderText);
      formData.append("toList", employeeEmail);

      await post("/email/send", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      Modal.success({ title: "Reminder sent successfully" });
      setReminderModalVisible(false);
    } catch (err) {
      console.error(err);
      Modal.error({ title: "Failed to send reminder" });
    }
  };

  // Table columns
  const columns = [
    { title: "First Name", dataIndex: ["firstName"], key: "firstName" },
    { title: "Last Name", dataIndex: ["lastName"], key: "lastName" },
    { title: "Company", dataIndex: ["company", "companyName"], key: "companyName" },
    {
      title: "Projects",
      key: "projects",
      render: (_, record) =>
        record.projects.map((project) => (
          <div key={project.projectId}>
            <Tag color={project.projectEndDate < new Date() ? "red" : "blue"}>
              {project.subVendorOne}/{project.subVendorTwo}
            </Tag>
          </div>
        )),
    },
    ...renderDates().map((dateObj) => ({
      title: dateObj.date,
      key: dateObj.date,
      render: (_, record) =>
        record.projects.map((project) => (
          <div key={`${record.employeeID}-${project.projectId}-${dateObj.date}`}>
            {findRegularHours(record.employeeID, project.projectId, dateObj.date.getDate())}
          </div>
        )),
    })),
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.projects.map((project) => (
          <div key={`${record.employeeID}-${project.projectId}-actions`}>
            <FaCheck
              onClick={() => handleApprove(record, project)}
              style={{ color: "green", cursor: "pointer", marginRight: "8px" }}
            />
            <FaTimes
              onClick={() => handleReject(record, project)}
              style={{ color: "red", cursor: "pointer", marginRight: "8px" }}
            />
            <TbNotes
              onClick={() => handleOpenNotes(record.employeeID, project.projectId)}
              style={{ color: "#007bff", cursor: "pointer", marginRight: "8px" }}
            />
            <Button
              size="small"
              onClick={() => fetchUploadedFiles(record.employeeID, project.projectId)}
              style={{ marginRight: "8px" }}
            >
              View Docs
            </Button>
            <IoNotifications
              onClick={() => handleOpenReminder(record)}
              style={{ color: "#f39c12", cursor: "pointer" }}
            />
          </div>
        )),
    },
  ];

  return (
    <div>
      <h2>All Employee Time Sheets</h2>

      <div style={{ marginBottom: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Select
          placeholder="Select Month"
          style={{ width: 140 }}
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              {new Date(2020, i, 1).toLocaleString("default", { month: "long" })}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Select Year"
          style={{ width: 100 }}
          value={selectedYear}
          onChange={(value) => setSelectedYear(value)}
        >
          {Array.from({ length: 11 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <Option key={year} value={year}>
                {year}
              </Option>
            );
          })}
        </Select>

        <Select
          placeholder="Select Company"
          style={{ width: 180 }}
          value={selectedCompanyId}
          onChange={(value) => setSelectedCompanyId(value)}
        >
          <Option value="">All Companies</Option>
          {companies.map((company) => (
            <Option key={company.companyId} value={company.companyId}>
              {company.companyName}
            </Option>
          ))}
        </Select>

        <Checkbox checked={showAllProjects} onChange={(e) => setShowAllProjects(e.target.checked)}>
          Show All Projects
        </Checkbox>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="employeeID"
        pagination={{
          current: currentPage,
          pageSize,
          total: totalPages * pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: "max-content" }}
      />

      {/* Notes Modal */}
      <Modal
        title="Notes"
        open={notesModalVisible}
        onOk={handleSaveNote}
        onCancel={() => setNotesModalVisible(false)}
      >
        <TextArea
          rows={5}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type notes here..."
        />
      </Modal>

      {/* Docs Modal */}
      <Modal
        title="Uploaded Documents"
        open={docsModalVisible}
        onCancel={() => setDocsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDocsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {uploadedDocs.length > 0 ? (
          <ul>
            {uploadedDocs.map((doc, idx) => (
              <li key={idx}>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  {doc.fileName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents uploaded.</p>
        )}
      </Modal>

      {/* Reminder Modal */}
      <Modal
        title={`Send Reminder to ${reminderEmployee?.firstName} ${reminderEmployee?.lastName}`}
        open={reminderModalVisible}
        onOk={handleSendReminder}
        onCancel={() => setReminderModalVisible(false)}
      >
        <TextArea
          rows={5}
          value={reminderText}
          onChange={(e) => setReminderText(e.target.value)}
          placeholder="Type your reminder message here..."
        />
      </Modal>
    </div>
  );
};

export default AllTimeSheets;
