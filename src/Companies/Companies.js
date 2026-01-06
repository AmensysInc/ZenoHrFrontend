import React, { useState, useEffect } from "react";
import { Card, Table, Typography, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import {
  fetchCompanies,
  deleteCompanies,
} from "../SharedComponents/services/CompaniesServies";

const { Title } = Typography;

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

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
    navigate(`/editcompany/${id}`);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      filters: [
        ...new Set(companies.map((c) => c.companyName).filter(Boolean)),
      ].map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.companyName === value,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <FiEdit2
            title="Edit"
            className="icon-mac icon-edit"
            onClick={() => handleEditCompany(record.companyId)}
          />
          <Popconfirm
            title="Delete this company?"
            onConfirm={() => handleDeleteCompany(record.companyId)}
          >
            <AiFillDelete title="Delete" className="icon-mac icon-delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: 16,
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Title
          level={4}
          style={{
            color: "#4f46e5",
            fontWeight: 700,
            letterSpacing: 0.5,
            marginBottom: 0,
          }}
        >
          Company Details
        </Title>

        {/* <Space>
          <Link to="/addcompany">
            <Button type="primary" icon={<BsFillPersonPlusFill />}>
              Add Company
            </Button>
          </Link>
        </Space> */}
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={companies}
        loading={loading}
        onChange={onChange}
        pagination={{
          total,
          showSizeChanger: true,
        }}
        bordered
      />
    </Card>
  );
}
