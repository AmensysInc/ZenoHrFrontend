import React, { useEffect, useState } from "react";
import { Table, Spin, Typography, Empty } from "antd";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

export default function CompanyEmployees() {
  const { companyId } = useParams();
  const location = useLocation();
  const companyName = location.state?.companyName;

  const [withholdData, setWithholdData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchWithhold = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(
          `${API_URL}/trackings/company/${companyId}`,
          { headers }
        );
        setWithholdData(res.data || []);
      } catch (err) {
        console.error("Error fetching withhold data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWithhold();
  }, [companyId, token, API_URL]);

  if (loading) {
    return <Spin size="large" style={{ display: "block", marginTop: 50 }} />;
  }

  if (withholdData.length === 0) {
    return <Empty description="No withhold data available" />;
  }

  // Group data by employee
  const employees = {};
  withholdData.forEach((item) => {
    const key = `${item.firstName} ${item.lastName}`;
    if (!employees[key]) employees[key] = [];
    employees[key].push(item);
  });

  const tableData = Object.keys(employees).map((employeeName, idx) => ({
    key: idx,
    employeeName,
    projects: employees[employeeName],
  }));

  // Columns for employee main table
  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
    },
  ];

  // Columns for the sub-table (projects)
  const projectColumns = [
    { title: "Project", dataIndex: "projectName", key: "projectName" },
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "Actual Hours", dataIndex: "actualHours", key: "actualHours" },
    { title: "Actual Rate", dataIndex: "actualRate", key: "actualRate" },
    { title: "Actual Amt", dataIndex: "actualAmt", key: "actualAmt" },
    { title: "Paid Hours", dataIndex: "paidHours", key: "paidHours" },
    { title: "Paid Rate", dataIndex: "paidRate", key: "paidRate" },
    { title: "Paid Amt", dataIndex: "paidAmt", key: "paidAmt" },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance) => (
        <span style={{ color: balance < 0 ? "red" : "green" }}>
          {balance?.toFixed(2)}
        </span>
      ),
    },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Bill Rate", dataIndex: "billrate", key: "billrate" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>{companyName || `Company ${companyId}`} Employee Withhold</Title>
      <Table
        columns={columns}
        dataSource={tableData}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={projectColumns}
              dataSource={record.projects.map((p, i) => ({ ...p, key: i }))}
              pagination={false}
              bordered
            />
          ),
          rowExpandable: (record) => record.projects.length > 0,
        }}
        bordered
      />
    </div>
  );
}
