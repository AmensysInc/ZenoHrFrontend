import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Button, Typography, Space, message } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import { getUserDetails } from "../SharedComponents/services/OrderService";
import { getProjectsForEmployee } from "../SharedComponents/services/ProjectHistoryService";

const { Title, Text } = Typography;

export default function ProjectHistory() {
  const [projectHistory, setProjectHistory] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { employeeId } = useParams();

  useEffect(() => {
    fetchProjectHistory();
  }, [currentPage, pageSize]);

  const fetchProjectHistory = async () => {
    try {
      setLoading(true);
      const user = await getUserDetails(employeeId);
      setEmployeeName(`${user.firstName || ""} ${user.lastName || ""}`.trim());

      const data = await getProjectsForEmployee(employeeId, currentPage, pageSize);
      setProjectHistory(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error loading project history:", error);
      message.error("Failed to load project history");
    } finally {
      setLoading(false);
    }
  };

  const handleEditHistory = (employeeId, projectId) => {
    navigate(`/editemployee/${employeeId}/project-history/${projectId}/editproject`);
  };

  const handleAddProject = (employeeId) => {
    navigate(`/editemployee/${employeeId}/project-history/add-project`);
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + currentPage * pageSize,
      width: 80,
      align: "center",
    },
    {
      title: "Vendor One",
      dataIndex: "subVendorOne",
      key: "subVendorOne",
    },
    {
      title: "Vendor Two",
      dataIndex: "subVendorTwo",
      key: "subVendorTwo",
    },
    {
      title: "Project Address",
      dataIndex: "projectAddress",
      key: "projectAddress",
    },
    {
      title: "Project Start Date",
      dataIndex: "projectStartDate",
      key: "projectStartDate",
    },
    {
      title: "Project End Date",
      dataIndex: "projectEndDate",
      key: "projectEndDate",
    },
    {
      title: "Project Status",
      dataIndex: "projectStatus",
      key: "projectStatus",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <FiEdit2
            size={18}
            title="Edit Project History"
            style={{ cursor: "pointer", color: "#4f46e5" }}
            onClick={() => handleEditHistory(employeeId, record.projectId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: 20,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={4} style={{ color: "#4f46e5", marginBottom: 5 }}>
          {employeeName || "Employee"}
        </Title>
        <Text type="secondary">Project History</Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          icon={<BiSolidAddToQueue size={16} />}
          onClick={() => handleAddProject(employeeId)}
        >
          Add Project
        </Button>
      </div>

      <Table
        bordered
        columns={columns}
        dataSource={projectHistory}
        loading={loading}
        pagination={{
          current: currentPage + 1,
          pageSize,
          total: totalPages * pageSize,
          onChange: (page) => setCurrentPage(page - 1),
          showSizeChanger: true,
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
        locale={{
          emptyText: "No project history found.",
        }}
        rowKey="projectId"
      />
    </Card>
  );
}
