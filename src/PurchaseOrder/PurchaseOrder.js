import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography, Button, Tooltip, message } from "antd";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { getOrdersForEmployee, getUserDetails } from "../SharedComponents/services/OrderService";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";

const { Title } = Typography;

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
      render: (_, record) => (
        <Tooltip title="Edit Order">
          <Button
            type="text"
            icon={<FiEdit2 size={18} />}
            onClick={() => handleEditOrder(record.orderId)}
          />
        </Tooltip>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current - 1);
    setPageSize(pagination.pageSize);
  };

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card bordered className="shadow-sm">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {employeeName ? `${employeeName} — Purchase Orders` : "Purchase Orders"}
            </Title>
            <Button
              type="primary"
              icon={<BiSolidAddToQueue size={16} />}
              onClick={handleAddOrder}
            >
              Add Order
            </Button>
          </div>

          <ReusableTable
            columns={columns}
            data={orders}
            rowKey="orderId"
            loading={loading}
            total={totalPages * pageSize}
            pagination={true}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
