import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "antd";
import { Modal } from 'antd';

export default function AddOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let { employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState({
    firstName: "",
    lastName: "",
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
    loadEmployeeDetails();
  }, []);

  const loadEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
      const data = await response.json();
      setEmployeeDetails(data);
    } catch (error) {
      console.error("Error loading employee details:", error);
    }
  };

  const onInputChange = (e) => {
    setOrders({ ...orders, [e.target.name]: e.target.value });
  };

  const handleNavigate = (employeeId) => {
    navigate(`/orders/${employeeId}`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orders),
      };
      const response = await fetch(
        `${apiUrl}/employees/${employeeId}/orders`,
        requestOptions
      );
      if (response.status === 200) {
        showModal();
      }
    } catch (error) {
      console.error("Error adding order:", error);
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

  return (
    <div className="form-container">
      <h2 className="text-center m-4">New Purchase Order</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="firstName"
              value={employeeDetails.firstName || ""}
              disabled
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lastName"
              value={employeeDetails.lastName || ""}
              disabled
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="dateOfJoining">Date Of Joining:</label>
            <DatePicker
              className="form-control"
              value={dateOfJoining}
              onChange={(date) =>
                onInputChange({
                  target: { name: "dateOfJoining", value: date },
                })
              }
              required
            />
        </div>
        <div className="form-group">
          <label htmlFor="projectEndDate">Project End Date:</label>
            <DatePicker
            className="form-control"
            value={projectEndDate}
            onChange={(date) => onInputChange({ target: { name: "projectEndDate", value: date } })}
            required
            />
        </div>
        <div className="form-group">
          <label htmlFor="billRate">Bill Rate:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Bill Rate"
            name="billRate"
            value={billRate}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endClientName">End Client Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="End Client Name"
            name="endClientName"
            value={endClientName}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendorPhoneNo">Vendor PhoneNo:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Vendor PhoneNo"
            name="vendorPhoneNo"
            value={vendorPhoneNo}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendorEmailId">Vendor EmailId:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Vendor EmailId"
            name="vendorEmailId"
            value={vendorEmailId}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger mx-2"
          onClick={() => handleNavigate(employeeId)}
        >
          Cancel
        </button>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>PurchaseOrder added succesfully</p>
      </Modal>
      </form>
    </div>
  );
}
