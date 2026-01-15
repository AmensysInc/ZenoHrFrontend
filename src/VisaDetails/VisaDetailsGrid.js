import React, { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import axios from "axios";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import { titleStyle } from "../constants/styles";

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

  const columns = [
    { title: "Employee Name", dataIndex: "employeeName" },
    { title: "Visa Type", dataIndex: "visaType" },
    {
      title: "Start Date",
      dataIndex: "visaStartDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Expiry Date",
      dataIndex: "visaExpiryDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "I-94 Date",
      dataIndex: "i94Date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    { title: "Job Title", dataIndex: "jobTitle" },
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
          Visa Details (All Employees)
        </Title>

        <TableFilter />

        <ReusableTable
          columns={columns}
          data={visaDetails}
          loading={loading}
          total={total}
          pagination={true}
          onChange={handleTableChange}
        />
      </Card>
    </AnimatedPageWrapper>
  );
}
