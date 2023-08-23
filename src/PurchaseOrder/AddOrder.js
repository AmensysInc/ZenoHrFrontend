import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AddOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [orders, setOrders] = useState({
    firstName: "",
    lastName: "",
    dateOfJoining: "",
    projectEndDate: "",
    billRate: "",
    endClientName: "",
    vendorPhoneNo: "",
    vendorEmailId: ""
  });

  const { dateOfJoining, projectEndDate, billRate, endClientName, vendorPhoneNo, vendorEmailId } = orders;

  useEffect(() => {
    loadEmployeeDetails();
  }, []);

  const loadEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
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
    navigate("/orders", { state: { employeeId } });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orders)
      };
      await fetch(`${apiUrl}/employees/${employeeId}/orders`, requestOptions);
      navigate("/orders", {state: {employeeId} });
    } catch (error) {
      console.error("Error adding order:", error);
    }
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
          <input
            type="text"
            className="form-control"
            placeholder="Date Of Joining"
            name="dateOfJoining"
            value={dateOfJoining}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectEndDate">Project End Date:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Project End Date"
            name="projectEndDate"
            value={projectEndDate}
            onChange={(e) => onInputChange(e)}
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
      </form>
    </div>
  )
}
