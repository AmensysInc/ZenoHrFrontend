import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AddWithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;

  const [employeeDetails, setEmployeeDetails] = useState({});
  const [tracking, setTracking] = useState({
    firstName: "",
    lastName: "",
    month: "",
    year: "",
    actualHours: "",
    actualRate: "",
    actualAmt: "",
    paidHours: "",
    paidRate: "",
    paidAmt: "",
    balance: "",
  });

  const { month, year, actualHours, actualRate, paidHours, paidRate } = tracking;

  // useEffect(() => {
  //   loadEmployeeDetails();
  // }, []);
  useEffect(() => {
    loadEmployeeDetails();
    const actualAmtValue = actualHours * actualRate;
    const paidAmtValue = paidHours * paidRate;
    const balanceValue = actualAmtValue - paidAmtValue;

    setTracking({
      ...tracking,
      actualAmt: actualAmtValue,
      paidAmt: paidAmtValue,
      balance: balanceValue,
    });
  }, [actualHours, actualRate, paidHours, paidRate]);

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
    setTracking({ ...tracking, [e.target.name]: e.target.value });
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
        body: JSON.stringify(tracking)
      };
      await fetch(`${apiUrl}/employees/${employeeId}/trackings`, requestOptions);
      navigate("/");
    } catch (error) {
      console.error("Error adding withholding tracking:", error);
    }
  };

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const yearOptions = [2022, 2023, 2024, 2025];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">New WithHoldTracking</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
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
          </div>
          <div className="col-md-6">
            <div className="form-group">
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
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="month">Month:</label>
              <select
                className="form-control"
                name="month"
                value={month}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="" disabled>Select month</option>
                {monthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="year">Year:</label>
              <select
                className="form-control"
                name="year"
                value={year}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="" disabled>Select year</option>
                {yearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualHours">Actual Hours:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Hours"
                name="actualHours"
                value={actualHours}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualRate">Actual Rate:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Rate"
                name="actualRate"
                value={actualRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidHours">Paid Hours:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Hours"
                name="paidHours"
                value={paidHours}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidRate">Paid Rate:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Rate"
                name="paidRate"
                value={paidRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualAmt">Actual Amount:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Amount"
                name="actualAmt"
                value={tracking.actualAmt}   
                readOnly                      
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidAmt">Paid Amount:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Amount"
                name="paidAmt"
                value={tracking.paidAmt}     
                readOnly                    
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="balance">Balance:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Balance"
                name="balance"
                value={tracking.balance}   
                readOnly                      
              />
            </div>
          </div>
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






/*
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AddWithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;

   const [employeeDetails, setEmployeeDetails] = useState({});
  const [tracking, setTracking] = useState({
    firstName: "",
    lastName: "",
    month: "",
    year: "",
    actualHours: "",
    actualRate: "",
    paidHours: "",
    paidRate: "",
  });

  const { month, year, actualHours, actualRate, paidHours, paidRate } = tracking;

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
    setTracking({ ...tracking, [e.target.name]: e.target.value });
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
        body: JSON.stringify(tracking)
      };
      await fetch(`${apiUrl}/employees/${employeeId}/trackings`, requestOptions);
      navigate("/");
    } catch (error) {
      console.error("Error adding withholding tracking:", error);
    }
  };

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const yearOptions = [2022, 2023, 2024, 2025];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">New WithHoldTracking</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
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
          </div>
          <div className="col-md-6">
            <div className="form-group">
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
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="month">Month:</label>
              <select
                className="form-control"
                name="month"
                value={month}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="" disabled>Select month</option>
                {monthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="year">Year:</label>
              <select
                className="form-control"
                name="year"
                value={year}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="" disabled>Select year</option>
                {yearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualHours">Actual Hours:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Hours"
                name="actualHours"
                value={actualHours}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualRate">Actual Rate:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Rate"
                name="actualRate"
                value={actualRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidHours">Paid Hours:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Hours"
                name="paidHours"
                value={paidHours}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidRate">Paid Rate:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Rate"
                name="paidRate"
                value={paidRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
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
*/



/*
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AddWithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;

  const [employeeDetails, setEmployeeDetails] = useState({});
  const [tracking, setTracking] = useState({
    firstName: "",
    lastName: "",
    month: "",
    year: "",
    actualHours: "",
    actualRate: "",
    paidHours: "",
    paidRate: "",
  });

  const { firstName, lastName, month, year, actualHours, actualRate, paidHours, paidRate } = tracking;

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
    setTracking({ ...tracking, [e.target.name]: e.target.value });
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
        body: JSON.stringify(tracking)
      };
      await fetch(`${apiUrl}/employees/${employeeId}/trackings`, requestOptions);
      navigate("/");
    } catch (error) {
      console.error("Error adding withholding tracking:", error);
    }
  };

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const yearOptions = [2022, 2023, 2024, 2025];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add New WithHoldTracking</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="month">Month:</label>
            <select
              className="form-control"
              name="month"
              value={month}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option value="" disabled>Select month</option>
              {monthOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="year">Year:</label>
            <select
              className="form-control"
              name="year"
              value={year}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option value="" disabled>Select year</option>
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="actualHours">Actual Hours:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Actual Hours"
              name="actualHours"
              value={actualHours}
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="actualRate">Actual Rate:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Actual Rate"
            name="actualRate"
            value={actualRate}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paidHours">Paid Hours:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Paid Hours"
            name="paidHours"
            value={paidHours}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paidRate">Paid Rate:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Paid Rate"
            name="paidRate"
            value={paidRate}
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
*/






/*
import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation} from "react-router-dom";

export default function AddWithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;

  const [tracking, setTrackings] = useState({
    employeeId: employeeId,
    month : "",
    year : "",
    actualHours : "",
    actualRate : "",
    paidHours : "",
    paidRate : "",

  });

  const {  month, year, actualHours, actualRate, paidHours, paidRate} = tracking;

  const onInputChange = (e) => {
    setTrackings({ ...tracking, [e.target.name]: e.target.value });
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
        body: JSON.stringify(tracking)
      };
      await fetch(`${apiUrl}/employees/${employeeId}/trackings`, requestOptions);
      navigate("/");
    } catch (error) {
      console.error("Error adding withholding tracking:", error);
    }
  };

  return (
    <div className="form-container">
          <h2 className="text-center m-4">Add New WithHoldTracking</h2>
          <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
          <div className="form-group">
              <label htmlFor="employeeId">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Employee ID"
                name="employeeId"
                value={employeeId}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group"> 
              <label htmlFor="month">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Month"
                name="month"
                value={month}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="year">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Year"
                name="year"
                value={year}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="actualHours">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Actual Hours"
                name="actualHours"
                value={actualHours}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            </div>
            <div className="form-group">
              <label htmlFor="actualRate">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Actual Rate"
                name="actualRate"
                value={actualRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="paidHours">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Paid Hours"
                name="paidHours"
                value={paidHours}
                onChange={(e) => onInputChange(e)}
                required
              />
              </div>
              <div className="form-group">
              <label htmlFor="paidRate">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Paid Rate"
                name="paidRate"
                value={paidRate}
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
*/
