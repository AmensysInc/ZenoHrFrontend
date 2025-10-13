import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Button, Space } from "antd";
import { AiOutlineReload } from "react-icons/ai";
import axios from "axios";

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

  // Table columns with filters (like Employee component)
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Sub Vendor 1",
      dataIndex: "subVendorOne",
      filters: [
        ...new Set(projects.map((p) => p.subVendorOne).filter(Boolean)),
      ].map((v) => ({ text: v, value: v })),
      onFilter: (value, record) => record.subVendorOne === value,
    },
    {
      title: "Sub Vendor 2",
      dataIndex: "subVendorTwo",
      filters: [
        ...new Set(projects.map((p) => p.subVendorTwo).filter(Boolean)),
      ].map((v) => ({ text: v, value: v })),
      onFilter: (value, record) => record.subVendorTwo === value,
    },
    {
      title: "Address",
      dataIndex: "projectAddress",
    },
    {
      title: "Start Date",
      dataIndex: "projectStartDate",
      sorter: (a, b) =>
        new Date(a.projectStartDate) - new Date(b.projectStartDate),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "End Date",
      dataIndex: "projectEndDate",
      sorter: (a, b) =>
        new Date(a.projectEndDate) - new Date(b.projectEndDate),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Status",
      dataIndex: "projectStatus",
      filters: [
        ...new Set(projects.map((p) => p.projectStatus).filter(Boolean)),
      ].map((s) => ({ text: s, value: s })),
      onFilter: (value, record) => record.projectStatus === value,
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          All Projects
        </Title>
        <Space>
          <Button
            icon={<AiOutlineReload />}
            onClick={() => fetchProjects(1, size)}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        loading={loading}
        pagination={{
          current: page,
          pageSize: size,
          total: total,
          showSizeChanger: true,
          onChange: (p, ps) => {
            setPage(p);
            setSize(ps);
          },
        }}
        bordered
      />
    </Card>
  );
}
