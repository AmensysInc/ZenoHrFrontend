import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  Card,
  Typography,
  Space,
  Button,
  Modal,
  List,
  message,
  Popconfirm,
} from "antd";
import { BiDollar } from "react-icons/bi";
import { IoIosPause } from "react-icons/io";
import { IoCartSharp } from "react-icons/io5"; // 🛒 <-- Added new icon
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdFileDownload } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import {
  deleteEmployee,
  fetchEmployees,
} from "../SharedComponents/services/EmployeeServices";
import "./Employee.css";

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

  useEffect(() => {
    fetchData(1, 10);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const success = await deleteEmployee(employeeId);
    if (success) {
      message.success("Employee deleted successfully");
      fetchData(1, 10);
    } else {
      message.error("Failed to delete employee");
    }
  };

  const handleProfitAndLoss = (id) => navigate(`/profit-loss/${id}`);
  const handleViewTracking = (id) => navigate(`/tracking/${id}`);
  const handleEditEmployee = (id) => navigate(`/editemployee/${id}`);
  const handleAddLeaveBalance = (id) => navigate(`/addleavebalance/${id}`);
  const handleViewPurchaseOrders = (id) => navigate(`/orders/${id}`); // 🛒 new route handler

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
      filters: [
        ...new Set(users.map((u) => u.company?.companyName).filter(Boolean)),
      ].map((c) => ({ text: c, value: c })),
      onFilter: (value, record) => record.company?.companyName === value,
    },
    {
      title: "Phone No",
      dataIndex: "phoneNo",
    },
    {
      title: "Working Status",
      dataIndex: "onBench",
      filters: [
        { text: "Working", value: "Working" },
        { text: "On Bench", value: "On Bench" },
      ],
      onFilter: (value, record) => record.onBench === value,
    },
    {
      title: "Actions",
      render: (record) => (
        <Space size="middle">
          <FiEdit2
            onClick={() => handleEditEmployee(record.employeeID)}
            title="Edit"
            className="icon-mac icon-edit"
          />
          <IoIosPause
            onClick={() => handleAddLeaveBalance(record.employeeID)}
            title="Add Leave Balance"
            className="icon-mac icon-leave"
          />
          <BiDollar
            onClick={() => handleViewTracking(record.employeeID)}
            title="WithHold Tracking"
            className="icon-mac icon-tracking"
          />
          <MdFileDownload
            onClick={() => handleDownloadFiles(record.employeeID)}
            title="Download Files"
            className="icon-mac icon-download"
          />
          <GiTakeMyMoney
            onClick={() => handleProfitAndLoss(record.employeeID)}
            title="Profit & Loss"
            className="icon-mac icon-profit"
          />
          <IoCartSharp
            onClick={() => handleViewPurchaseOrders(record.employeeID)}
            title="View Purchase Orders"
            className="icon-mac icon-cart"
          />

          <Popconfirm
            title="Delete this employee?"
            onConfirm={() => handleDeleteEmployee(record.employeeID)}
          >
            <AiFillDelete title="Delete" className="icon-mac icon-delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: 16,
      }}
    >
      <Title
        level={4}
        style={{
          textAlign: "center",
          color: "#4f46e5",
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        Employee Details
      </Title>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Link to="/adduser">
          <Button type="primary" icon={<BsFillPersonPlusFill />}>
            Add Employee
          </Button>
        </Link>
        <Link to="/addprospect">
          <Button type="dashed" icon={<AiOutlineUsergroupAdd />}>
            Prospect Employee
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        onChange={onChange}
        pagination={{
          total,
          showSizeChanger: true,
        }}
        bordered
      />

      <Modal
        title="Available Files"
        open={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        footer={null}
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
    </Card>
  );
}
