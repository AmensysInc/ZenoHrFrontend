import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import './EditEmployee.css';

export default function EditEmployee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = location.state.employeeId;

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    dob: "",
    clgOfGrad: "",
    visaStatus: "",
    onBench: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    fetchEmployee();
  }, []);
  
const fetchEmployee = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.get(
      `${apiUrl}/employees/${employeeId}`,
      config
    );
    const { data } = response;

    setEmployee(data);
  } catch (error) {
    console.error("Error fetching employee:", error);
  }
};

  const {
    firstName,
    lastName,
    emailID,
    dob,
    clgOfGrad,
    visaStatus,
    visaStartDate,
    visaExpiryDate,
    onBench,
    email,
    password
  } = employee;

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (visaStartDate > visaExpiryDate) {
      alert("Visa start date cannot be after visa expiry date");
      return;
    }
    if (visaExpiryDate < visaStartDate) {
      alert("Visa expiry date cannot be before visa start date");
      return;
    }
    try {
      const token = localStorage.getItem("token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      await axios.put(
        `${apiUrl}/employees/${employeeId}`,
        config
      );
      navigate("/");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  const handleProjectHistory = (employeeId) => {
    navigate("/editemployee/project-history", { state: { employeeId } });
  };

  const handleVisaDetails = (employeeId) => {
    navigate("/editemployee/visa-details", { state: { employeeId } });
  };
  

  return (
  <div>
  <div className="button-container">
  <button
    type="button"
    className="project-history"
    onClick={() => handleProjectHistory(employeeId)}
  >
    Project History
  </button>
  <button
    type="button"
    className="project-history"
    onClick={() => handleVisaDetails(employeeId)}
  >
    Visa Details
  </button>
  </div>
    <div className="form-container">
      <h2 className="text-center m-4">Edit Employee</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="FirstName">First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input
            type="text"
            className="form-control"
            placeholder="Email Address"
            name="emailID"
            value={emailID}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="DOB">Date Of Birth</label>
          <input
            type="text"
            className="form-control"
            placeholder="Date of Birth"
            name="dob"
            value={dob}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="clgOfGrad">College of Graduation</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name of the college"
            name="clgOfGrad"
            value={clgOfGrad}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="visaStatus">Visa Status</label>
          <input
            type="text"
            className="form-control"
            placeholder="Visa Status"
            name="visaStatus"
            value={visaStatus}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="onBench">Working Stauts</label>
          <select
            id="onBench"
            name="onBench"
            value={onBench}
            onChange={(e) => onInputChange(e)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Working">onBench</option>
            <option value="OnProject">OnProject</option>
            <option value="OnVacation">OnVacation</option>
            <option value="OnSick">OnSick</option>
          </select>
        </div>
        <div className="form-group">
            <label htmlFor="email">User Name</label>
            <input
              type={"text"}
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => onInputChange(e)}
            />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={"text"}
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => onInputChange(e)}
            />
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Update
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
      </form>
    </div>
    </div>
  );
}
