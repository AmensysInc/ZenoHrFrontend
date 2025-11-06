import React, { useEffect, useState } from "react";
import { get, post } from "../SharedComponents/httpClient ";
import {
  Table,
  Select,
  Checkbox,
  Button,
  Modal,
  Input,
  Tag,
  InputNumber,
  message,
} from "antd";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
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

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState([]);

  // Auto-select current month & year
  useEffect(() => {
    const today = new Date();
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
  }, []);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await get("/companies?page=0&size=100");
        if (response.data?.content) setCompanies(response.data.content);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch all employees and projects
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        const response = await get("/employees?page=0&size=1000");
        if (!response.data?.content) {
          setLoading(false);
          return;
        }

        const employeesWithProjects = await Promise.all(
          response.data.content.map(async (employee) => {
            try {
              const projectResponse = await get(
                `/employees/${employee.employeeID}/projects`
              );
              let filteredProjects = projectResponse.data.content || [];
              if (!showAllProjects) {
                filteredProjects = filteredProjects.filter(
                  (p) => p.projectStatus === "Active"
                );
              }
              filteredProjects = filteredProjects.map((project) => ({
                ...project,
                projectEndDate: new Date(project.projectEndDate),
              }));
              return { ...employee, projects: filteredProjects };
            } catch {
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

  // Filter by company + pagination
  useEffect(() => {
    let filtered = allEmployees;
    if (selectedCompanyId) {
      filtered = allEmployees.filter((emp) => {
        const companyId =
          emp.company?.companyId ||
          emp.company?.companyID ||
          emp.companyId ||
          emp.companyID;
        return companyId?.toString() === selectedCompanyId.toString();
      });
    }
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);
    setEmployees(paginated);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [allEmployees, selectedCompanyId, currentPage, pageSize]);

  // Fetch all timesheets
  useEffect(() => {
    const fetchTimeSheets = async () => {
      if (selectedMonth && selectedYear) {
        try {
          const response = await post(
            "/timeSheets/getAllTimeSheetsByMonthYear",
            {
              month: selectedMonth,
              year: selectedYear,
            }
          );
          setTimeSheets(response.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchTimeSheets();
  }, [selectedMonth, selectedYear]);

  // Render all days in month
  const renderDates = () => {
    if (!selectedMonth || !selectedYear) return [];
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => {
      const date = new Date(selectedYear, selectedMonth - 1, i + 1);
      return { date, isWeekend: [0, 6].includes(date.getDay()) };
    });
  };

  // Find Regular Hours for each date cell
  const findRegularHours = (empId, projectId, date) => {
    const sheet = timeSheets.find(
      (ts) =>
        ts.empId === empId &&
        ts.projectId === projectId &&
        new Date(ts.date).getDate() === date
    );
    return sheet?.regularHours || 0;
  };

  // ✅ UPDATED handleOpenEdit: Show all days (1–31)
  const handleOpenEdit = (employee, project) => {
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate();

    const filteredSheets = timeSheets.filter(
      (ts) =>
        ts.empId === employee.employeeID &&
        ts.projectId === project.projectId &&
        new Date(ts.date).getMonth() + 1 === selectedMonth &&
        new Date(ts.date).getFullYear() === selectedYear
    );

    const fullMonthData = Array.from({ length: numDays }, (_, i) => {
      const dateObj = new Date(selectedYear, selectedMonth - 1, i + 1);
      const existing = filteredSheets.find(
        (ts) => new Date(ts.date).getDate() === i + 1
      );
      return (
        existing || {
          empId: employee.employeeID,
          employeeId: employee.employeeID,
          projectId: project.projectId,
          date: dateObj.toISOString(),
          regularHours: 0,
          overTimeHours: 0,
          status: "PENDING",
          notes: "",
          masterId: null,
          sheetId: null,
        }
      );
    });

    setEditData(fullMonthData);
    setEditModalVisible(true);
  };

  // Save edited data
  const handleSaveEdit = async () => {
    if (!editData || !editData.length) return;

    try {
      const payload = editData.map((ts) => ({
        masterId: ts.masterId || null,
        month: selectedMonth,
        year: selectedYear,
        employeeId: ts.empId || ts.employeeId,
        projectId: ts.projectId,
        sheetId: ts.sheetId || null,
        regularHours: ts.regularHours || 0,
        overTimeHours: ts.overTimeHours || 0,
        date: ts.date,
        status: ts.status || "PENDING",
        notes: ts.notes || "",
      }));

      await post("/timeSheets/createTimeSheet", payload);
      message.success("✅ Timesheets updated successfully!");
      setEditModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to update timesheets!");
    }
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
    const payload = updated.filter((ts) => ts.status === "APPROVED");
    await post("/timeSheets/createTimeSheet", payload);
    message.success("✅ Approved successfully!");
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
    const payload = updated.filter((ts) => ts.status === "REJECTED");
    await post("/timeSheets/createTimeSheet", payload);
    message.warning("⚠️ Rejected successfully!");
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    {
      title: "Company",
      dataIndex: ["company", "companyName"],
      key: "companyName",
    },
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
      title: dateObj.date.getDate(),
      key: dateObj.date.getDate(),
      render: (_, record) =>
        record.projects.map((project) => (
          <div
            key={`${record.employeeID}-${project.projectId}-${dateObj.date}`}
          >
            {findRegularHours(
              record.employeeID,
              project.projectId,
              dateObj.date.getDate()
            )}
          </div>
        )),
    })),
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) =>
        record.projects.map((project) => (
          <div key={`${record.employeeID}-${project.projectId}-actions`}>
            <FaCheck
              onClick={() => handleApprove(record, project)}
              style={{ color: "green", cursor: "pointer", marginRight: 8 }}
            />
            <FaTimes
              onClick={() => handleReject(record, project)}
              style={{ color: "red", cursor: "pointer", marginRight: 8 }}
            />
            <FaEdit
              onClick={() => handleOpenEdit(record, project)}
              style={{ color: "#3498db", cursor: "pointer", marginRight: 8 }}
            />
            <TbNotes
              onClick={() => message.info("Notes modal under construction 📝")}
              style={{ color: "#007bff", cursor: "pointer", marginRight: 8 }}
            />
            <IoNotifications
              onClick={() =>
                message.info("Reminder functionality coming soon 🔔")
              }
              style={{ color: "#f39c12", cursor: "pointer" }}
            />
          </div>
        )),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>All Employee Time Sheets</h2>

      {/* Filters */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Select
          placeholder="Select Month"
          style={{ width: 140 }}
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              {new Date(2020, i, 1).toLocaleString("default", {
                month: "long",
              })}
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

        <Checkbox
          checked={showAllProjects}
          onChange={(e) => setShowAllProjects(e.target.checked)}
        >
          Show All Projects
        </Checkbox>
      </div>

      {/* Table */}
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

      {/* 🧾 Edit Modal */}
      <Modal
        title="Edit Timesheet"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        okText="Save Changes"
        width={750}
      >
        {editData.length > 0 ? (
          <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 10 }}>
            {editData.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 2fr",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span>{new Date(entry.date).toLocaleDateString()}</span>

                <InputNumber
                  min={0}
                  max={24}
                  value={entry.regularHours || 0}
                  onChange={(val) => {
                    const updated = [...editData];
                    updated[idx].regularHours = val ?? 0;
                    setEditData(updated);
                  }}
                />

                <InputNumber
                  min={0}
                  max={10}
                  value={entry.overTimeHours || 0}
                  onChange={(val) => {
                    const updated = [...editData];
                    updated[idx].overTimeHours = val ?? 0;
                    setEditData(updated);
                  }}
                />

                <Input
                  placeholder="Status"
                  value={entry.status || ""}
                  onChange={(e) => {
                    const updated = [...editData];
                    updated[idx].status = e.target.value;
                    setEditData(updated);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No records available to edit.</p>
        )}
      </Modal>
    </div>
  );
};

export default AllTimeSheets;
