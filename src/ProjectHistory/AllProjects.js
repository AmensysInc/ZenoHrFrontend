import React, { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import axios from "axios";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  // Fetch projects
  const fetchProjects = async (pageNumber = page, pageSize = size) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pageNumber - 1,
          size: pageSize,
        },
      });
      setProjects(
        response.data.content.map((proj) => ({
          key: proj.projectId,
          ...proj,
        }))
      );
      setTotal(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page, size);
    // eslint-disable-next-line
  }, [page, size]);

  const columns = [
    { title: "Employee Name", dataIndex: "employeeName" },
    { title: "Sub Vendor 1", dataIndex: "subVendorOne" },
    { title: "Sub Vendor 2", dataIndex: "subVendorTwo" },
    { title: "Address", dataIndex: "projectAddress" },
    {
      title: "Start Date",
      dataIndex: "projectStartDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "End Date",
      dataIndex: "projectEndDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    { title: "Status", dataIndex: "projectStatus" },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setSize(pagination.pageSize);
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
        <Title level={4} style={titleStyle}>
          All Projects
        </Title>

        <TableFilter />

        <ReusableTable
          columns={columns}
          data={projects}
          loading={loading}
          total={total}
          pagination={true}
          onChange={handleTableChange}
        />
      </Card>
    </AnimatedPageWrapper>
  );
}
