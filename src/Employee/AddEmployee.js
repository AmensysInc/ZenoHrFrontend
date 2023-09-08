import "./Employee.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function AddEmployee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    dob: "",
    clgOfGrad: "",
    phoneNo:"",
    onBench: "",
    email: "",
    password: "",
  });

  const {
    firstName,
    lastName,
    emailID,
    dob,
    clgOfGrad,
    phoneNo,
    onBench,
    email,
    password,
  } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
        body: JSON.stringify(user),
      };

      const response = await fetch(`${apiUrl}/employees`, requestOptions);
      if(response.status === 201){
        handleOpenPopup();
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };
    const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add Employee</h2>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type={"text"}
              className="form-control"
              name="firstName"
              value={firstName}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type={"text"}
              className="form-control"
              name="lastName"
              value={lastName}
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="emailID">Email Address</label>
          <input
            type={"text"}
            className="form-control"
            name="emailID"
            value={emailID}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
        <label htmlFor="emailID">Date of Birth</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="form-control"
            value={dob}
            onChange={(date) => onInputChange({ target: { name: "dob", value: date } })}
            required
          />
        </LocalizationProvider>
        </div>
        <div className="form-group">
          <label htmlFor="clgOfGrad">Name of the college</label>
          <input
            type={"text"}
            className="form-control"
            name="clgOfGrad"
            value={clgOfGrad}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="clgOfGrad">Phone No</label>
          <input
            type={"text"}
            className="form-control"
            name="phoneNo"
            value={phoneNo}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="onBench">Working or Bench</label>
          <select
            id="onBench"
            name="onBench"
            value={onBench}
            onChange={(e) => onInputChange(e)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Working">onBench</option>
            <option value="OnProject">OnProject</option>
            <option value="OnVacation">OnVacation</option>
            <option value="OnSick">OnSick</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">User Name</label>
          <input
            type={"text"}
            className="form-control"
            name="email"
            value={email}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={"text"}
            className="form-control"
            name="password"
            value={password}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Employee added Successfully
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

