import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
import dayjs from "dayjs";
import FormInput from "../SharedComponents/FormInput";

export default function EditOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let { employeeId, orderId } = useParams();

  const [order, setOrder] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderAndEmployee();
  }, []);

  const fetchOrderAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [orderResponse, employeeResponse] = await Promise.all([
        axios.get(`${apiUrl}/orders/${orderId}`, requestOptions),
        axios.get(`${apiUrl}/employees/${employeeId}`, requestOptions),
      ]);

      setOrder(orderResponse.data);
      setEmployeeDetails(employeeResponse.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${apiUrl}/employees/orders/${orderId}`,
        order,
        requestOptions
      );

      if (response.status === 200) {
        showModal();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate(`/orders/${employeeId}`);
  };

  const onInputChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };
  const onInputChangeDate = (date, name) => {
    if (date) {
      setOrder({ ...order, [name]: date.format("YYYY-MM-DD") });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Order</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <FormInput
                label="First Name"
                type="text"
                name="firstName"
                value={employeeDetails.firstName}
                onChange={onInputChange}
                readOnly
              />
            </div>
            <div className="form-group col-md-6">
              <FormInput
                label="Last Name"
                type="text"
                name="lastName"
                value={employeeDetails.lastName}
                onChange={onInputChange}
                readOnly
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <FormInput
                label="Date Of Joining"
                type="date"
                name="dateOfJoining"
                value={order.dateOfJoining ? dayjs(order.dateOfJoining) : null}
                onChange={(date) => onInputChangeDate(date, "dateOfJoining")}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <FormInput
                label="Project End Date"
                type="date"
                name="projectEndDate"
                value={
                  order.projectEndDate ? dayjs(order.projectEndDate) : null
                }
                onChange={(date) => onInputChangeDate(date, "projectEndDate")}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <FormInput
                label="Bill Rate"
                type="text"
                name="billRate"
                value={order.billRate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <FormInput
                label="Client Name"
                type="text"
                name="endClientName"
                value={order.endClientName}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <FormInput
                label="Vendor PhoneNo"
                type="number"
                name="vendorPhoneNo"
                value={order.vendorPhoneNo}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <FormInput
                label="Vendor EmailId"
                type="email"
                name="vendorEmailId"
                value={order.vendorEmailId}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-outline-primary">
            Update
          </button>
          <button
            type="button"
            className="btn btn-outline-danger mx-2"
            onClick={() => handleNavigate(employeeId)}
          >
            Cancel
          </button>
        </form>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>PurchaseOrder Updated succesfully</p>
        </Modal>
      </div>
    </div>
  );
}
