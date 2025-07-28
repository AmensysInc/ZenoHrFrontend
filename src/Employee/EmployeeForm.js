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
      const companyData = await fetchCompanies(0, 10);
      console.log("Fetched Companies:", companyData);
      setCompanies(companyData.content);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mode === "edit" && employeeId) {
      const fetchData = async () => {
        const employeeData = await fetchEmployeeDataById(employeeId);
        if (employeeData) {
          setEmployee({
            ...employeeData,
            company: employeeData.company?.companyId || "",
          });
        }
      };
      fetchData();
    }
  }, [mode, employeeId]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!isValidPassword(employee.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
      );
      return;
    }
    const employeeToSend = {
      ...employee,
      companyId: employee.company ? parseInt(employee.company, 10) : null,
    };

    // Remove empty fields that might cause validation issues
    Object.keys(employeeToSend).forEach((key) => {
      if (employeeToSend[key] === "") {
        employeeToSend[key] = null;
      }
    });

    delete employeeToSend.company;
    try {
      console.log("Submitting employee:", employeeToSend);

      const success =
        mode === "edit"
          ? await updateEmployee(employeeId, employeeToSend)
          : await createEmployee(employeeToSend);

      if (success) {
        showModal();
      }
    } catch (error) {
      console.error("Full Axios error:", error);

      if (error.response) {
        console.error("Backend responded with:", error.response.data);
        setError(
          error.response.data?.message ||
            JSON.stringify(error.response.data) ||
            "An unknown error occurred."
        );
      } else {
        setError("Failed to reach server. Please check your connection.");
      }
    }
  };

  const handleSendDetails = async (e) => {
    e.preventDefault();
    const success = await sendLoginDetails(emailID);
    console.log(emailID);
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

  const isAlphaNumeric = (value) => {
    return value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 50);
  };

  const isValidPassword = (value) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{0,}$/;
    return pattern.test(value) && value.length <= 50;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "firstName" || name === "lastName") {
      newValue = isAlphaNumeric(value);
    }
    setEmployee({ ...employee, [name]: newValue });
  };

  const onInputChangeDate = (date, name) => {
    if (date) {
      setEmployee({ ...employee, [name]: date.format("YYYY-MM-DD") });
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
      }}
    >
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
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => onInputChange(e)}
                required
                pattern="^[A-Za-z0-9 ]+$"
                maxLength={50}
                title="First Name"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => onInputChange(e)}
                pattern="^[A-Za-z0-9 ]+$"
                maxLength={50}
                title="Last Name"
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
            {/* {mode === "add" ? (
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
            )} */}
          </div>
          <div className="form-row">
            {/* <div className="form-group col-md-6">
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
            </div> */}
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
                      key={companyData.companyId}
                      value={companyData.companyId}
                    >
                      {companyData.companyName}
                    </option>
                  ))}
              </select>
            </div>
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
                <option value="Working">On Bench</option>
                <option value="OnProject">On Project</option>
                <option value="OnVacation">On Vacation</option>
                <option value="OnSick">On Sick</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            {/* <div className="form-group col-md-6">
              <label htmlFor="securityGroup">Role</label>
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
            </div> */}
            {/* <div className="form-group col-md-6">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => onInputChange(e)}
                maxLength={50}
                required
                placeholder="e.g. StrongP@ss1"
                title="Min 8 characters with uppercase, lowercase, number, and symbol"
              />
            </div> */}
          </div>
          {/* <div className="form-row">
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
                      key={companyData.companyId}
                      value={companyData.companyId}
                    >
                      {companyData.companyName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => onInputChange(e)}
                maxLength={50}
                required
                placeholder="e.g. StrongP@ss1"
                title="Min 8 characters with uppercase, lowercase, number, and symbol"
              />
            </div>
          </div> */}
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
      <div style={{ paddingBottom: "1%" }}>{isEditMode && <Buttons />}</div>
    </div>
  );
}
