import React, { useState, useEffect } from "react";
import { Modal, DatePicker } from "antd";
import dayjs from "dayjs";
import { useNavigate, useParams, Link } from "react-router-dom";
import Buttons from "./Buttons";

export default function EmployeeForm({ mode }) {
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
    if (mode === "edit" && employeeId) {
      const fetchEmployeeData = async () => {
        try {
          const token = localStorage.getItem("token");
          const requestOptions = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await fetch(
            `${apiUrl}/employees/${employeeId}`,
            requestOptions
          );

          if (response.status === 200) {
            const employeeData = await response.json();
            setEmployee(employeeData);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };
      fetchEmployeeData();
    }
  }, [mode, employeeId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(employee),
      };

      const response = await fetch(
        `${apiUrl}/employees${mode === "edit" ? `/${employeeId}` : ""}`,
        requestOptions
      );

      if (response.status === 200 || response.status === 201) {
        showModal();
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "adding"} employee:`,
        error
      );
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

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };
  
  const onInputChangeDate = (date, name) => {
    if (date) {
      setEmployee({ ...employee, [name]: date.format("YYYY-MM-DD") });
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
      {isEditMode && <Buttons />}
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} Employee
        </h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
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
                type="text"
                className="form-control"
                name="lastName"
                value={lastName}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="emailID">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              name="emailID"
              value={emailID}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          {mode === "add" ? (
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <DatePicker
                className="form-control"
                value={dob}
                onChange={(date) =>
                  onInputChange({ target: { name: "dob", value: date } })
                }
                required
              />
            </div>
          ) : (
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
          )}
          <div className="form-group">
            <label htmlFor="clgOfGrad">College of Graduation</label>
            <input
              type="text"
              className="form-control"
              placeholder="College of Graduation"
              name="clgOfGrad"
              value={clgOfGrad}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNo">Phone No</label>
            <input
              type="number"
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
            <label htmlFor="securityGroup">Authorization</label>
            <select
              id="securityGroup"
              name="securityGroup"
              value={securityGroup}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option value="">-- Select --</option>
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="PROSPECT">Prospect</option>
              <option value="SALES">Sales</option>
              <option value="RECRUITER">Recruiter</option>
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
          <button type="submit" className="btn btn-outline-primary">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Employee {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
          {isEditMode && (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleSendDetails}
            >
              Send Login Details
            </button>
          )}
        </form>
      </div>
    </div>
  );
}


