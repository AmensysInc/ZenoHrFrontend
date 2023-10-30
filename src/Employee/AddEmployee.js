import "./Employee.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Modal } from "antd";
import FormInput from "../SharedComponents/FormInput";

export default function AddEmployee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    dob: "",
    clgOfGrad: "",
    phoneNo: "",
    onBench: "",
    email: "",
    securityGroup: "",
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
    securityGroup,
    password,
  } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const onInputChangeDate = (date, name) => {
    if (date) {
      setUser({ ...user, [name]: date.format("YYYY-MM-DD") });
    }
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
      console.log(response);
      if (response.status === 201) {
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

  const selectOptions = [
    { label: "-- Select --", value: "" },
    { label: "onBench", value: "onBench" },
    { label: "OnProject", value: "OnProject" },
    { label: "OnVacation", value: "OnVacation" },
    { label: "OnSick", value: "OnSick" },
  ];
  const selectOption = [
    { label: "-- Select --", value: "" },
    { label: "ADMIN", value: "ADMIN" },
    { label: "EMPLOYEE", value: "EMPLOYEE" },
    { label: "PROSPECT", value: "PROSPECT" },
    { label: "SALES", value: "SALES" },
    { label: "RECRUITER", value: "RECRUITER" },
  ];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add Employee</h2>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <FormInput
            label="First Name"
            type="text"
            name="firstName"
            value={firstName}
            onChange={onInputChange}
            required
          />
          <FormInput
            label="Last Name"
            type="text"
            name="lastName"
            value={lastName}
            onChange={onInputChange}
          />
        </div>
        <FormInput
          label="Email"
          type="email"
          name="emailID"
          value={emailID}
          onChange={onInputChange}
          required
          placeholder="Email Address"
        />
        <FormInput
          label="dob"
          type="date"
          className="form-control"
          name="dateOfJoining"
          value={dob ? dayjs(dob) : null}
          onChange={(date) => onInputChangeDate(date, "dob")}
          required
        />
        <FormInput
          label="College of Graduation"
          type="text"
          name="clgOfGrad"
          value={clgOfGrad}
          onChange={onInputChange}
          required
        />
        <FormInput
          label="Phone No"
          type="number"
          name="phoneNo"
          value={phoneNo}
          onChange={onInputChange}
          required
        />
        <FormInput
          label="Working Status"
          type="select"
          name="onBench"
          value={onBench}
          onChange={onInputChange}
          required
          selectOptions={selectOptions}
        />
        <FormInput
          label="Authorization"
          type="select"
          name="securityGroup"
          value={securityGroup}
          onChange={onInputChange}
          required
          selectOptions={selectOption}
        />
        <FormInput
          label="Password"
          type="text"
          name="password"
          value={password}
          onChange={onInputChange}
        />
        <button type="submit" className="btn btn-outline-primary">
          Update
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>

        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Employee Added successfully</p>
        </Modal>
      </form>
    </div>
  );
}
