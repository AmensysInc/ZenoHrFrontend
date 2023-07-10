// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


// export default function EditEmployee() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const employeeId = location.state.employeeId;

//   const [employee, setEmployee] = useState({
//     firstName: "",
//     lastName: "",
//     emailID: "",
//     dob: "",
//     clgOfGrad: "",
//     visaStatus: "",
//     visaStartDate: null,
//     visaExpiryDate: null,
//     onBench: ""
//   });

//   useEffect(() => {
//     fetchEmployee();
//   }, []);

//    const fetchEmployee = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8082/employees/${employeeId}`);
//       const { data } = response;
//       setEmployee(data);
//     } catch (error) {
//       console.error("Error fetching employee:", error);
//     }
//   };
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
    visaStartDate: new Date(), // Set default value to current date
    visaExpiryDate: new Date(), // Set default value to current date
    onBench: ""
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

//   const fetchEmployee = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8082/employees/${employeeId}`);
//       const { data } = response;
//       setEmployee(data);
//     } catch (error) {
//       console.error("Error fetching employee:", error);
//     }
//   };
const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/employees/${employeeId}`);
      const { data } = response;
  
      // Parse date strings into Date objects
      const visaStartDate = new Date(data.visaStartDate);
      const visaExpiryDate = new Date(data.visaExpiryDate);
  
      // Update employee state with parsed dates
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

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (visaStartDate > visaExpiryDate) {
//       alert("Visa start date cannot be after visa expiry date");
//       return;
//     }
//     if (visaExpiryDate < visaStartDate) {
//       alert("Visa expiry date cannot be before visa start date");
//       return;
//     }
//     try {
//       await axios.put(`http://localhost:8082/employees/${employeeId}`, employee);
//       navigate("/");
//     } catch (error) {
//       console.error("Error updating employee:", error);
//     }
//   };
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
      await axios.put(`http://localhost:8082/employees/${employeeId}`, {
        ...employee,
        visaStartDate: visaStartDate.toISOString(), // Convert date to ISO string format
        visaExpiryDate: visaExpiryDate.toISOString() // Convert date to ISO string format
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Edit Employee</h2>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="FirstName"></label>
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
            <label htmlFor="lastName"></label>
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
          <label htmlFor="Email"></label>
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
          <label htmlFor="DOB"></label>
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
          <label htmlFor="clgOfGrad"></label>
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
          <label htmlFor="visaStatus"></label>
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
          <label htmlFor="visaStartDate"></label>
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
          <label htmlFor="visaExpiryDate"></label>
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
            <option value="Bench">Working</option>
          </select>
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Update
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
      </form>
    </div>
  );
}
