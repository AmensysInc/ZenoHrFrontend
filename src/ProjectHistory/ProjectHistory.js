import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Space, Tooltip, message } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import { getUserDetails } from "../SharedComponents/services/OrderService";
import { getProjectsForEmployee } from "../SharedComponents/services/ProjectHistoryService";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";

const { Title } = Typography;

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
      render: (_, record) => (
        <Tooltip title="Edit Project">
          <Button
            type="text"
            icon={<FiEdit2 size={18} />}
            onClick={() => handleEditHistory(employeeId, record.projectId)}
          />
        </Tooltip>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current - 1);
    setPageSize(pagination.pageSize);
  };

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card bordered className="shadow-sm">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={4} className="m-0">
              {employeeName || "Employee"} — Project History
            </Title>
            <Button
              type="primary"
              icon={<BiSolidAddToQueue size={16} />}
              onClick={() => handleAddProject(employeeId)}
            >
              Add Project
            </Button>
          </div>

          <ReusableTable
            columns={columns}
            data={projectHistory}
            rowKey="projectId"
            loading={loading}
            total={totalPages * pageSize}
            pagination={true}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
