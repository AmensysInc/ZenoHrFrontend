import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function AddProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [projectStatusOptions, setProjectStatusOptions] = useState([
    "Active",
    "Terminated",
    "Ended",
    "On Hold",
  ]);
  const [project, setProject] = useState({
    firstName: "",
    lastName: "",
    subVendorOne: "",
    subVendorTwo: "",
    projectAddress: "",
    projectStartDate: "",
    projectEndDate: "",
    projectStatus: "",
  });

  const {
    firstName,
    lastName,
    subVendorOne,
    subVendorTwo,
    projectAddress,
    projectStartDate,
    projectEndDate,
    projectStatus,
  } = project;

  useEffect(() => {
    loadEmployeeDetails();
  }, []);

  const loadEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(project),
      };
      const response = await fetch(`${apiUrl}/employees/${employeeId}/projects`, requestOptions);
      if(response.status === 200){
        handleOpenPopup();
      }
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/editemployee/project-history",{ state: { employeeId } });
  };

  const handleNavigate = (employeeId) => {
    navigate("/editemployee/project-history", { state: { employeeId } });
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="form-control"
            name="projectStartDate"
            value={projectStartDate}
            onChange={(date) => onInputChange({ target: { name: "projectStartDate", value: date } })}
            required
          />
          </LocalizationProvider>
        </div>
        <div className="form-group">
          <label htmlFor="projectEndDate">Project End Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="form-control"
            name="projectEndDate"
            value={projectEndDate}
            onChange={(date) => onInputChange({ target: { name: "projectEndDate", value: date } })}
            required
          />
          </LocalizationProvider>
        </div>
        <div className="form-group">
          <label htmlFor="projectStatus">Project Status</label>
          <select
            className="form-control"
            name="projectStatus"
            value={projectStatus}
            onChange={(e) => onInputChange(e)}
            required
          >
            <option value="" disabled>
              Select Project Status
            </option>
            {projectStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
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
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Project added Successfully
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>ok</Button>
            </DialogActions>
          </Dialog>
      </form>
    </div>
  );
}
