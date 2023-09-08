import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


export default function AddVisaDetails() {
    const apiUrl = process.env.REACT_APP_API_URL;
    let navigate = useNavigate();
    let location = useLocation();
    const { employeeId } = location.state;
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [validationError, setValidationError] = useState("");
    const [startDateValidationError, setStartDateValidationError] = useState("");
    const [open, setOpen] = useState(false);
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
      
        const startDate = new Date(visaStartDate);
    const expiryDate = new Date(visaExpiryDate);

    if (startDate >= expiryDate) {
      setStartDateValidationError("Please Enter Valid Details.");
      setValidationError("");
      return;
    }
      
        try {
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(details)
          };
          const response = await fetch(`${apiUrl}/employees/${employeeId}/visa-details`, requestOptions);
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
        navigate("/editemployee/visa-details", {state: {employeeId} });
      };

      const handleNavigate = (employeeId) => {
        navigate("/editemployee/visa-details", { state: { employeeId } });
      };

      const visaTypeOptions = ["H1B", "OPT", "GREENCARD", "H4AD", "CPT"];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">New Visa Details</h2>
      {startDateValidationError && <p className="text-danger">{startDateValidationError}</p>}
      {validationError && <p className="text-danger">{validationError}</p>}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="form-control"
            value={visaStartDate}
            onChange={(date) => onInputChange({ target: { name: "visaStartDate", value: date } })}
            required
          />
          </LocalizationProvider>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="visaExpiryDate">Visa Expiry Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="form-control"
            value={visaExpiryDate}
            onChange={(date) => onInputChange({ target: { name: "visaExpiryDate", value: date } })}
            required
          />
          </LocalizationProvider>
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
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                VisaDetails added Successfully
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>ok</Button>
            </DialogActions>
          </Dialog>
      </form>
    </div>
  )
}
