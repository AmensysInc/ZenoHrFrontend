import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Space,
  Button,
  Input,
  Typography,
  message,
  Popconfirm,
  Tooltip,
  Empty,
  Row,
  Col,
} from "antd";
import {
  FileTextOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

export default function EmployeeFilesGrid() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch files from API
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API_URL}/employees/prospectFiles/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
      setFilteredFiles(res.data);
    } catch (err) {
      message.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Filter files based on search
  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredFiles(files);
      return;
    }

    const filtered = files.filter(
      (f) =>
        f.fileName?.toLowerCase().includes(search.toLowerCase()) ||
        f.uploadedBy?.toLowerCase().includes(search.toLowerCase()) ||
        f.employeeID?.toString().includes(search)
    );
    setFilteredFiles(filtered);
  };

  const handleReset = () => {
    setSearch("");
    setFilteredFiles(files);
  };

  // Auto-search when search input is cleared
  useEffect(() => {
    if (search === "") {
      setFilteredFiles(files);
    }
  }, [search, files]);

  // Download file
  const handleDownload = async (employeeID, fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/employees/prospectFiles/${employeeID}/${fileName}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      message.error("Failed to download file");
    }
  };

  // Delete file
  const handleDelete = async (employeeID, fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `${API_URL}/employees/prospectFiles/${employeeID}/${fileName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles((prev) =>
        prev.filter(
          (f) => !(f.employeeID === employeeID && f.fileName === fileName)
        )
      );
      setFilteredFiles((prev) =>
        prev.filter(
          (f) => !(f.employeeID === employeeID && f.fileName === fileName)
        )
      );
      message.success("File deleted successfully!");
    } catch {
      message.error("Failed to delete file");
    }
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (text) => (
        <Space>
          <FileTextOutlined style={{ color: "#1677ff" }} />
          {text}
        </Space>
      ),
    },
    { title: "Uploaded By", dataIndex: "uploadedBy", key: "uploadedBy" },
    {
      title: "Uploaded Date & Time",
      dataIndex: "uploadTime",
      key: "uploadTime",
      render: (time) =>
        time
          ? new Date(
              time[0],
              time[1] - 1,
              time[2],
              time[3],
              time[4],
              time[5]
            ).toLocaleString()
          : "-",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Download">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => handleDownload(record.employeeID, record.fileName)}
            />
          </Tooltip>
          <Popconfirm
            title={`Delete "${record.fileName}"?`}
            description="Are you sure you want to delete this file?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.employeeID, record.fileName)}
          >
            <Tooltip title="Delete">
              <Button type="danger" icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        className="shadow-lg rounded-2xl"
        title={
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Space>
                <FileTextOutlined style={{ fontSize: 26, color: "#1677ff" }} />
                <Title level={4} style={{ margin: 0 }}>
                  Employee Files
                </Title>
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={16}>
              <Row gutter={[8, 8]} justify="end" align="middle">
                <Col xs={24} sm={16} md={12} lg={14}>
                  <Input
                    placeholder="Search by file name, employee name, or ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    prefix={<SearchOutlined />}
                    onPressEnter={handleSearch}
                    size="large"
                  />
                </Col>
                <Col xs={24} sm={8} md={12} lg={10}>
                  <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={handleReset}
                      size="large"
                    >
                      Reset
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<SearchOutlined />} 
                      onClick={handleSearch}
                      size="large"
                    >
                      Search
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredFiles}
          rowKey={(record) => `${record.employeeID}-${record.fileName}`}
          loading={loading}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
          }}
          locale={{ emptyText: <Empty description="No files found" /> }}
        />
      </Card>
    </div>
  );
}