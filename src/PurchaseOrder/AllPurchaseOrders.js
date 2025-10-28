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
  Row,
  Col,
} from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

export default function PurchaseOrders() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [recruiters, setRecruiters] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    loadRecruiters();
  }, []);

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

  // Load Recruiters
  const loadRecruiters = async () => {
    try {
      const res = await fetch("http://localhost:8082/users");
      const data = await res.json();
      setRecruiters(data.filter((u) => u.role === "RECRUITER"));
    } catch (error) {
      console.error("Error loading recruiters:", error);
    }
  };

  // Search Handler
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredOrders(orders);
    } else {
      const lower = value.toLowerCase();
      const filtered = orders.filter((o) => o.employeeName.toLowerCase().includes(lower));
      setFilteredOrders(filtered);
    }
  };

  // Edit Modal
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

  // Table Columns
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      sorter: (a, b) => new Date(a.dateOfJoining) - new Date(b.dateOfJoining),
    },
    {
      title: "Project End Date",
      dataIndex: "projectEndDate",
      sorter: (a, b) => new Date(a.projectEndDate) - new Date(b.projectEndDate),
    },
    {
      title: "Bill Rate",
      dataIndex: "billRate",
      align: "center",
      render: (rate) => (rate ? `$${rate}` : "-"),
    },
    {
      title: "Client Name",
      dataIndex: "endClientName",
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
    },
    {
      title: "Recruiter",
      dataIndex: "recruiterName",
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Button
          type="link"
          icon={<FiEdit2 />}
          onClick={() => handleEdit(record)}
          style={{ color: "#4f46e5" }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: "0 auto",
        padding: "20px 24px",
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Title level={3} style={{ color: "#4f46e5", marginBottom: 4 }}>
            Purchase Orders
          </Title>
          <Text type="secondary">
            Manage, view, and update all employee purchase orders
          </Text>
        </div>

        {/* Search + Refresh Section */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
          <Col xs={24} sm={16} md={12}>
            <Input
              prefix={<AiOutlineSearch style={{ color: "#4f46e5" }} />}
              placeholder="Search by Employee Name"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{
                borderRadius: 8,
                height: 40,
              }}
            />
          </Col>
          <Col xs={24} sm={8} md={6} style={{ textAlign: "right", marginTop: 8 }}>
            <Button
              icon={<AiOutlineReload />}
              onClick={() => fetchOrders(1, pageSize)}
              style={{
                backgroundColor: "#4f46e5",
                color: "#fff",
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
              }}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          pagination={{
            current: page,
            total,
            showSizeChanger: true,
            pageSize,
          }}
          bordered
          size="middle"
          onChange={handleTableChange}
          locale={{ emptyText: "No purchase orders found." }}
          style={{
            borderRadius: 8,
          }}
        />
      </Card>

      {/* Update Modal */}
      <Modal
        title={<span style={{ color: "#4f46e5" }}>Update Purchase Order</span>}
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
        width={700}
        centered
      >
        <Form form={form} layout="vertical" size="middle">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="employeeName" label="Employee Name">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="recruiterName" label="Recruiter">
                <Select placeholder="Select Recruiter">
                  {recruiters.map((r) => (
                    <Option key={r.id} value={`${r.firstname} ${r.lastname}`}>
                      {r.firstname} {r.lastname}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateOfJoining" label="Date Of Joining">
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="projectEndDate" label="Project End Date">
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="billRate" label="Bill Rate">
                <Input prefix="$" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endClientName" label="Client Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vendorPhoneNo" label="Vendor Phone No">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vendorEmailId" label="Vendor Email">
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="netTerms" label="Net Terms">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
