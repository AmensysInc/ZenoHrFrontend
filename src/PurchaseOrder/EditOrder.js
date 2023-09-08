import axios from "axios";
import React, { useEffect, useState } from "react";
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

export default function EditOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, employeeId } = location.state;

  const [order, setOrder] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderAndEmployee();
  }, []);

  const fetchOrderAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [orderResponse, employeeResponse] = await Promise.all([
        axios.get(`${apiUrl}/orders/${orderId}`, requestOptions),
        axios.get(`${apiUrl}/employees/${employeeId}`, requestOptions),
      ]);

      setOrder(orderResponse.data);
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
        `${apiUrl}/employees/orders/${orderId}`,
        order,
        requestOptions
      );

      if (response.status === 200) {
        handleOpenPopup();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate("/orders", { state: { employeeId } });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/orders", { state: { employeeId } });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Order</h2>
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
          <label>Date Of Joining:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>          
          <DatePicker
            type="text"
            name="dateOfJoining"
            className="form-control"
            value={dayjs(order.dateOfJoining)}
            onChange={handleInputChange}
            required
          />      
          </LocalizationProvider>
        </div>
        <div>
          <label>Project End Date:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>          
          <DatePicker
            type="text"
            name="projectEndDate"
            className="form-control"
            value={dayjs(order.projectEndDate)}
            onChange={handleInputChange}
            required
          />      
          </LocalizationProvider>
        </div>
        <div>
          <label>Bill Rate:</label>
          <input
            type="text"
            name="billRate"
            value={order.billRate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            name="endClientName"
            value={order.endClientName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Vendor PhoneNo:</label>
          <input
            type="text"
            name="vendorPhoneNo"
            value={order.vendorPhoneNo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Vendor Email:</label>
          <input
            type="text"
            name="vendorEmailId"
            value={order.vendorEmailId}
            onChange={handleInputChange}
          />
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
              PurchaseOrder Updated Successfully
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
