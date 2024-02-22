import React, { useState, useEffect } from "react";
import { Modal, DatePicker, Alert } from "antd";
import dayjs from "dayjs";
import { useNavigate, useParams, Link } from "react-router-dom";
import Buttons from "./Buttons";
import {
  createEmployee,
  fetchEmployeeDataById,
  sendLoginDetails,
  updateEmployee,
} from "../SharedComponents/services/EmployeeServices";
import { fetchCompanies } from "../SharedComponents/services/CompaniesServies";

export default function EmployeeForm({ mode }) {
  const navigate = useNavigate();
  let { employeeId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendDetailsSuccess, setSendDetailsSuccess] = useState(false);
  const [error, setError] = useState(null);

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
    company: "",
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
    company,
  } = employee;

  useEffect(() => {
    const fetchData = async () => {
      const companyData = await fetchCompanies();
      setCompanies(companyData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mode === "edit" && employeeId) {
      const fetchData = async () => {
        const employeeData = await fetchEmployeeDataById(employeeId);
        if (employeeData) {
          setEmployee(employeeData);
        }
      };
      fetchData();
    }
  }, [mode, employeeId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const success =
        mode === "edit"
          ? await updateEmployee(employeeId, employee)
          : await createEmployee(employee);

      if (success) {
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
    const success = await sendLoginDetails(emailID);
    if (success) {
      setSendDetailsSuccess(true);
    } else {
      setError("An error occurred");
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
    <div className="form-container">
      {error && (
        <Alert
          message={error}
          type="error"
          closable
          onClose={() => setError(null)}
        />
      )}
      {sendDetailsSuccess && (
        <Alert
          message="Login Details emailed successfully"
          type="success"
          showIcon
          closable
        />
      )}
      {isEditMode && <Buttons />}
      <h2 className="text-center m-4">
        {isEditMode ? "Edit" : "Add"} Employee
      </h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group col-md-6">
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
          <div className="form-group col-md-6">
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
        <div className="form-row">
          <div className="form-group col-md-6">
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
            <div className="form-group col-md-6">
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
            <div className="form-group col-md-6">
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
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
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
          <div className="form-group col-md-6">
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
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
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
          <div className="form-group col-md-6">
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
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="company">Company</label>
            <select
              className="form-control"
              name="company"
              value={company}
              onChange={(e) => onInputChange(e)}
            >
              <option value="">-- Select --</option>
              {Array.isArray(companies) &&
                companies.map((companyData) => (
                  <option
                    key={companyData.employeeID}
                    value={companyData.companyName}
                  >
                    {companyData.companyName}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="password">Password</label>
            <input
              type={"text"}
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => onInputChange(e)}
            />
          </div>
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
  );
}
