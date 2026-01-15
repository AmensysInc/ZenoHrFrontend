import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { AiFillEdit } from "react-icons/ai";
import dayjs from "dayjs";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import { titleStyle } from "../constants/styles";

const { Title } = Typography;
const { Option } = Select;

export default function PurchaseOrders() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  // Fetch Orders
  const fetchOrders = async (page, size) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/orders?page=${page - 1}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const mappedOrders = data.content.map((order) => ({
        key: order.id,
        employeeName: `${order.employeeFirstName || ""} ${order.employeeLastName || ""}`.trim(),
        ...order,
      }));

      setOrders(mappedOrders);
      setFilteredOrders(mappedOrders);
      setTotal(data.totalElements || data.totalPages * size);
    } catch (error) {
      console.error("Error loading orders:", error);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    form.setFieldsValue({
      employeeName: order.employeeName,
      dateOfJoining: order.dateOfJoining ? dayjs(order.dateOfJoining) : null,
      projectEndDate: order.projectEndDate ? dayjs(order.projectEndDate) : null,
      billRate: order.billRate,
      endClientName: order.endClientName,
      vendorPhoneNo: order.vendorPhoneNo,
      vendorEmailId: order.vendorEmailId,
      netTerms: order.netTerms,
      recruiterName: order.recruiterName,
    });
    setIsModalOpen(true);
  };

  // Update Order
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...editingOrder,
        ...values,
        dateOfJoining: values.dateOfJoining
          ? values.dateOfJoining.format("YYYY-MM-DD")
          : null,
        projectEndDate: values.projectEndDate
          ? values.projectEndDate.format("YYYY-MM-DD")
          : null,
      };

      await fetch(`${apiUrl}/orders/${editingOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      message.success("Purchase order updated successfully");
      setIsModalOpen(false);
      setEditingOrder(null);
      fetchOrders(page, pageSize);
    } catch (error) {
      console.error("Error updating order:", error);
      message.error("Failed to update order");
    }
  };

  const columns = [
    { title: "Employee Name", dataIndex: "employeeName" },
    { title: "Date of Joining", dataIndex: "dateOfJoining" },
    { title: "Project End Date", dataIndex: "projectEndDate" },
    {
      title: "Bill Rate",
      dataIndex: "billRate",
      align: "center",
      render: (rate) => (rate ? `$${rate}` : "-"),
    },
    { title: "Client Name", dataIndex: "endClientName" },
    { title: "Vendor Phone No", dataIndex: "vendorPhoneNo" },
    { title: "Vendor Email", dataIndex: "vendorEmailId" },
    { title: "Net Terms", dataIndex: "netTerms" },
    { title: "Recruiter", dataIndex: "recruiterName" },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Button
          type="link"
          icon={<AiFillEdit />}
          onClick={() => handleEdit(record)}
          style={{ color: "black" }}
        ></Button>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
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
          Purchase Orders
        </Title>

        <TableFilter />

        <ReusableTable
          columns={columns}
          data={filteredOrders}
          loading={loading}
          total={total}
          onChange={handleTableChange}
          pagination={true}
        />

        <Modal
          title={<span>Update Purchase Order</span>}
          open={isModalOpen}
          onOk={handleUpdate}
          onCancel={() => setIsModalOpen(false)}
          okText="Update"
          width={700}
          centered
        >
          <Form form={form} layout="vertical" size="middle">
            {/* modal fields unchanged */}
          </Form>
        </Modal>
      </Card>
    </AnimatedPageWrapper>
  );
}
