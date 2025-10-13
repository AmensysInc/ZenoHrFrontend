import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineReload } from "react-icons/ai";
import dayjs from "dayjs";

const { Title } = Typography;

export default function PurchaseOrders() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [recruiters, setRecruiters] = useState([]);

  // Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    loadRecruiters();
  }, []);

  const fetchOrders = async (page, size) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/orders?page=${page - 1}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setOrders(
        data.content.map((order) => ({
          key: order.id,
          ...order,
        }))
      );
      setTotal(data.totalElements || data.totalPages * size);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecruiters = async () => {
    try {
      const res = await fetch("http://localhost:8082/users");
      const data = await res.json();
      setRecruiters(data.filter((u) => u.role === "RECRUITER"));
    } catch (error) {
      console.error("Error loading recruiters:", error);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    form.setFieldsValue({
      employeeFirstName: order.employeeFirstName,
      employeeLastName: order.employeeLastName,
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
    {
      title: "First Name",
      dataIndex: "employeeFirstName",
      sorter: (a, b) => a.employeeFirstName.localeCompare(b.employeeFirstName),
    },
    {
      title: "Last Name",
      dataIndex: "employeeLastName",
      sorter: (a, b) => a.employeeLastName.localeCompare(b.employeeLastName),
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      sorter: (a, b) =>
        new Date(a.dateOfJoining) - new Date(b.dateOfJoining),
    },
    {
      title: "Project End Date",
      dataIndex: "projectEndDate",
      sorter: (a, b) =>
        new Date(a.projectEndDate) - new Date(b.projectEndDate),
    },
    {
      title: "Bill Rate",
      dataIndex: "billRate",
    },
    {
      title: "Client Name",
      dataIndex: "endClientName",
      filters: [
        ...new Set(orders.map((o) => o.endClientName).filter(Boolean)),
      ].map((c) => ({ text: c, value: c })),
      onFilter: (value, record) => record.endClientName === value,
    },
    {
      title: "Vendor Phone No",
      dataIndex: "vendorPhoneNo",
    },
    {
      title: "Vendor Email",
      dataIndex: "vendorEmailId",
    },
    {
      title: "Net Terms",
      dataIndex: "netTerms",
      filters: [
        ...new Set(orders.map((o) => o.netTerms).filter(Boolean)),
      ].map((t) => ({ text: t, value: t })),
      onFilter: (value, record) => record.netTerms === value,
    },
    {
      title: "Recruiter",
      dataIndex: "recruiterName",
      filters: recruiters.map((r) => ({
        text: `${r.firstname} ${r.lastname}`,
        value: `${r.firstname} ${r.lastname}`,
      })),
      onFilter: (value, record) => record.recruiterName === value,
    },
    {
      title: "Actions",
      render: (record) => (
        <Space size="middle">
          <FiEdit2
            onClick={() => handleEdit(record)}
            title="Edit"
            style={{ cursor: "pointer" }}
          />
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <Card>
      <Title level={4} style={{ textAlign: "center" }}>
        Purchase Orders
      </Title>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Button
          type="default"
          icon={<AiOutlineReload />}
          onClick={() => fetchOrders(1, pageSize)}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{
          current: page,
          total,
          showSizeChanger: true,
          pageSize,
        }}
        bordered
        onChange={handleTableChange}
      />

      {/* Update Modal */}
      <Modal
        title="Update Purchase Order"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="employeeFirstName" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="employeeLastName" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="dateOfJoining" label="Date Of Joining">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="projectEndDate" label="Project End Date">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="billRate" label="Bill Rate">
            <Input />
          </Form.Item>
          <Form.Item name="endClientName" label="Client Name">
            <Input />
          </Form.Item>
          <Form.Item name="vendorPhoneNo" label="Vendor Phone No">
            <Input />
          </Form.Item>
          <Form.Item name="vendorEmailId" label="Vendor Email">
            <Input />
          </Form.Item>
          <Form.Item name="netTerms" label="Net Terms">
            <Input />
          </Form.Item>
          <Form.Item name="recruiterName" label="Recruiter">
            <Select placeholder="Select Recruiter">
              {recruiters.map((r) => (
                <Select.Option key={r.id} value={`${r.firstname} ${r.lastname}`}>
                  {r.firstname} {r.lastname}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
