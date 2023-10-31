import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from 'antd';
import dayjs from "dayjs";
import FormInput from "../SharedComponents/FormInput";

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
  const onInputChangeDate = (date, name) => {
    if (date) {
      setOrders({ ...orders, [name]: date.format("YYYY-MM-DD") });
    }
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
                value={dateOfJoining ? dayjs(dateOfJoining) : null}
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
                  projectEndDate ? dayjs(projectEndDate) : null
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
                value={billRate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <FormInput
                label="Client Name"
                type="text"
                name="endClientName"
                value={endClientName}
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
                value={vendorPhoneNo}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <FormInput
                label="Vendor EmailId"
                type="email"
                name="vendorEmailId"
                value={vendorEmailId}
                onChange={onInputChange}
                required
              />
            </div>
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