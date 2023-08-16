import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function AddVisaDetails() {
    const apiUrl = process.env.REACT_APP_API_URL;
    let navigate = useNavigate();
    let location = useLocation();
    const { employeeId } = location.state;
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [details, setDetails] = useState({
      firstName: "",
      lastName: "",
      visaType: "",
      visaStartDate: "",
      visaExpiryDate: ""
    });

    const {firstName, lastName, visaType, visaStartDate, visaExpiryDate} = details;

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
        setDetails({ ...details, [e.target.name]: e.target.value });
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
            body: JSON.stringify(details)
          };
          await fetch(`${apiUrl}/employees/${employeeId}/visa-details`, requestOptions);
          navigate("/");
        } catch (error) {
          console.error("Error adding order:", error);
        }
      };

      const handleNavigate = (employeeId) => {
        navigate("/editemployee/visa-details", { state: { employeeId } });
      };

      const visaTypeOptions = ["h1b", "opt", "greencard", "h4ad", "cpt"];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">New Visa Details</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="firstName">First Name</label>
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
            <label htmlFor="lastName">Last Name</label>
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
            <label htmlFor="visaType">Visa Type</label>
            <select
              className="form-control"
              name="visaType"
              value={visaType}
              onChange={(e) => onInputChange(e)}
            required
            >
            <option value="">Select Visa Type</option>
            {visaTypeOptions.map(option => (
            <option key={option} value={option}>
            {option}
            </option>
            ))}
            </select>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="visaStartDate">Visa Start Date</label>
            <DatePicker
              className="form-control"
              selected={visaStartDate ? new Date(visaStartDate) : null}
              onChange={(date) => setDetails({ ...details, visaStartDate: date })}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select Visa Start Date"
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="visaExpiryDate">Visa Expiry Date</label>
            <DatePicker
              className="form-control"
              selected={visaExpiryDate ? new Date(visaExpiryDate) : null}
              onChange={(date) => setDetails({ ...details, visaExpiryDate: date })}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select Visa Expiry Date"
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
      </form>
    </div>
  )
}
