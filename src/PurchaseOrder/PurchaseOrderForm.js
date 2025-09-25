import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import {
  createOrder,
  fetchEmployeeDetails,
  fetchOrderDetails,
  updateOrder,
} from "../SharedComponents/services/OrderService";

export default function PurchaseOrderForm({ mode }) {
  const navigate = useNavigate();
  const { orderId, employeeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
  });

  const [orders, setOrders] = useState({
    dateOfJoining: "",
    projectEndDate: "",
    billRate: "",
    endClientName: "",
    vendorPhoneNo: "",
    vendorEmailId: "",
  });

  const {
    dateOfJoining,
    projectEndDate,
    billRate,
    endClientName,
    vendorPhoneNo,
    vendorEmailId,
  } = orders;

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "add" || (mode === "edit" && employeeId)) {
        try {
          const employeeResponse = await fetchEmployeeDetails(employeeId);
          if (employeeResponse) setEmployeeDetails(employeeResponse);

          if (mode === "edit" && orderId) {
            const orderResponse = await fetchOrderDetails(orderId);
            if (orderResponse) setOrders(orderResponse);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [mode, employeeId, orderId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const success =
        mode === "edit"
          ? await updateOrder(orderId, orders)
          : await createOrder(employeeId, orders);

      if (success) setIsModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleNavigate = (empId) => navigate(`/orders/${empId}`);

  const handleOk = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setOrders((prev) => ({ ...prev, [name]: value }));
  };

  const onInputChangeDate = (date, name) => {
    setOrders((prev) => ({
      ...prev,
      [name]: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} Purchase Order
        </h2>

        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={employeeDetails?.firstName || ""}
                disabled
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={employeeDetails?.lastName || ""}
                disabled
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="dateOfJoining">Project Start Date</label>
              <DatePicker
                className="w-100" // <-- important: NOT "form-control"
                value={dateOfJoining ? dayjs(dateOfJoining) : null}
                onChange={(d) => onInputChangeDate(d, "dateOfJoining")}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="projectEndDate">Project End Date</label>
              <DatePicker
                className="w-100" // <-- important
                value={projectEndDate ? dayjs(projectEndDate) : null}
                onChange={(d) => onInputChangeDate(d, "projectEndDate")}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="billRate">Bill Rate</label>
              <input
                type="number"
                className="form-control"
                name="billRate"
                value={billRate}
                onChange={onInputChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="endClientName">Client Name</label>
              <input
                type="text"
                className="form-control"
                name="endClientName"
                value={endClientName}
                onChange={onInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="vendorPhoneNo">Vendor Phone No</label>
              <input
                type="tel"
                className="form-control"
                name="vendorPhoneNo"
                value={vendorPhoneNo}
                onChange={onInputChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="vendorEmailId">Vendor Email</label>
              <input
                type="email"
                className="form-control"
                name="vendorEmailId"
                value={vendorEmailId}
                onChange={onInputChange}
              />
            </div>
          </div>

          {/* Actions: perfectly aligned Update + Cancel */}
<div
  className="mt-3 d-flex justify-content-end"
  style={{ gap: 12 }}
>
  <div className="btn-group" role="group" aria-label="actions">
    <button
      type="submit"
      className="btn btn-success"
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 40,
        lineHeight: "40px",
        padding: "0 16px",
        fontWeight: 600,
        borderRadius: 4,
      }}
    >
      {isEditMode ? "Update" : "Submit"}
    </button>

    <button
      type="button"
      className="btn btn-outline-danger"
      onClick={() => handleNavigate(employeeId)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 40,
        lineHeight: "40px",
        padding: "0 16px",
        fontWeight: 600,
        borderRadius: 4,
      }}
    >
      Cancel
    </button>
  </div>
</div>
        </form>
      </div>

      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Purchase Order {isEditMode ? "Updated" : "Added"} successfully</p>
      </Modal>
    </div>
  );
}