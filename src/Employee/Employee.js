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
  const defaultCompanyId = Number(sessionStorage.getItem("defaultCompanyId"));
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
    return () => window.removeEventListener('error', handleError);
  }, []);

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const { content, totalPages } = await fetchEmployees(page - 1, pageSize);

      const loggedInUserId = sessionStorage.getItem("id");
      let filtered = content;

      if (loggedInUserId !== "admin_id") {
        filtered = content.filter(
          (employee) =>
            employee.company &&
            employee.company.companyId === defaultCompanyId
        );
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
              <span onClick={() => handleEditEmployee(record.employeeID)}>
                <FiEdit2 style={{ marginRight: 8 }} /> Edit
              </span>
            ),
          },
          {
            key: "leave",
            label: (
              <span onClick={() => handleAddLeaveBalance(record.employeeID)}>
                <IoIosPause style={{ marginRight: 8 }} /> Add Leave Balance
              </span>
            ),
          },
          {
            key: "tracking",
            label: (
              <span onClick={() => handleViewTracking(record.employeeID)}>
                <BiDollar style={{ marginRight: 8 }} /> Withhold Tracker
              </span>
            ),
          },
          {
            key: "download",
            label: (
              <span onClick={() => handleDownloadFiles(record.employeeID)}>
                <MdFileDownload style={{ marginRight: 8 }} /> Download Files
              </span>
            ),
          },
          {
            key: "profit",
            label: (
              <span onClick={() => handleProfitAndLoss(record.employeeID)}>
                <GiTakeMyMoney style={{ marginRight: 8 }} /> Profit & Loss
              </span>
            ),
          },
          {
            key: "orders",
            label: (
              <span onClick={() => handleViewPurchaseOrders(record.employeeID)}>
                <IoCartSharp style={{ marginRight: 8 }} /> View Purchase Orders
              </span>
            ),
          },
          {
            key: "delete",
            label: (
              <span
                onClick={() =>
                  Modal.confirm({
                    title: "Delete employee?",
                    content: "This action cannot be undone.",
                    onOk: () => handleDeleteEmployee(record.employeeID),
                  })
                }
                style={{ color: "#ff4d4f" }}
              >
                <AiFillDelete style={{ marginRight: 8 }} /> Delete
              </span>
            ),
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

  // Header with action buttons
  const extraHeader = (
    <div
      style={{
        marginBottom: 16,
        padding: "0 28px",
        display: "flex",
        justifyContent: "flex-start",
        gap: 12,
      }}
    >
      <Link to="/adduser">
        <Button style={primaryActionBtn} icon={<BsFillPersonPlusFill />}>
          Add Employee
        </Button>
      </Link>
      <Link to="/addprospect">
        <Button style={primaryActionBtn} icon={<AiOutlineUsergroupAdd />}>
          Prospect Employee
        </Button>
      </Link>
    </div>
  );

  return (
    <AnimatedPageWrapper>
      <ReusableTable
        title="Employee Details"
        columns={columns}
        data={users}
        loading={loading}
        total={total}
        onChange={onChange}
        pagination={true}
        extraHeader={extraHeader}
      />

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
