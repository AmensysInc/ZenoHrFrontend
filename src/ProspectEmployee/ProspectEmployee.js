import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProspectEmployee() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const employeeId = localStorage.getItem("id");
    const [tabValue, setTabValue] = useState(0);
    const [documents, setDocuments] = useState();

    const [employee, setEmployee] = useState({
        firstName: "",
        middleName:"",
        lastName: "",
        dob: "",
        fatherName:"",
        SSN:"",
        phoneNo: "",
        emailID: "",
        currentWorkLocation:"",
        residentialAddress:"",
        homeCountryAddress:"",
        emergencyContactDetails:"",
        visaStatus: "",
        clgOfGrad: "",
        bachelorsDegree:"",
        mastersDegree:"",
        bankName:"",
        accType:"",
        routingNumber:"",
        accNumber:"",
        maritalStatus:"",
        ITfilingState:"",
        needInsurance:"",
        startDateWithAmensys:""
      });
      const {
        firstName,
        middleName,
        lastName,
        dob,
        fatherName,
        SSN,
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
        ITfilingState,
        needInsurance,
        startDateWithAmensys
      } = employee;

      useEffect(() => {
        if (employeeId) {
          fetchEmployee();
        }
      }, [employeeId]);

      const fetchEmployee = async () => {
        try {
          const token = localStorage.getItem("token");
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
          const token = localStorage.getItem("token");
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
          if (response.status === 200) {
            navigate("/")
          }
          if (!response.ok) {
            throw new Error("Failed to update employee");
          }
        } catch (error) {
          console.error("Error updating employee:", error);
        }
      };

      const onDocumentSubmit = async (event) => {
        event.preventDefault();
        try {
          const token = localStorage.getItem("token");
          let formData = new FormData();
          formData.append("documents", documents);
          const requestOptions = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          };
          const response = await fetch(
            `${apiUrl}/employees/prospect/${employeeId}`,
            requestOptions
          );
          if (response.status === 200) {
            navigate("/")
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

      const onDocumentInputChange = (e) => {
        setDocuments( e.target.files[0] );
      };

      const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
      };

      return (
        <div>
          <div className="form-container">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Employee Details" {...a11yProps(0)} />
                <Tab label="Documents to upload" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={tabValue} index={0}>
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
                <div className="form-group">
                  <label htmlFor="SSN">SSN</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Social Security Number"
                    name="SSN"
                    value={SSN}
                    onChange={(e) => onInputChange(e)}
                    required
                  />
                </div>
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
                  <label htmlFor="currentWorkLocation">Current Work Location</label>
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
                <div className="form-group">
                  <label htmlFor="emergencyContactDetails">Emergency Contact</label>
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
                <div className="form-group">
                  <label htmlFor="visaStatus">Status</label>
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
                <div className="form-group">
                  <label htmlFor="routingNumber">Routing Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Routing Number"
                    name="routingNumber"
                    value={routingNumber}
                    onChange={(e) => onInputChange(e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="accNumber">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Account Number"
                    name="accNumber"
                    value={accNumber}
                    onChange={(e) => onInputChange(e)}
                    required
                  />
                </div>
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
                <div className="form-group">
                  <label htmlFor="ITfilingState">Income Tax Filing State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Income Tax Filing State"
                    name="ITfilingState"
                    value={ITfilingState}
                    onChange={(e) => onInputChange(e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ITfilingState">Income Tax Filing State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Income Tax Filing State"
                    name="ITfilingState"
                    value={ITfilingState}
                    onChange={(e) => onInputChange(e)}
                    required
                  />
                </div>
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
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
              <form onSubmit={(e) => onDocumentSubmit(e)} enctype="multipart/form-data">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="Document">Document</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document"
                      onChange={(e) => {onDocumentInputChange(e)}}
                      required
                    />
                  </div>
                </div>
                {console.log(documents)}
                <button type="submit" className="btn btn-outline-primary">
                  upload
                </button>
              </form>
            </CustomTabPanel>
          </Box>
          </div>
        </div>
      );
}
