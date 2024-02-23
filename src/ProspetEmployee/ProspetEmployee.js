import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function ProspectEmployee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem("id");
  const [tabValue, setTabValue] = useState(0);

  const [employee, setEmployee] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    fatherName: "",
    ssn: "",
    phoneNo: "",
    emailID: "",
    currentWorkLocation: "",
    residentialAddress: "",
    homeCountryAddress: "",
    emergencyContactDetails: "",
    visaStatus: "",
    clgOfGrad: "",
    bachelorsDegree: "",
    mastersDegree: "",
    bankName: "",
    accType: "",
    routingNumber: "",
    accNumber: "",
    maritalStatus: "",
    itFilingState: "",
    needInsurance: "",
    startDateWithAmensys: "",
  });
  const {
    firstName,
    middleName,
    lastName,
    dob,
    fatherName,
    ssn,
    phoneNo,
    emailID,
    currentWorkLocation,
    residentialAddress,
    homeCountryAddress,
    emergencyContactDetails,
    visaStatus,
    clgOfGrad,
    bachelorsDegree,
    mastersDegree,
    bankName,
    accType,
    routingNumber,
    accNumber,
    maritalStatus,
    itFilingState,
    needInsurance,
    startDateWithAmensys,
  } = employee;

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employee),
      };
      const response = await fetch(
        `${apiUrl}/employees/prospect/${employeeId}`,
        requestOptions
      );
      console.log(response);
      if (response.status === 200) {
        navigate("/uploadDocs");
      }
      if (!response.ok) {
        throw new Error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };
  const onInputChangeDate = (date, name) => {
    setEmployee({ ...employee, [name]: date.format("YYYY-MM-DD") });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <div className="form-container">
        <Typography variant="h4">Employee Details</Typography>
        <form onSubmit={(e) => onSubmit(e)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="FirstName">Middle Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Middle Name"
                  name="middleName"
                  value={middleName}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="DOB">Date Of Birth</label>
                <DatePicker
                  type="text"
                  className="form-control"
                  placeholder="Date of Birth"
                  name="dob"
                  value={dayjs(dob)}
                  onChange={(date) => onInputChangeDate(date, "dob")}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="fatherName">Father's Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Father's full name"
                  name="fatherName"
                  value={fatherName}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="ssn">SSN</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Social Security Number"
                  name="ssn"
                  value={ssn}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="clgOfGrad">Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Phone Number"
                  name="phoneNo"
                  value={phoneNo}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="currentWorkLocation">
                  Current Work Location
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Work Location Full Address"
                  name="currentWorkLocation"
                  value={currentWorkLocation}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="residentialAddress">Residential Address</label>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Work Location Full Address"
                  name="residentialAddress"
                  value={residentialAddress}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="homeCountryAddress">Home Country Address</label>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Work Location Full Address"
                  name="homeCountryAddress"
                  value={homeCountryAddress}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="emergencyContactDetails">
                  Emergency Contact
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Name, PhoneNo and Address"
                  name="emergencyContactDetails"
                  value={emergencyContactDetails}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="clgOfGrad">University of Graduation</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name of the University"
                  name="clgOfGrad"
                  value={clgOfGrad}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="bachelorsDegree">Bachelor's Degree</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bachelor's"
                  name="bachelorsDegree"
                  value={bachelorsDegree}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="mastersDegree">Master's Degree</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Master's Degree"
                  name="mastersDegree"
                  value={mastersDegree}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bank Name"
                  name="bankName"
                  value={bankName}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="accType">Account Type</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Account Type"
                  name="accType"
                  value={accType}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="routingNumber">Routing Number</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Routing Number"
                  name="routingNumber"
                  value={routingNumber}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="accNumber">Account Number</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Account Number"
                  name="accNumber"
                  value={accNumber}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="maritalStatus">Marital Status</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Marital Status"
                  name="maritalStatus"
                  value={maritalStatus}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="itFilingState">Income Tax Filing State</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Income Tax Filing State"
                  name="itFilingState"
                  value={itFilingState}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="form-group">
                <label htmlFor="needInsurance">Need Insurance</label>
                <select
                  id="needInsurance"
                  name="needInsurance"
                  value={needInsurance}
                  onChange={(e) => onInputChange(e)}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Working">Yes</option>
                  <option value="OnProject">No</option>
                </select>
              </div>
            </Grid>
          </Grid>
          <div className="form-group">
            <label htmlFor="startDateWithAmensys">Start Date With Amensys</label>
            <DatePicker
              type="text"
              className="form-control"
              placeholder="Date of Birth"
              name="startDateWithAmensys"
              value={dayjs(startDateWithAmensys)}
              onChange={(date) => onInputChangeDate(date, "startDateWithAmensys")}
              required
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
