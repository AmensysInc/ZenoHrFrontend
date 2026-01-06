import React, { useState, useEffect } from "react";
import { Space, Popconfirm, message } from "antd";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

import {
  fetchCompanies,
  deleteCompanies,
} from "../SharedComponents/services/CompaniesServies";

import ReusableTable from "../components/ReusableTable";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const { content, totalPages } = await fetchCompanies(page - 1, pageSize);
      setCompanies(content.map((c) => ({ key: c.companyId, ...c })));
      setTotal(totalPages * pageSize);
    } catch (error) {
      message.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      const success = await deleteCompanies(companyId);
      if (success) {
        message.success("Company deleted successfully");
        fetchData(1, 10);
      } else {
        message.error("Failed to delete company");
      }
    } catch (error) {
      message.error("Error deleting company");
    }
  };

  const handleEditCompany = (id) => {
    window.location.href = `/editcompany/${id}`;
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => email || "-",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <AiFillEdit
            style={{ color: "#000", cursor: "pointer", fontSize: 18 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2b2be8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
            onClick={() => handleEditCompany(record.companyId)}
            title="Edit"
          />

          <Popconfirm
            title="Delete this company?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteCompany(record.companyId)}
            okText="Yes"
            cancelText="No"
          >
            <AiFillDelete
              style={{ color: "#000", cursor: "pointer", fontSize: 18 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <AnimatedPageWrapper>
      <ReusableTable
        title="Company Details"
        columns={columns}
        data={companies}
        loading={loading}
        total={total}
        onChange={onChange}
        pagination={true}
      />
    </AnimatedPageWrapper>
  );
}
