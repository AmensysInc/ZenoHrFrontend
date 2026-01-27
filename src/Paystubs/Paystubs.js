import React, { useEffect, useState, useMemo } from "react";
import { Card, Table, Typography, Button, message, Space, Select, Dropdown, Checkbox } from "antd";
import { DownloadOutlined, DollarOutlined, StarOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function Paystubs() {
  const [paystubs, setPaystubs] = useState([]);
  const [filteredPaystubs, setFilteredPaystubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCheckDate, setSelectedCheckDate] = useState("All");
  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
  const employeeId = sessionStorage.getItem("id");

  useEffect(() => {
    fetchPaystubs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [paystubs, selectedYear, selectedCheckDate]);

  const fetchPaystubs = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/paystubs/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaystubs(response.data || []);
      setFilteredPaystubs(response.data || []);
    } catch (error) {
      console.error("Error fetching paystubs:", error);
      message.error("Failed to load paystubs");
    } finally {
      setLoading(false);
    }
  };

  // Get unique years and check dates from paystubs
  const availableYears = useMemo(() => {
    const years = [...new Set(paystubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
    return years;
  }, [paystubs]);

  const availableCheckDates = useMemo(() => {
    const dates = [...new Set(paystubs.map(p => p.payPeriodEnd).filter(Boolean))].sort((a, b) => {
      return dayjs(b).valueOf() - dayjs(a).valueOf();
    });
    return dates;
  }, [paystubs]);

  const applyFilters = () => {
    let filtered = [...paystubs];

    // Filter by year
    if (selectedYear !== "All") {
      filtered = filtered.filter(p => p.year === parseInt(selectedYear));
    }

    // Filter by check date
    if (selectedCheckDate !== "All") {
      filtered = filtered.filter(p => p.payPeriodEnd === selectedCheckDate);
    }

    setFilteredPaystubs(filtered);
  };

  const handleDownload = async (id, fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/paystubs/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Paystub downloaded successfully");
    } catch (error) {
      console.error("Error downloading paystub:", error);
      message.error("Failed to download paystub");
    }
  };

  const handleDownloadSelected = async (format = "individual") => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one paystub to download");
      return;
    }

    if (format === "pdf") {
      // Download all selected files individually
      // Note: For true PDF combination, backend support would be needed
      message.info(`Downloading ${selectedRowKeys.length} paystub(s)...`);
      try {
        for (const id of selectedRowKeys) {
          const paystub = paystubs.find(p => p.id === id);
          if (paystub) {
            await handleDownload(id, paystub.fileName);
            // Small delay between downloads to avoid browser blocking
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        message.success(`Downloaded ${selectedRowKeys.length} paystub(s)`);
      } catch (error) {
        console.error("Error downloading paystubs:", error);
        message.error("Failed to download some paystubs");
      }
    } else {
      // Download individual files
      for (const id of selectedRowKeys) {
        const paystub = paystubs.find(p => p.id === id);
        if (paystub) {
          await handleDownload(id, paystub.fileName);
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatCheckDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("MM/DD/YYYY");
  };

  const getEmployeeName = () => {
    const firstName = sessionStorage.getItem("firstName")?.replace(/"/g, "") || "";
    const lastName = sessionStorage.getItem("lastName")?.replace(/"/g, "") || "";
    if (firstName && lastName) {
      return `${lastName}, ${firstName}`;
    }
    return firstName || lastName || "Employee";
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelectedRowKeys(selected ? filteredPaystubs.map(p => p.id) : []);
    },
  };

  const downloadMenuItems = [
    {
      key: "pdf",
      label: "Download as PDF",
      icon: <DownloadOutlined />,
      onClick: () => handleDownloadSelected("pdf"),
    },
  ];

  const columns = [
    {
      title: "Employee",
      key: "employee",
      width: 200,
      render: () => getEmployeeName(),
    },
    {
      title: "Check date",
      key: "checkDate",
      width: 150,
      render: (_, record) => formatCheckDate(record.payPeriodEnd),
      sorter: (a, b) => dayjs(a.payPeriodEnd).valueOf() - dayjs(b.payPeriodEnd).valueOf(),
    },
    {
      title: "Net pay",
      dataIndex: "netPay",
      width: 150,
      render: (amount) => (
        <span style={{ fontWeight: 600 }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => (a.netPay || 0) - (b.netPay || 0),
    },
    {
      title: "Gross earnings",
      dataIndex: "grossPay",
      width: 180,
      render: (amount) => (
        <span style={{ fontWeight: 600 }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => (a.grossPay || 0) - (b.grossPay || 0),
    },
  ];

  return (
    <AnimatedPageWrapper>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "16px 28px 28px 28px",
          margin: "0 28px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            Pay Stubs
            <StarOutlined style={{ color: "#faad14", cursor: "pointer" }} />
          </Title>
        </div>

        {/* Filters */}
        <div style={{ 
          display: "flex", 
          gap: 16, 
          marginBottom: 24, 
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 500 }}>Employee:</span>
            <span style={{ color: "#1890ff" }}>{filteredPaystubs.length}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 500 }}>Year:</span>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 120 }}
            >
              <Option value="All">All</Option>
              {availableYears.map(year => (
                <Option key={year} value={year.toString()}>{year}</Option>
              ))}
            </Select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 500 }}>Check date:</span>
            <Select
              value={selectedCheckDate}
              onChange={setSelectedCheckDate}
              style={{ width: 150 }}
            >
              <Option value="All">All</Option>
              {availableCheckDates.map(date => (
                <Option key={date} value={date}>
                  {formatCheckDate(date)}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 500 }}>Pay frequency:</span>
            <Select value="All" style={{ width: 120 }} disabled>
              <Option value="All">All</Option>
            </Select>
          </div>

          <Button 
            icon={<EditOutlined />} 
            style={{ marginLeft: "auto" }}
            onClick={() => {
              // Edit functionality can be added here
              message.info("Edit functionality coming soon");
            }}
          >
            Edit
          </Button>

          <Dropdown
            menu={{ items: downloadMenuItems }}
            trigger={["click"]}
          >
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              disabled={selectedRowKeys.length === 0}
            >
              Download
            </Button>
          </Dropdown>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredPaystubs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} paystubs`,
          }}
        />
      </Card>
    </AnimatedPageWrapper>
  );
}
