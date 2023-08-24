
import React, { useState, useEffect } from "react";
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

export default function EditVisaDetails() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [visaDetails, setVisaDetails] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [visaTypeOptions, setVisaTypeOptions] = useState([
    "H1B",
    "OPT",
    "Green Card",
    "H4 EAD",
    "CPT",
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { visaId, employeeId } = location.state;

  useEffect(() => {
    fetchVisaDetailsAndEmployee();
  }, []);

  const fetchVisaDetailsAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const visaresponse = await fetch(
        `${apiUrl}/visa-details/${visaId}`,
        requestOptions
      );
      if (!visaresponse.ok) {
        throw new Error("Failed to fetch Visa Details");
      }
      const visaDetails = await visaresponse.json();
      setVisaDetails(visaDetails);
      const employeeResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );

      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employee details");
      }
      const employeeData = await employeeResponse.json();
      setEmployeeDetails(employeeData);
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(visaDetails),
      };
      const response = await fetch(
        `${apiUrl}/employees/visa-details/${visaId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
      if (response.status === 200) {
        handleOpenPopup();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVisaDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/editemployee/visa-details", { state: { employeeId } });
  };
  const handleNavigate = (employeeId) => {
    navigate("/editemployee/visa-details", { state: { employeeId } });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-container"> {/* Apply the same CSS class */}
      <h2 className="text-center m-4">Edit Visa Details</h2>
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
          <label>Visa Type</label>
          <select
            name="visaType"
            value={visaDetails.visaType}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select Visa Type
            </option>
            {visaTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Visa Start Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>          
          <DatePicker
            type="text"
            name="visaStartDate"
            className="form-control"
            value={dayjs(visaDetails.visaStartDate)}
            onChange={handleInputChange}
            required
          />      
          </LocalizationProvider>
        </div>
        <div>
          <label>Visa Expiry Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>          
          <DatePicker
            type="text"
            name="visaExpiryDate"
            className="form-control"
            value={dayjs(visaDetails.visaExpiryDate)}
            onChange={handleInputChange}
            required
          />      
          </LocalizationProvider>
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
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                VisaDetails Updated Successfully
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