import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Space, Switch } from "antd";
import { AiOutlineReload } from "react-icons/ai";
import axios from "axios";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";

const { Title } = Typography;

export default function VisaDetailsGrid() {
  const [visaDetails, setVisaDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showExpired, setShowExpired] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  const fetchVisaDetails = async (pageNumber = page, pageSize = size) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/visa-details`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pageNumber - 1,
          size: pageSize,
        },
      });

      let data = response.data.content || [];
      const today = new Date().toISOString().split("T")[0];

      if (showExpired) {
        data = data
          .filter((visa) => visa.visaExpiryDate && visa.visaExpiryDate < today)
          .sort((a, b) => (a.visaExpiryDate < b.visaExpiryDate ? 1 : -1));
      } else {
        data = data.sort((a, b) =>
          (a.employeeName || "").localeCompare(b.employeeName || "")
        );
      }

      setVisaDetails(data.map((v) => ({ key: v.visaId, ...v })));
      setTotal(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching visa details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaDetails(page, size);
    // eslint-disable-next-line
  }, [page, size, showExpired]);

  // Table Columns with Filters and Sorting
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Visa Type",
      dataIndex: "visaType",
      key: "visaType",
      filters: [
        ...new Set(visaDetails.map((v) => v.visaType).filter(Boolean)),
      ].map((t) => ({ text: t, value: t })),
      onFilter: (value, record) => record.visaType === value,
    },
    {
      title: "Start Date",
      dataIndex: "visaStartDate",
      key: "visaStartDate",
      sorter: (a, b) =>
        new Date(a.visaStartDate) - new Date(b.visaStartDate),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Expiry Date",
      dataIndex: "visaExpiryDate",
      key: "visaExpiryDate",
      sorter: (a, b) =>
        new Date(a.visaExpiryDate) - new Date(b.visaExpiryDate),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "I-94 Date",
      dataIndex: "i94Date",
      key: "i94Date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      filters: [
        ...new Set(visaDetails.map((v) => v.jobTitle).filter(Boolean)),
      ].map((j) => ({ text: j, value: j })),
      onFilter: (value, record) => record.jobTitle === value,
    },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setSize(pagination.pageSize);
  };

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Visa Details (All Employees)
            </Title>
            <Space>
              <span>Show Expired Visas</span>
              <Switch checked={showExpired} onChange={setShowExpired} />
              <Button
                icon={<AiOutlineReload />}
                onClick={() => fetchVisaDetails(1, size)}
                type="primary"
              >
                Refresh
              </Button>
            </Space>
          </div>

          <ReusableTable
            columns={columns}
            data={visaDetails}
            rowKey="key"
            loading={loading}
            pagination={true}
            total={total}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
