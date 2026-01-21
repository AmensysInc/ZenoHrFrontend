import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Typography, Button, Modal, List, message, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { FiEdit2 } from "react-icons/fi";
import {
  AiFillDelete,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdFileDownload } from "react-icons/md";
import { BiDollar } from "react-icons/bi";
import { IoIosPause } from "react-icons/io";
import { IoCartSharp } from "react-icons/io5";
import { GiTakeMyMoney } from "react-icons/gi";

import {
  deleteEmployee,
  fetchEmployees,
} from "../SharedComponents/services/EmployeeServices";

import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";

const { Title } = Typography;

export default function Employee() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Button styles
  const primaryActionBtn = {
    backgroundColor: "#0D2A4D",
    color: "#fff",
    borderRadius: 8,
    height: 40,
    fontWeight: 500,
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  useEffect(() => {
    fetchData(1, 10);

    // Suppress ResizeObserver errors
    const handleError = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handleError);
    
    // Listen for storage changes to refresh when defaultCompanyId changes
    const handleStorageChange = (e) => {
      if (e.key === 'defaultCompanyId') {
        fetchData(1, 10);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const { content, totalPages } = await fetchEmployees(page - 1, pageSize);

      const userRole = sessionStorage.getItem("role");
      // Read defaultCompanyId fresh each time to get the latest value
      const defaultCompanyId = Number(sessionStorage.getItem("defaultCompanyId"));
      let filtered = content;

      console.log("Employee fetch - Role:", userRole, "DefaultCompanyId:", defaultCompanyId, "Total employees:", content.length);

      // SADMIN sees ALL employees, GROUP_ADMIN sees filtered by backend, ADMIN sees only their company's employees
      if (userRole === "SADMIN") {
        // SADMIN sees all employees - no filtering (backend handles it)
        console.log("SADMIN user - showing all employees");
        filtered = content; // Backend already filtered correctly
      } else if (userRole === "GROUP_ADMIN") {
        // GROUP_ADMIN - backend already filters by selected company, no need for frontend filtering
        console.log("GROUP_ADMIN user - backend filtered by selected company");
        filtered = content;
      } else if (userRole === "ADMIN") {
        // ADMIN sees only employees from their default company
        if (defaultCompanyId && !isNaN(defaultCompanyId)) {
          filtered = content.filter(
            (employee) => {
              const hasCompany = employee.company && employee.company.companyId;
              const matchesCompany = hasCompany && (
                Number(employee.company.companyId) === defaultCompanyId ||
                employee.company.companyId === defaultCompanyId ||
                String(employee.company.companyId) === String(defaultCompanyId)
              );
              return matchesCompany;
            }
          );
          console.log("ADMIN user - filtered employees for company:", defaultCompanyId, "Result:", filtered.length);
        } else {
          console.warn("ADMIN user has no defaultCompanyId set");
        }
      } else {
        // Other roles (EMPLOYEE, etc.) see only their company's employees
        // If no defaultCompanyId is set, show all employees (fallback)
        if (defaultCompanyId && !isNaN(defaultCompanyId)) {
          filtered = content.filter(
            (employee) => {
              const hasCompany = employee.company && employee.company.companyId;
              const matchesCompany = hasCompany && (
                Number(employee.company.companyId) === defaultCompanyId ||
                employee.company.companyId === defaultCompanyId ||
                String(employee.company.companyId) === String(defaultCompanyId)
              );
              return matchesCompany;
            }
          );
          console.log("Filtered employees for company:", defaultCompanyId, "Result:", filtered.length);
        } else {
          // If no default company, show all employees for now
          console.warn("No defaultCompanyId set, showing all employees");
        }
      }

      setUsers(
        filtered.map((e) => ({
          key: e.employeeID,
          ...e,
        }))
      );
      setTotal(totalPages * pageSize);
    } catch (err) {
      console.error("Error fetching employees:", err);
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      setLoading(true);
      const success = await deleteEmployee(employeeId);
      if (success) {
        message.success("Employee deleted successfully");
        await fetchData(1, 10);
      } else {
        message.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      message.error("An error occurred while deleting employee");
    } finally {
      setLoading(false);
    }
  };

  const handleProfitAndLoss = (id) => navigate(`/profit-loss/${id}`);
  const handleViewTracking = (id) => navigate(`/tracking/${id}`);
  const handleEditEmployee = (id) => navigate(`/editemployee/${id}`);
  const handleAddLeaveBalance = (id) => navigate(`/addleavebalance/${id}`);
  const handleViewPurchaseOrders = (id) => navigate(`/orders/${id}`);

  const handleDownloadFiles = async (employeeId) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${apiUrl}/employees/prospectFiles/${employeeId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch files");
      const files = await res.json();
      setFileList(files);
      setSelectedEmployeeId(employeeId);
      setFileModalVisible(true);
    } catch (error) {
      console.error("Error fetching files:", error);
      message.error("Could not fetch files");
    }
  };

  const downloadFile = async (fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${apiUrl}/employees/prospectFiles/${selectedEmployeeId}/${fileName}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("File download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      message.success("File downloaded");
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("File download failed");
    }
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email ID",
      dataIndex: "emailID",
      sorter: (a, b) => a.emailID.localeCompare(b.emailID),
    },
    {
      title: "Company",
      render: (record) => (record.company ? record.company.companyName : "N/A"),
    },
    {
      title: "Phone No",
      dataIndex: "phoneNo",
    },
    {
      title: "Working Status",
      dataIndex: "onBench",
    },
    {
      title: "Actions",
      render: (record) => {
        const items = [
          {
            key: "edit",
            label: (
              <span>
                <FiEdit2 style={{ marginRight: 8 }} /> Edit
              </span>
            ),
            onClick: () => handleEditEmployee(record.employeeID),
          },
          {
            key: "leave",
            label: (
              <span>
                <IoIosPause style={{ marginRight: 8 }} /> Add Leave Balance
              </span>
            ),
            onClick: () => handleAddLeaveBalance(record.employeeID),
          },
          {
            key: "tracking",
            label: (
              <span>
                <BiDollar style={{ marginRight: 8 }} /> Withhold Tracker
              </span>
            ),
            onClick: () => handleViewTracking(record.employeeID),
          },
          {
            key: "download",
            label: (
              <span>
                <MdFileDownload style={{ marginRight: 8 }} /> Download Files
              </span>
            ),
            onClick: () => handleDownloadFiles(record.employeeID),
          },
          {
            key: "profit",
            label: (
              <span>
                <GiTakeMyMoney style={{ marginRight: 8 }} /> Profit & Loss
              </span>
            ),
            onClick: () => handleProfitAndLoss(record.employeeID),
          },
          {
            key: "orders",
            label: (
              <span>
                <IoCartSharp style={{ marginRight: 8 }} /> View Purchase Orders
              </span>
            ),
            onClick: () => handleViewPurchaseOrders(record.employeeID),
          },
          {
            key: "delete",
            label: (
              <span style={{ color: "#ff4d4f" }}>
                <AiFillDelete style={{ marginRight: 8 }} /> Delete
              </span>
            ),
            onClick: () =>
              Modal.confirm({
                title: "Delete employee?",
                content: "This action cannot be undone.",
                onOk: () => handleDeleteEmployee(record.employeeID),
              }),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
          </Dropdown>
        );
      },
    },
  ];

  const onChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <AnimatedPageWrapper>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "16px 0 28px 0",
          margin: "0 28px",
        }}
      >
        <Title level={4} style={{ textAlign: "center" }}>
          Employee Details
        </Title>

        <TableFilter />

        {/* Top Buttons - on opposite sides */}
        <div
          style={{
            marginLeft: 30,
            marginRight: 30,
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link to="/adduser" style={{ textDecoration: "none" }}>
            <Button style={primaryActionBtn} icon={<BsFillPersonPlusFill />}>
              Add Employee
            </Button>
          </Link>

          <Link to="/addprospect" style={{ textDecoration: "none" }}>
            <Button style={primaryActionBtn} icon={<AiOutlineUsergroupAdd />}>
              Prospect Employee
            </Button>
          </Link>
        </div>

        <ReusableTable
          columns={columns}
          data={users}
          loading={loading}
          total={total}
          onChange={onChange}
          pagination={true}
        />
      </Card>

      {/* File Download Modal */}
      <Modal
        title="Available Files"
        open={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        footer={null}
        width={600}
      >
        {fileList.length > 0 ? (
          <List
            dataSource={fileList}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => downloadFile(file)}>
                    Download
                  </Button>,
                ]}
              >
                {file}
              </List.Item>
            )}
          />
        ) : (
          <p>No files found.</p>
        )}
      </Modal>
    </AnimatedPageWrapper>
  );
}
