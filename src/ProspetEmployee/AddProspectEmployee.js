import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import { Modal } from 'antd';

export default function AddProspectEmployee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      const response = await fetch(`${apiUrl}/employees/prospect`, requestOptions);
      console.log(response);
      if(response.status === 200){
        showModal();
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
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
    <div className="form-container">
      <h2 className="text-center m-4">Add ProspetEmployee</h2>

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
        <DatePicker
              className="form-control"
              value={dob}
              onChange={(date) => onInputChange({ target: { name: "dob", value: date } })}
              required
        />
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
        {/* <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={"text"}
            className="form-control"
            name="password"
            value={password}
            onChange={(e) => onInputChange(e)}
          />
        </div> */}
        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Prospect Employee added succesfully</p>
      </Modal>
      </form>
    </div>
  );
}


