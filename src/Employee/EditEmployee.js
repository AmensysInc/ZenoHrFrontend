import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./EditEmployee.css";
import { DatePicker } from "antd";
import { Modal } from "antd";
import dayjs from "dayjs";

export default function EditEmployee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let { employeeId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    dob: "",
    clgOfGrad: "",
    visaStatus: "",
    phoneNo: "",
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
  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };
  const onInputChangeDate = (date, name) => {
    setEmployee({ ...employee, [name]: date.format("YYYY-MM-DD") });
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
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
      if (response.status === 200) {
        showModal();
      }
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const handleProjectHistory = (employeeId) => {
    navigate(`/editemployee/${employeeId}/project-history`);
  };

  const handleVisaDetails = (employeeId) => {
    navigate(`/editemployee/${employeeId}/visa-details`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <div>
      <div className="button-container">
        <button
          type="button"
          className="project-history"
          onClick={() => handleProjectHistory(employeeId)}
        >
          Project History
        </button>
        <button
          type="button"
          className="project-history"
          onClick={() => handleVisaDetails(employeeId)}
        >
          Visa Details
        </button>
      </div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Employee</h2>
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
            <label htmlFor="clgOfGrad">College of Graduation</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name of the college"
              name="clgOfGrad"
              value={clgOfGrad}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clgOfGrad">College of Graduation</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name of the college"
              name="clgOfGrad"
              value={clgOfGrad}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clgOfGrad">Phone No</label>
            <input
              type="text"
              className="form-control"
              placeholder="Phone no"
              name="phoneNo"
              value={phoneNo}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="onBench">Working Stauts</label>
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
            <label htmlFor="password">Password</label>
            <input
              type={"text"}
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <button type="submit" className="btn btn-outline-primary" onClick={showModal}>
            Update
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Employee Updated succesfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}
