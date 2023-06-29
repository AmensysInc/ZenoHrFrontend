import axios from "axios";
import './Employee.css';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddUser() {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    dob: "",
    clgOfGrad: "",
    visaStatus: "",    
    visaStartDate: "",
    visaExpiryDate: "",
    onBench: ""
  });

  const { firstName, lastName, emailID, dob, clgOfGrad, visaStatus, visaStartDate, visaExpiryDate, onBench } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (new Date(visaStartDate) > new Date(visaExpiryDate)) {
      alert('Visa start date cannot be after visa expiry date');
      return;
    }
    if (new Date(visaExpiryDate) < new Date(visaStartDate)) {
      alert('Visa expiry date cannot be before visa start date');
      return;
    }

    await axios.post("http://localhost:8082/employees", user);
    navigate("/");
  };

  return (
    <div className="form-container">
          <h2 className="text-center m-4">Register User</h2>

          <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="FirstName">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            </div>
            <div className="form-group">
              <label htmlFor="Email">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Email Address"
                name="emailID"
                value={emailID}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="DOB">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Date of Birth"
                name="dob"
                value={dob}
                onChange={(e) => onInputChange(e)}
                required
              />
              </div>
              <div className="form-group">
              <label htmlFor="clgOfGrad">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Name of the college"
                name="clgOfGrad"
                value={clgOfGrad}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="visaStatus">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Visa Status"
                name="visaStatus"
                value={visaStatus}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="visaStartDate">
              </label>
              <input
                type={"date"}
                className="form-control"
                placeholder="Visa Start Date"
                name="visaStartDate"
                value={visaStartDate}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="visaExpiryDate">
              </label>
              <input
                type={"date"}
                className="form-control"
                name="visaExpiryDate"
                placeholder="Visa Expiry Date"
                value={visaExpiryDate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="onBench">
              Working or Bench
              </label>
              <select
                id="onBench"
                name="onBench"
                value={onBench}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="">-- Select --</option>
                <option value="Working">Working</option>
                <option value="Bench">Bench</option>
              </select>
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Submit
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/">
              Cancel
            </Link>
          </form>
        </div>
      
  );
}
