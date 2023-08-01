import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditEmployee() {
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
    visaStartDate: new Date(), 
    visaExpiryDate: new Date(), 
    onBench: ""
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
      `http://localhost:8082/employees/${employeeId}`,
      config
    );
    const { data } = response;

    const visaStartDate = new Date(data.visaStartDate);
    const visaExpiryDate = new Date(data.visaExpiryDate);

    setEmployee({
      ...data,
      visaStartDate,
      visaExpiryDate
    });
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
    onBench
  } = employee;

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const onVisaStartDateChange = (date) => {
    setEmployee({ ...employee, visaStartDate: date });
  };

  const onVisaExpiryDateChange = (date) => {
    setEmployee({ ...employee, visaExpiryDate: date });
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
        `http://localhost:8082/employees/${employeeId}`,
        {
          ...employee,
          visaStartDate: visaStartDate.toISOString(), 
          visaExpiryDate: visaExpiryDate.toISOString()
        },
        config
      );
      navigate("/");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  const handleProjectHistory = (employeeId) => {
    navigate("/project-history", { state: { employeeId } });
  };
  

  return (
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
          <label htmlFor="visaStartDate">Visa StartDate</label>
          <DatePicker
            className="form-control"
            placeholderText="Visa Start Date"
            name="visaStartDate"
            selected={visaStartDate}
            onChange={onVisaStartDateChange}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="visaExpiryDate">Visa ExpiryDate</label>
          <DatePicker
            className="form-control"
            placeholderText="Visa Expiry Date"
            name="visaExpiryDate"
            selected={visaExpiryDate}
            onChange={onVisaExpiryDateChange}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="onBench">Working or Bench</label>
          <select
            id="onBench"
            name="onBench"
            value={onBench}
            onChange={(e) => onInputChange(e)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Working">onBench</option>
            <option value="Bench">OnProject</option>
            <option value="Bench">OnVacation</option>
            <option value="Bench">OnSick</option>
          </select>
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Update
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
        <button
        type="button"
        className="btn btn-outline-primary mx-2"
        onClick={() => handleProjectHistory(employeeId)}
      >
        Project History
      </button>
      </form>
    </div>
  );
}
