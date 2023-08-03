import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AddProjectHistory() {
    const apiUrl = process.env.REACT_APP_API_URL;
    let navigate = useNavigate();
    let location = useLocation();
    const { employeeId } = location.state;
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [project, setProject] = useState({
      firstName: "",
      lastName: "",
      subVendorOne: "",
      subVendorTwo: "",
      projectAddress: "",
      projectStartDate: "",
      projectEndDate: "",
      projectStatus: ""
    });
  
    const { firstName, lastName, subVendorOne, subVendorTwo, projectAddress, projectStartDate, projectEndDate, projectStatus } = project;

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
    setProject({ ...project, [e.target.name]: e.target.value });
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
        body: JSON.stringify(project)
      };
      await fetch(`${apiUrl}/employees/${employeeId}/projects`, requestOptions);
      navigate("/");
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add Project</h2>
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
          <label htmlFor="subVendorOne">Sub VendorOne</label>
          <input
            type="text"
            className="form-control"
            placeholder="SubVendorOne"
            name="subVendorOne"
            value={subVendorOne}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="subVendorTwo">Sub VendorTwo</label>
          <input
            type="text"
            className="form-control"
            placeholder="Sub VendorTwo"
            name="subVendorTwo"
            value={subVendorTwo}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectAddress">Project Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Project Address"
            name="projectAddress"
            value={projectAddress}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectStartDate">Project Start Date</label>
          <input
            type="text"
            className="form-control"
            placeholder="Project Start Date"
            name="projectStartDate"
            value={projectStartDate}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectEndDate">Project End Date</label>
          <input
            type="text"
            className="form-control"
            placeholder="Project End Date"
            name="projectEndDate"
            value={projectEndDate}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectStatus">Project Status</label>
          <input
            type="text"
            className="form-control"
            placeholder="Project Status"
            name="projectStatus"
            value={projectStatus}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>

        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
      </form>
    </div>
  )
}
