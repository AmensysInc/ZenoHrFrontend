import React, { useEffect, useState } from "react";
import { get, post } from "../SharedComponents/httpClient ";
import {
  Table,
  Select,
  Checkbox,
  Button,
  InputNumber,
  Input,
  Tag,
  message,
} from "antd";
import { FaCheck, FaTimes } from "react-icons/fa";

const { Option } = Select;

export default function AllTimeSheets() {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [timeSheets, setTimeSheets] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [editingCell, setEditingCell] = useState(null); // <= Inline editing cell

  /* ------------------ AUTO SELECT MONTH+YEAR ------------------ */
  useEffect(() => {
    const today = new Date();
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
  }, []);

  /* ------------------ FETCH COMPANIES ------------------ */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await get("/companies?page=0&size=100");
        response.data?.content && setCompanies(response.data.content);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  /* ------------------ FETCH EMPLOYEES + PROJECTS ------------------ */
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        const response = await get("/employees?page=0&size=1000");
        if (!response.data?.content) return;

        const employeesWithProjects = await Promise.all(
          response.data.content.map(async (emp) => {
            try {
              const projectResponse = await get(
                `/employees/${emp.employeeID}/projects`
              );

              let projects = projectResponse.data.content || [];
              if (!showAllProjects) {
                projects = projects.filter((p) => p.projectStatus === "Active");
              }

              return {
                ...emp,
                projects: projects.map((p) => ({
                  ...p,
                  projectEndDate: new Date(p.projectEndDate),
                })),
              };
            } catch {
              return { ...emp, projects: [] };
            }
          })
        );

        setAllEmployees(employeesWithProjects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEmployees();
  }, [showAllProjects]);

  /* ------------------ FILTER BY COMPANY ------------------ */
  useEffect(() => {
    let filtered = allEmployees;

    if (selectedCompanyId) {
      filtered = filtered.filter((emp) => {
        const cid =
          emp.company?.companyId ||
          emp.company?.companyID ||
          emp.companyId ||
          emp.companyID;

        return cid?.toString() === selectedCompanyId.toString();
      });
    }

    const start = (currentPage - 1) * pageSize;
    setEmployees(filtered.slice(start, start + pageSize));
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [allEmployees, selectedCompanyId, currentPage]);

  /* ------------------ FETCH TIMESHEETS ------------------ */
  useEffect(() => {
    const fetchSheets = async () => {
      if (!selectedMonth || !selectedYear) return;

      try {
        const response = await post("/timeSheets/getAllTimeSheetsByMonthYear", {
          month: selectedMonth,
          year: selectedYear,
        });
        setTimeSheets(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSheets();
  }, [selectedMonth, selectedYear]);

  /* ------------------ INLINE EDIT SAVE ------------------ */
  const handleInlineSave = async (value) => {
    if (!editingCell) return;

    const { empId, projectId, date, field } = editingCell;

    try {
      await post("/timeSheets/createTimeSheet", [
        {
          employeeId: empId,
          projectId,
          date,
          month: selectedMonth,
          year: selectedYear,
          regularHours:
            field === "regularHours"
              ? value
              : findRegularHours(empId, projectId, new Date(date).getDate()),
          overTimeHours:
            field === "overTimeHours"
              ? value
              : findOverHours(empId, projectId, new Date(date).getDate()),
          status: "PENDING",
        },
      ]);

      message.success("Saved!");
      setEditingCell(null);

      // refresh
      const newTS = await post("/timeSheets/getAllTimeSheetsByMonthYear", {
        month: selectedMonth,
        year: selectedYear,
      });
      setTimeSheets(newTS.data);
    } catch (error) {
      console.error(error);
      message.error("Save failed");
    }
  };

  /* ------------------ GET HOURS ------------------ */
  const findRegularHours = (empId, projectId, day) => {
    const entry = timeSheets.find(
      (ts) =>
        ts.empId === empId &&
        ts.projectId === projectId &&
        new Date(ts.date).getDate() === day
    );
    return entry?.regularHours ?? 0;
  };

  const findOverHours = (empId, projectId, day) => {
    const entry = timeSheets.find(
      (ts) =>
        ts.empId === empId &&
        ts.projectId === projectId &&
        new Date(ts.date).getDate() === day
    );
    return entry?.overTimeHours ?? 0;
  };

  /* ------------------ STATUS UPDATE ------------------ */
  const updateStatus = async (employee, project, status) => {
    try {
      await post("/timeSheets/updateStatus", {
        empId: employee.employeeID,
        projectId: project.projectId,
        month: selectedMonth,
        year: selectedYear,
        status,
      });
      message.success("Status updated!");
    } catch (err) {
      console.error(err);
      message.error("Status update failed");
    }
  };

  /* ------------------ TABLE COLUMNS ------------------ */
  const renderDates = () => {
    if (!selectedMonth || !selectedYear) return [];

    const totalDays = new Date(selectedYear, selectedMonth, 0).getDate();

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1;

      return {
        title: day.toString(),
        render: (_, record) =>
          record.projects.map((project) => {
            const currentDate = new Date(
              selectedYear,
              selectedMonth - 1,
              day
            );

            const isEditing =
              editingCell?.empId === record.employeeID &&
              editingCell?.projectId === project.projectId &&
              new Date(editingCell?.date).getDate() === day;

            return (
              <div
                key={`${record.employeeID}-${project.projectId}-${day}`}
                style={{ marginBottom: 5 }}
                onDoubleClick={() =>
                  setEditingCell({
                    empId: record.employeeID,
                    projectId: project.projectId,
                    date: currentDate.toISOString(),
                    field: "regularHours",
                  })
                }
              >
                {isEditing ? (
                  <InputNumber
                    min={0}
                    max={24}
                    autoFocus
                    onBlur={(e) => handleInlineSave(e.target.value)}
                    onPressEnter={(e) => handleInlineSave(e.target.value)}
                  />
                ) : (
                  findRegularHours(record.employeeID, project.projectId, day)
                )}
              </div>
            );
          }),
      };
    });
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName" },
    { title: "Last Name", dataIndex: "lastName" },
    {
      title: "Company",
      dataIndex: ["company", "companyName"],
    },
    {
      title: "Projects",
      render: (_, record) =>
        record.projects.map((p) => (
          <Tag
            key={p.projectId}
            color={p.projectEndDate < new Date() ? "red" : "blue"}
          >
            {p.subVendorOne}/{p.subVendorTwo}
          </Tag>
        )),
    },
    ...renderDates(),
    {
      title: "Action",
      fixed: "right",
      render: (_, record) =>
        record.projects.map((project) => (
          <div key={project.projectId} style={{ marginBottom: 5 }}>
            <FaCheck
              style={{ color: "green", cursor: "pointer", marginRight: 8 }}
              onClick={() => updateStatus(record, project, "APPROVED")}
            />
            <FaTimes
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => updateStatus(record, project, "REJECTED")}
            />
          </div>
        )),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>All Employee Time Sheets</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: 20, display: "flex", gap: 16 }}>
        <Select style={{ width: 140 }} value={selectedMonth} onChange={setSelectedMonth}>
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              {new Date(2020, i, 1).toLocaleString("default", {
                month: "long",
              })}
            </Option>
          ))}
        </Select>

        <Select style={{ width: 120 }} value={selectedYear} onChange={setSelectedYear}>
          {Array.from({ length: 8 }, (_, i) => {
            const year = new Date().getFullYear() - 4 + i;
            return (
              <Option key={year} value={year}>
                {year}
              </Option>
            );
          })}
        </Select>

        <Select
          style={{ width: 180 }}
          value={selectedCompanyId}
          onChange={setSelectedCompanyId}
        >
          <Option value="">All Companies</Option>
          {companies.map((c) => (
            <Option key={c.companyId} value={c.companyId}>
              {c.companyName}
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

      {/* TABLE */}
      <Table
        rowKey="employeeID"
        columns={columns}
        dataSource={employees}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalPages * pageSize,
          onChange: setCurrentPage,
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}




/*
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

export default function AllTimeSheets() {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [timeSheets, setTimeSheets] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    const today = new Date();
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
  }, []);

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


  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        const response = await get("/employees?page=0&size=1000");
        if (!response.data?.content) return;

        const employeesWithProjects = await Promise.all(
          response.data.content.map(async (emp) => {
            try {
              const projectResponse = await get(
                `/employees/${emp.employeeID}/projects`
              );

              let projects = projectResponse.data.content || [];
              if (!showAllProjects) {
                projects = projects.filter((p) => p.projectStatus === "Active");
              }

              return {
                ...emp,
                projects: projects.map((p) => ({
                  ...p,
                  projectEndDate: new Date(p.projectEndDate),
                })),
              };
            } catch {
              return { ...emp, projects: [] };
            }
          })
        );

        setAllEmployees(employeesWithProjects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEmployees();
  }, [showAllProjects]);

  useEffect(() => {
    let filtered = allEmployees;

    if (selectedCompanyId) {
      filtered = allEmployees.filter((emp) => {
        const cid =
          emp.company?.companyId ||
          emp.company?.companyID ||
          emp.companyId ||
          emp.companyID;
        return cid?.toString() === selectedCompanyId.toString();
      });
    }

    const start = (currentPage - 1) * pageSize;
    const pageData = filtered.slice(start, start + pageSize);

    setEmployees(pageData);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [allEmployees, selectedCompanyId, currentPage]);

  useEffect(() => {
    const fetchSheets = async () => {
      if (!selectedMonth || !selectedYear) return;

      try {
        const response = await post("/timeSheets/getAllTimeSheetsByMonthYear", {
          month: selectedMonth,
          year: selectedYear,
        });
        setTimeSheets(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSheets();
  }, [selectedMonth, selectedYear]);

  const renderDates = () => {
    if (!selectedMonth || !selectedYear) return [];
    const num = new Date(selectedYear, selectedMonth, 0).getDate();

    return Array.from({ length: num }, (_, i) => ({
      date: new Date(selectedYear, selectedMonth - 1, i + 1),
    }));
  };

  const findRegularHours = (empId, projectId, date) => {
    const entry = timeSheets.find(
      (ts) =>
        ts.empId === empId &&
        ts.projectId === projectId &&
        new Date(ts.date).getDate() === date
    );
    return entry?.regularHours ?? 0;
  };

  const handleOpenEdit = (employee, project, date) => {
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate();

    const monthSheets = timeSheets.filter(
      (ts) =>
        ts.empId === employee.employeeID &&
        ts.projectId === project.projectId &&
        new Date(ts.date).getMonth() + 1 === selectedMonth &&
        new Date(ts.date).getFullYear() === selectedYear &&
        new Date(ts.date).getDate() === date
    );

    const fullMonth = Array.from({ length: numDays }, (_, i) => {
      const dateObj = new Date(selectedYear, selectedMonth - 1, i + 1);
      const existing = monthSheets.find(
        (ts) => new Date(ts.date).getDate() === i + 1
      );

      return {
        empId: employee.employeeID,
        employeeId: employee.employeeID,
        projectId: project.projectId,
        date: dateObj.toISOString(),
        regularHours: existing?.regularHours ?? 0,
        overTimeHours: existing?.overTimeHours ?? 0,
        status: existing?.status ?? "PENDING",
        notes: existing?.notes ?? "",
        masterId: existing?.masterId ?? null,
        sheetId: existing?.sheetId ?? null,
      };
    });

    setEditData(fullMonth);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const payload = editData.map((item) => ({
        month: selectedMonth,
        year: selectedYear,
        regularHours: item.regularHours,
        overTimeHours: item.overTimeHours,
        date: item.date,
        employeeId: item.empId,
        projectId: item.projectId,
        status: item.status,
        notes: item.notes,
        masterId: item.masterId || null,
        sheetId: item.sheetId || null,
      }));

      await post("/timeSheets/createTimeSheet", payload);

      message.success("Timesheets updated successfully!");
      setEditModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error("Failed to update timesheets.");
    }
  };

  const updateStatus = async (employee, project, status) => {
    const updated = timeSheets.map((ts) =>
      ts.empId === employee.employeeID &&
      ts.projectId === project.projectId &&
      new Date(ts.date).getMonth() + 1 === selectedMonth &&
      new Date(ts.date).getFullYear() === selectedYear
        ? { ...ts, status }
        : ts
    );

    setTimeSheets(updated);

    await post(
      "/timeSheets/createTimeSheet",
      updated.filter((ts) => ts.status === status)
    );

    message.success(
      status === "APPROVED" ? "Approved successfully!" : "Rejected successfully!"
    );
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName" },
    { title: "Last Name", dataIndex: "lastName" },
    {
      title: "Company",
      dataIndex: ["company", "companyName"],
    },
    {
      title: "Projects",
      render: (_, record) =>
        record.projects.map((p) => (
          <div key={p.projectId}>
            <Tag
              color={p.projectEndDate < new Date() ? "red" : "blue"}
            >
              {p.subVendorOne}/{p.subVendorTwo}
            </Tag>
          </div>
        )),
    },
    ...renderDates().map((d) => ({
      title: d.date.getDate(),
      render: (_, record) =>
        record.projects.map((p) => (
          <div
            key={`${record.employeeID}-${p.projectId}-${d.date}`}
            onDoubleClick={() => handleOpenEdit(record, p, d.date.getDate())}
            style={{ cursor: "pointer" }}
          >
            {findRegularHours(record.employeeID, p.projectId, d.date.getDate())}
          </div>
        )),
    })),
    {
      title: "Action",
      fixed: "right",
      render: (_, record) =>
        record.projects.map((project) => (
          <div key={`${record.employeeID}-${project.projectId}`}>
            <FaCheck
              style={{ color: "green", cursor: "pointer", marginRight: 8 }}
              onClick={() => updateStatus(record, project, "APPROVED")}
            />
            <FaTimes
              style={{ color: "red", cursor: "pointer", marginRight: 8 }}
              onClick={() => updateStatus(record, project, "REJECTED")}
            />
            <FaEdit
              style={{ color: "#3498db", cursor: "pointer", marginRight: 8 }}
              onClick={() => handleOpenEdit(record, project, 0)} // Default value if no date passed
            />
            <TbNotes
              style={{ color: "#007bff", cursor: "pointer", marginRight: 8 }}
              onClick={() => message.info("Notes modal coming soon...")}
            />
            <IoNotifications
              style={{ color: "#f39c12", cursor: "pointer" }}
              onClick={() =>
                message.info("Reminder functionality coming soon...")
              }
            />
          </div>
        )),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>All Employee Time Sheets</h2>

      <div style={{ marginBottom: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Select style={{ width: 140 }} value={selectedMonth} onChange={setSelectedMonth}>
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              {new Date(2020, i, 1).toLocaleString("default", { month: "long" })}
            </Option>
          ))}
        </Select>

        <Select style={{ width: 120 }} value={selectedYear} onChange={setSelectedYear}>
          {Array.from({ length: 8 }, (_, i) => {
            const year = new Date().getFullYear() - 4 + i;
            return (
              <Option key={year} value={year}>
                {year}
              </Option>
            );
          })}
        </Select>

        <Select
          style={{ width: 180 }}
          value={selectedCompanyId}
          onChange={setSelectedCompanyId}
        >
          <Option value="">All Companies</Option>
          {companies.map((c) => (
            <Option key={c.companyId} value={c.companyId}>
              {c.companyName}
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

      <Table
        rowKey="employeeID"
        columns={columns}
        dataSource={employees}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalPages * pageSize,
          onChange: setCurrentPage,
        }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Edit Timesheet"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        width={750}
      >
        {editData.length ? (
          <div style={{ maxHeight: 450, overflowY: "auto" }}>
            {editData.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 2fr",
                  gap: 10,
                  marginBottom: 12,
                  padding: "8px 0",
                }}
              >
                <span>{new Date(entry.date).toLocaleDateString()}</span>

                <InputNumber
                  min={0}
                  max={24}
                  value={entry.regularHours}
                  onChange={(val) =>
                    setEditData((prev) =>
                      prev.map((item, index) =>
                        index === idx ? { ...item, regularHours: val ?? 0 } : item
                      )
                    )
                  }
                />

                <InputNumber
                  min={0}
                  max={10}
                  value={entry.overTimeHours}
                  onChange={(val) =>
                    setEditData((prev) =>
                      prev.map((item, index) =>
                        index === idx ? { ...item, overTimeHours: val ?? 0 } : item
                      )
                    )
                  }
                />

                <Input
                  value={entry.status}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev.map((item, index) =>
                        index === idx ? { ...item, status: e.target.value } : item
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </Modal>
    </div>
  );
}
*/