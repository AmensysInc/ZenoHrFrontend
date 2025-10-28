import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, DatePicker, Input, Button, Modal, Typography, Row, Col, message } from "antd";
import dayjs from "dayjs";
import {
  createOrder,
  fetchEmployeeDetails,
  fetchOrderDetails,
  updateOrder,
} from "../SharedComponents/services/OrderService";

const { Title } = Typography;

export default function PurchaseOrderForm({ mode }) {
  const navigate = useNavigate();
  const { orderId, employeeId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [employeeName, setEmployeeName] = useState("");
  const [order, setOrder] = useState({
    dateOfJoining: "",
    projectEndDate: "",
    billRate: "",
    endClientName: "",
    vendorPhoneNo: "",
    vendorEmailId: "",
  });

  const isEditMode = mode === "edit";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch employee details
        const employeeResponse = await fetchEmployeeDetails(employeeId);
        if (employeeResponse) {
          const fullName = `${employeeResponse.firstName || ""} ${employeeResponse.lastName || ""}`.trim();
          setEmployeeName(fullName);
        }

        // Fetch order details if editing
        if (isEditMode && orderId) {
          const orderResponse = await fetchOrderDetails(orderId);
          if (orderResponse) setOrder(orderResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load order data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode, employeeId, orderId]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const onInputChangeDate = (date, name) => {
    setOrder((prev) => ({
      ...prev,
      [name]: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const success = isEditMode
        ? await updateOrder(orderId, order)
        : await createOrder(employeeId, order);

      if (success) setIsModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error saving order");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => navigate(`/orders/${employeeId}`);

  const handleModalClose = () => {
    setIsModalOpen(false);
    handleNavigate();
  };

  return (
    <Card
      loading={loading}
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: 24,
        maxWidth: 800,
        margin: "30px auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={4} style={{ color: "#4f46e5", marginBottom: 4 }}>
          {isEditMode ? "Edit Purchase Order" : "Add Purchase Order"}
        </Title>
        <p style={{ color: "#555", marginBottom: 0 }}>
          {employeeName ? `Employee: ${employeeName}` : "Employee Details"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <label className="form-label">Project Start Date</label>
            <DatePicker
              className="w-100"
              value={order.dateOfJoining ? dayjs(order.dateOfJoining) : null}
              onChange={(d) => onInputChangeDate(d, "dateOfJoining")}
              format="YYYY-MM-DD"
              required
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Project End Date</label>
            <DatePicker
              className="w-100"
              value={order.projectEndDate ? dayjs(order.projectEndDate) : null}
              onChange={(d) => onInputChangeDate(d, "projectEndDate")}
              format="YYYY-MM-DD"
              required
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Bill Rate ($)</label>
            <Input
              type="number"
              name="billRate"
              value={order.billRate}
              onChange={onInputChange}
              placeholder="Enter Bill Rate"
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Client Name</label>
            <Input
              name="endClientName"
              value={order.endClientName}
              onChange={onInputChange}
              placeholder="Enter Client Name"
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Vendor Phone No</label>
            <Input
              name="vendorPhoneNo"
              value={order.vendorPhoneNo}
              onChange={onInputChange}
              placeholder="Enter Vendor Phone"
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Vendor Email ID</label>
            <Input
              name="vendorEmailId"
              type="email"
              value={order.vendorEmailId}
              onChange={onInputChange}
              placeholder="Enter Vendor Email"
            />
          </Col>
        </Row>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 24,
            gap: 12,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#4f46e5" }}
          >
            {isEditMode ? "Update Order" : "Submit Order"}
          </Button>
          <Button danger onClick={handleNavigate}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        open={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            OK
          </Button>,
        ]}
      >
        <p>
          Purchase Order {isEditMode ? "updated" : "added"} successfully for{" "}
          <strong>{employeeName}</strong>.
        </p>
      </Modal>
    </Card>
  );
}
