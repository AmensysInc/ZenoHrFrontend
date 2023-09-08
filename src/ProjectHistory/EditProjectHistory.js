import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function EditProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, employeeId } = location.state;

  const [projectHistory, setProjectHistory] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [projectStatusOptions, setProjectStatusOptions] = useState([
    "Active",
    "Terminated",
    "Ended",
    "On Hold",
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjectHistoryAndEmployee();
  }, []);

  const fetchProjectHistoryAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [historyResponse, employeeResponse] = await Promise.all([
        axios.get(`${apiUrl}/projects/${projectId}`, requestOptions),
        axios.get(`${apiUrl}/employees/${employeeId}`, requestOptions),
      ]);

      setProjectHistory(historyResponse.data);
      setEmployeeDetails(employeeResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${apiUrl}/employees/projects/${projectId}`,
        projectHistory,
        requestOptions
      );

      if (response.status === 200) {
        handleOpenPopup();
      }
    } catch (error) {
      console.error("Error updating project history:", error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate("/editemployee/project-history", { state: { employeeId } });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectHistory((prevHistory) => ({
      ...prevHistory,
      [name]: value,
    }));
  };

  const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/editemployee/project-history", { state: { employeeId } });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Project History</h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={employeeDetails.firstName || ""}
              readOnly
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={employeeDetails.lastName || ""}
              readOnly
            />
          </div>
          <div>
          <label>Sub VendorOne</label>
          <input
            type="text"
            name="subVendorOne"
            value={projectHistory.subVendorOne}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Sub VendorTwo</label>
          <input
            type="text"
            name="subVendorTwo"
            value={projectHistory.subVendorTwo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Project Address</label>
          <input
            type="text"
            name="projectAddress"
            value={projectHistory.projectAddress}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Project Start Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>          
          <DatePicker
            type="text"
            name="projectStartDate"
            className="form-control"
            value={dayjs(projectHistory.projectStartDate)}
            onChange={handleInputChange}
            required
          />      
          </LocalizationProvider>
        </div>
        <div>
          <label>Project End Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>          
          <DatePicker
            type="text"
            name="projectEndDate"
            className="form-control"
            value={dayjs(projectHistory.projectEndDate)}
            onChange={handleInputChange}
            required
          />      
          </LocalizationProvider>
        </div>
        <div>
          <label>Project Status</label>
          <select
            name="projectStatus"
            value={projectHistory.projectStatus}
            onChange={handleInputChange}
          >
            {projectStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
          <button type="submit" className="btn btn-outline-primary">
            Update
          </button>
          <button
            type="button"
            className="btn btn-outline-danger mx-2"
            onClick={() => handleNavigate(employeeId)}
          >
            Cancel
          </button>
        </form>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Project Updated Successfully
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

