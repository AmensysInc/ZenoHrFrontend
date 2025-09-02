import React, { useEffect, useState } from "react";
import { Table, Input, Space, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;
const { Search } = Input;

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchString, setSearchString] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchProjects = async (pageNumber = page, pageSize = size, search = searchString) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pageNumber - 1,
          size: pageSize,
          searchField: "employeeName",
          searchString: search
        }
      });

      setProjects(response.data.content);
      setTotal(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects(page, size, searchString);
  }, [page, size, searchString]);

  const columns = [
    { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
    { title: "Sub Vendor 1", dataIndex: "subVendorOne", key: "subVendorOne" },
    { title: "Sub Vendor 2", dataIndex: "subVendorTwo", key: "subVendorTwo" },
    { title: "Address", dataIndex: "projectAddress", key: "projectAddress" },
    {
      title: "Start Date",
      dataIndex: "projectStartDate",
      key: "projectStartDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "-"
    },
    {
      title: "End Date",
      dataIndex: "projectEndDate",
      key: "projectEndDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "-"
    },
    { title: "Status", dataIndex: "projectStatus", key: "projectStatus" }
  ];

  const handleSearch = (value) => {
    setSearchString(value);
    setPage(1);
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>All Projects</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by employee name"
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="projectId"
        loading={loading}
        pagination={{
          current: page,
          pageSize: size,
          total: total,
          onChange: (p, ps) => {
            setPage(p);
            setSize(ps);
          }
        }}
        bordered
      />
    </div>
  );
}
