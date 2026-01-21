import React, { useState, useEffect } from "react";
import { Card, Typography, Space, Popconfirm, message, Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import {
  fetchCompanies,
  deleteCompanies,
} from "../SharedComponents/services/CompaniesServies";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";

const { Title } = Typography;

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  
  // Get user role and selected company ID for GROUP_ADMIN
  const userRole = sessionStorage.getItem("role")?.replace(/"/g, "") || "";
  const selectedCompanyId = sessionStorage.getItem("selectedCompanyId") || sessionStorage.getItem("defaultCompanyId");

  useEffect(() => {
    fetchData(1, 10);
  }, [selectedCompanyId]); // Refetch when company changes

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      // Pass companyId for GROUP_ADMIN filtering
      const companyId = (userRole === "GROUP_ADMIN" && selectedCompanyId) ? Number(selectedCompanyId) : null;
      const { content, totalPages } = await fetchCompanies(page - 1, pageSize, "", "", companyId);
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
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<FiEdit2 size={18} />}
              onClick={() => handleEditCompany(record.companyId)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this company?"
            onConfirm={() => handleDeleteCompany(record.companyId)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<AiFillDelete size={18} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
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
              Company Details
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/addcompany")}
            >
              Add Company
            </Button>
          </div>

          <ReusableTable
            columns={columns}
            data={companies}
            rowKey="key"
            loading={loading}
            total={total}
            pagination={true}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
