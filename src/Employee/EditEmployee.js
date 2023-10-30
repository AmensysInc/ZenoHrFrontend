import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Employee.css";
import { Modal } from "antd";
import dayjs from "dayjs";
import FormInput from "../SharedComponents/FormInput";

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
    if (date) {
      setEmployee({ ...employee, [name]: date.format("YYYY-MM-DD") });
    }
  };

  const handleSendDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailID }),
      });
      if (response.ok) {
        console.log("Password reset email sent successfully.");
      } else {
        console.error("Password reset request failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    navigate("/");
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
    <div>
      <div className="button-container">
        <button
          type="button"
          className="add-user-link"
          onClick={() => handleProjectHistory(employeeId)}
          title="Project History"
          style={{ marginLeft: "4000px" }}
        >
          Project History
        </button>
        <button
          type="button"
          className="add-pro-link"
          onClick={() => handleVisaDetails(employeeId)}
          title="Visa Details"
          style={{ marginLeft: "4000px" }}
        >
          Visa Details
        </button>
      </div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Employee</h2>
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
            type="text"
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
            type="text"
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
          <button
            type="submit"
            className="btn btn-outline-primary"
            onClick={handleSendDetails}
          >
            Send Login Details
          </button>

          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Details Emailed successfully</p>
          </Modal>

          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Employee Updated successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}
