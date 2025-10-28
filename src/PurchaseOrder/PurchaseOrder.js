import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table, Typography, Button, Space, message } from "antd";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { getOrdersForEmployee, getUserDetails } from "../SharedComponents/services/OrderService";

const { Title, Text } = Typography;

export default function PurchaseOrder() {
  const [orders, setOrders] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { employeeId } = useParams();

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const [ordersData, userDetails] = await Promise.all([
        getOrdersForEmployee(employeeId, currentPage, pageSize),
        getUserDetails(employeeId),
      ]);

      const fullName = `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim();
      setEmployeeName(fullName);
      setOrders(ordersData.content || []);
      setTotalPages(ordersData.totalPages || 1);
    } catch (error) {
      console.error("Error loading orders:", error);
      message.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => navigate(`/orders/${employeeId}/addorder`);
  const handleEditOrder = (orderId) =>
    navigate(`/orders/${employeeId}/${orderId}/editorder`);

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + currentPage * pageSize,
      width: 80,
      align: "center",
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      key: "dateOfJoining",
    },
    {
      title: "Project End Date",
      dataIndex: "projectEndDate",
      key: "projectEndDate",
    },
    {
      title: "Bill Rate",
      dataIndex: "billRate",
      key: "billRate",
      align: "center",
      render: (rate) => (rate ? `$${rate}` : "-"),
    },
    {
      title: "Client Name",
      dataIndex: "endClientName",
      key: "endClientName",
    },
    {
      title: "Vendor Phone No",
      dataIndex: "vendorPhoneNo",
      key: "vendorPhoneNo",
    },
    {
      title: "Vendor Email ID",
      dataIndex: "vendorEmailId",
      key: "vendorEmailId",
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <FiEdit2
            onClick={() => handleEditOrder(record.orderId)}
            title="Edit Order"
            style={{ cursor: "pointer", color: "#4f46e5" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: 24,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={4} style={{ color: "#4f46e5", marginBottom: 4 }}>
          Purchase Orders
        </Title>
        <Text type="secondary">
          {employeeName ? `Employee: ${employeeName}` : "Employee Details"}
        </Text>
      </div>

      {/* Add Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          icon={<BiSolidAddToQueue size={16} />}
          onClick={handleAddOrder}
        >
          Add Order
        </Button>
      </div>

      {/* Orders Table */}
      <Table
        bordered
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="orderId"
        pagination={{
          current: currentPage + 1,
          total: totalPages * pageSize,
          pageSize,
          showSizeChanger: true,
          onChange: (page) => setCurrentPage(page - 1),
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
        locale={{
          emptyText: "No purchase orders found.",
        }}
      />
    </Card>
  );
}
