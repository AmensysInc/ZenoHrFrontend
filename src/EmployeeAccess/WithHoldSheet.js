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
  Card,
  Typography,
} from "antd";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import { IoNotifications } from "react-icons/io5";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

export default function AllTimeSheets() {
  // Master data
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [timeSheets, setTimeSheets] = useState([]);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [showAllProjects, setShowAllProjects] = useState(false);

  // UI
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editValues, setEditValues] = useState({
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
    notes: "",
  });

  // Notes modal
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [notesRecord, setNotesRecord] = useState(null);
  const [notesText, setNotesText] = useState("");

  // Helper: normalize number -> default to 0 but keep editable
  const normalizeNumber = (val) =>
    val === undefined || val === null || isNaN(val) ? 0 : Number(val);

  // Initial load
  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchTimeSheets();
  }, [selectedMonth, selectedYear, selectedCompanyId, selectedEmployeeId, showAllProjects]);

  const fetchMasterData = async () => {
    try {
      setLoading(true);

      // TODO: Replace these URLs with your real APIs
      const [empRes, compRes] = await Promise.all([
        get("/api/employees"), // e.g. "/employees/getAll"
        get("/api/companies"), // e.g. "/companies/getAll"
      ]);

      const empData = empRes?.data || empRes || [];
      const compData = compRes?.data || compRes || [];

      setAllEmployees(empData);
      setEmployees(empData);
      setCompanies(compData);
    } catch (err) {
      console.error(err);
      message.error("Failed to load employees/companies.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSheets = async () => {
    try {
      setLoading(true);

      // Build query string for filters (you can adjust as per backend)
      const params = new URLSearchParams();
      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedYear) params.append("year", selectedYear);
      if (selectedCompanyId) params.append("companyId", selectedCompanyId);
      if (selectedEmployeeId) params.append("employeeId", selectedEmployeeId);
      if (showAllProjects) params.append("showAllProjects", "true");

      // TODO: Replace with your real API endpoint
      const res = await get(`/api/timesheets?${params.toString()}`);

      const data = res?.data || res || [];
      const normalized = data.map((ts) => ({
        ...ts,
        mon: normalizeNumber(ts.mon),
        tue: normalizeNumber(ts.tue),
        wed: normalizeNumber(ts.wed),
        thu: normalizeNumber(ts.thu),
        fri: normalizeNumber(ts.fri),
        sat: normalizeNumber(ts.sat),
        sun: normalizeNumber(ts.sun),
        totalHours: normalizeNumber(
          ts.totalHours ??
            ts.mon +
              ts.tue +
              ts.wed +
              ts.thu +
              ts.fri +
              ts.sat +
              ts.sun
        ),
      }));

      setTimeSheets(normalized);
    } catch (err) {
      console.error(err);
      message.error("Failed to load timesheets.");
    } finally {
      setLoading(false);
    }
  };

  // Filter employee by company
  useEffect(() => {
    if (!selectedCompanyId) {
      setEmployees(allEmployees);
    } else {
      const filtered = allEmployees.filter(
        (e) => String(e.companyId) === String(selectedCompanyId)
      );
      setEmployees(filtered);
    }
  }, [selectedCompanyId, allEmployees]);

  // Open edit modal
  const openEditModal = (record) => {
    setEditingRecord(record);

    setEditValues({
      mon: normalizeNumber(record?.mon),
      tue: normalizeNumber(record?.tue),
      wed: normalizeNumber(record?.wed),
      thu: normalizeNumber(record?.thu),
      fri: normalizeNumber(record?.fri),
      sat: normalizeNumber(record?.sat),
      sun: normalizeNumber(record?.sun),
      notes: record?.notes || "",
    });

    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setEditingRecord(null);
  };

  const handleEditValueChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: field === "notes" ? value : normalizeNumber(value),
    }));
  };

  const getTotalFromEditValues = () => {
    const { mon, tue, wed, thu, fri, sat, sun } = editValues;
    return (
      normalizeNumber(mon) +
      normalizeNumber(tue) +
      normalizeNumber(wed) +
      normalizeNumber(thu) +
      normalizeNumber(fri) +
      normalizeNumber(sat) +
      normalizeNumber(sun)
    );
  };

  const handleSaveTimesheet = async () => {
    if (!editingRecord) return;

    const totalHours = getTotalFromEditValues();

    const payload = {
      ...editingRecord,
      ...editValues,
      totalHours,
    };

    try {
      setLoading(true);
      // TODO: Replace with your real save/update endpoint
      await post("/api/timesheets/save", payload);
      message.success("Timesheet saved successfully.");

      // Update local state
      setTimeSheets((prev) =>
        prev.map((ts) =>
          ts.id === editingRecord.id || ts.timeSheetId === editingRecord.timeSheetId
            ? { ...payload }
            : ts
        )
      );

      closeEditModal();
    } catch (err) {
      console.error(err);
      message.error("Failed to save timesheet.");
    } finally {
      setLoading(false);
    }
  };

  // Notes modal handlers
  const openNotesModal = (record) => {
    setNotesRecord(record);
    setNotesText(record?.notes || "");
    setIsNotesModalVisible(true);
  };

  const closeNotesModal = () => {
    setIsNotesModalVisible(false);
    setNotesRecord(null);
  };

  const handleSaveNotes = async () => {
    if (!notesRecord) return;

    const payload = {
      ...notesRecord,
      notes: notesText,
    };

    try {
      setLoading(true);
      // TODO: change to your own endpoint if different
      await post("/api/timesheets/saveNotes", payload);
      message.success("Notes updated successfully.");

      setTimeSheets((prev) =>
        prev.map((ts) =>
          ts.id === notesRecord.id || ts.timeSheetId === notesRecord.timeSheetId
            ? { ...ts, notes: notesText }
            : ts
        )
      );
      closeNotesModal();
    } catch (err) {
      console.error(err);
      message.error("Failed to save notes.");
    } finally {
      setLoading(false);
    }
  };

  // Notification handler (stub)
  const handleSendNotification = async (record) => {
    try {
      setLoading(true);
      // TODO: implement your notification API here
      await post("/api/timesheets/sendNotification", {
        timeSheetId: record.id || record.timeSheetId,
      });
      message.success("Notification sent successfully.");
    } catch (err) {
      console.error(err);
      message.error("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  // Approve / Reject handlers (optional)
  const handleApprove = async (record) => {
    try {
      setLoading(true);
      await post("/api/timesheets/approve", {
        timeSheetId: record.id || record.timeSheetId,
      });
      message.success("Timesheet approved.");
      setTimeSheets((prev) =>
        prev.map((ts) =>
          ts.id === record.id || ts.timeSheetId === record.timeSheetId
            ? { ...ts, status: "Approved" }
            : ts
        )
      );
    } catch (err) {
      console.error(err);
      message.error("Failed to approve timesheet.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (record) => {
    try {
      setLoading(true);
      await post("/api/timesheets/reject", {
        timeSheetId: record.id || record.timeSheetId,
      });
      message.success("Timesheet rejected.");
      setTimeSheets((prev) =>
        prev.map((ts) =>
          ts.id === record.id || ts.timeSheetId === record.timeSheetId
            ? { ...ts, status: "Rejected" }
            : ts
        )
      );
    } catch (err) {
      console.error(err);
      message.error("Failed to reject timesheet.");
    } finally {
      setLoading(false);
    }
  };

  // Month / Year options
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 5; y <= currentYear + 1; y++) {
    yearOptions.push(y);
  }

  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text, record) => text || record.employee_fullname || "-",
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      render: (text, record) => text || record.clientName || "-",
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      render: (text) => text || "-",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (val) => {
        const m = monthOptions.find((x) => Number(x.value) === Number(val));
        return m ? m.label : val || "-";
      },
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      render: (val) => val || "-",
    },
    {
      title: "Mon",
      dataIndex: "mon",
      key: "mon",
      render: (val) => normalizeNumber(val),
    },
    {
      title: "Tue",
      dataIndex: "tue",
      key: "tue",
      render: (val) => normalizeNumber(val),
    },
    {
      title: "Wed",
      dataIndex: "wed",
      key: "wed",
      render: (val) => normalizeNumber(val),
    },
    {
      title: "Thu",
      dataIndex: "thu",
      key: "thu",
      render: (val) => normalizeNumber(val),
    },
    {
      title: "Fri",
      dataIndex: "fri",
      key: "fri",
      render: (val) => normalizeNumber(val),
    },
    {
      title: "Sat",
      dataIndex: "sat",
      key: "sat",
      render: (val) => normalizeNumber(val),
    },
    {
      title: "Sun",
      dataIndex: "sun",
      key: "sun",
      render: (val) => normalizeNumber(val),
    },
    {
      title: "Total",
      dataIndex: "totalHours",
      key: "totalHours",
      render: (val, record) =>
        normalizeNumber(
          val ??
            record.mon +
              record.tue +
              record.wed +
              record.thu +
              record.fri +
              record.sat +
              record.sun
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (val) => {
        if (val === "Approved") {
          return <Tag color="green">Approved</Tag>;
        }
        if (val === "Rejected") {
          return <Tag color="red">Rejected</Tag>;
        }
        return <Tag color="gold">{val || "Pending"}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            icon={<FaEdit />}
            onClick={() => openEditModal(record)}
          />
          <Button
            size="small"
            icon={<TbNotes />}
            onClick={() => openNotesModal(record)}
          />
          <Button
            size="small"
            icon={<IoNotifications />}
            onClick={() => handleSendNotification(record)}
          />
          <Button
            size="small"
            icon={<FaCheck />}
            type="primary"
            onClick={() => handleApprove(record)}
          />
          <Button
            size="small"
            icon={<FaTimes />}
            danger
            onClick={() => handleReject(record)}
          />
        </div>
      ),
    },
  ];

  const paginatedData = timeSheets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card>
          <Title level={4} style={{ marginBottom: 20 }}>All TimeSheets</Title>

          {/* Filters */}
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
            }}
          >
        <div>
          <span>Month: </span>
          <Select
            style={{ width: 140 }}
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(val)}
          >
            {monthOptions.map((m) => (
              <Option key={m.value} value={m.value}>
                {m.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <span>Year: </span>
          <Select
            style={{ width: 100 }}
            value={selectedYear}
            onChange={(val) => setSelectedYear(val)}
          >
            {yearOptions.map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <span>Company: </span>
          <Select
            allowClear
            style={{ width: 180 }}
            value={selectedCompanyId || undefined}
            onChange={(val) => setSelectedCompanyId(val || "")}
            placeholder="All Companies"
          >
            {companies.map((c) => (
              <Option key={c.id || c.companyId} value={c.id || c.companyId}>
                {c.companyName || c.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <span>Employee: </span>
          <Select
            allowClear
            style={{ width: 220 }}
            value={selectedEmployeeId || undefined}
            onChange={(val) => setSelectedEmployeeId(val || "")}
            placeholder="All Employees"
            showSearch
            optionFilterProp="children"
          >
            {employees.map((e) => (
              <Option key={e.id} value={e.id}>
                {e.employeeName || e.fullName || e.name}
              </Option>
            ))}
          </Select>
        </div>

        <Checkbox
          checked={showAllProjects}
          onChange={(e) => setShowAllProjects(e.target.checked)}
        >
          Show All Projects
        </Checkbox>

        <Button type="primary" onClick={fetchTimeSheets}>
          Refresh
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey={(record) => record.id || record.timeSheetId}
        columns={columns}
        dataSource={paginatedData}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: timeSheets.length,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        scroll={{ x: "max-content" }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Timesheet"
        open={isEditModalVisible}
        onOk={handleSaveTimesheet}
        onCancel={closeEditModal}
        okText="Save"
        destroyOnClose
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <label>Mon</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValues.mon}
              onChange={(val) => handleEditValueChange("mon", val)}
            />
          </div>
          <div>
            <label>Tue</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValues.tue}
              onChange={(val) => handleEditValueChange("tue", val)}
            />
          </div>
          <div>
            <label>Wed</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValues.wed}
              onChange={(val) => handleEditValueChange("wed", val)}
            />
          </div>
          <div>
            <label>Thu</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValues.thu}
              onChange={(val) => handleEditValueChange("thu", val)}
            />
          </div>
          <div>
            <label>Fri</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValues.fri}
              onChange={(val) => handleEditValueChange("fri", val)}
            />
          </div>
          <div>
            <label>Sat</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValues.sat}
              onChange={(val) => handleEditValueChange("sat", val)}
            />
          </div>
          <div>
            <label>Sun</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValues.sun}
              onChange={(val) => handleEditValueChange("sun", val)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong>Total Hours: {getTotalFromEditValues()}</strong>
        </div>

        <div>
          <label>Notes</label>
          <TextArea
            rows={3}
            value={editValues.notes}
            onChange={(e) => handleEditValueChange("notes", e.target.value)}
          />
        </div>
      </Modal>

      {/* Notes Modal */}
      <Modal
        title="Timesheet Notes"
        open={isNotesModalVisible}
        onOk={handleSaveNotes}
        onCancel={closeNotesModal}
        okText="Save Notes"
        destroyOnClose
      >
        <TextArea
          rows={6}
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Enter notes or comments..."
        />
      </Modal>
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
