import React, { useState, useEffect } from "react";
import { Modal, DatePicker, Alert } from "antd";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
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
  const { employeeId } = useParams();
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

  const isEditMode = mode === "edit";

  useEffect(() => {
    const fetchData = async () => {
      const companyData = await fetchCompanies(0, 10);
      setCompanies(companyData?.content || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode && employeeId) {
      const fetchData = async () => {
        const data = await fetchEmployeeDataById(employeeId);
        if (data) {
          setEmployee({
            ...data,
            company: data.company?.companyId || "",
          });
        }
      };
      fetchData();
    }
  }, [isEditMode, employeeId]);

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

    Object.keys(employeeToSend).forEach((key) => {
      if (employeeToSend[key] === "") {
        employeeToSend[key] = null;
      }
    });
    delete employeeToSend.company;

    try {
      const success = isEditMode
        ? await updateEmployee(employeeId, employeeToSend)
        : await createEmployee(employeeToSend);

      if (success) {
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error?.response) {
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
    if (success) setSendDetailsSuccess(true);
    else setError("An error occurred");
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const isAlphaNumeric = (value) =>
    value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 50);

  const isValidPassword = (value) => {
    const pattern = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[^A-Za-z\d]).{8,}$/; // enforce 8+ chars
    return pattern.test(value) && value.length <= 50;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "firstName" || name === "lastName") {
      newValue = isAlphaNumeric(value);
    }
    setEmployee((prev) => ({ ...prev, [name]: newValue }));
  };

  const onInputChangeDate = (date, name) => {
    if (date) {
      setEmployee((prev) => ({ ...prev, [name]: date.format("YYYY-MM-DD") }));
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div style={{ paddingBottom: "1%" }}>{isEditMode && <Buttons />}</div>

      <div className="form-container">
        {error && (
          <Alert
            className="mb-3"
            message={error}
            type="error"
            closable
            onClose={() => setError(null)}
          />
        )}
        {sendDetailsSuccess && (
          <Alert
            className="mb-3"
            message="Login Details emailed successfully"
            type="success"
            showIcon
            closable
          />
        )}

        <h2 className="text-center m-4">{isEditMode ? "Edit" : "Add"} Employee</h2>

        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={onInputChange}
                required
                pattern="^[A-Za-z0-9 ]+$"
                maxLength={50}
                title="First Name"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={onInputChange}
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
                id="emailID"
                type="email"
                className="form-control"
                placeholder="Email Address"
                name="emailID"
                value={emailID}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="phoneNo">Phone No</label>
              <input
                id="phoneNo"
                type="number"
                className="form-control"
                placeholder="Phone no"
                name="phoneNo"
                value={phoneNo}
                onChange={onInputChange}
                required
              />
            </div>
            {/* If you need DOB, keep one of these DatePicker blocks and ensure value uses dayjs correctly */}
            {/* <div className="form-group col-md-6">
              <label htmlFor="DOB">Date Of Birth</label>
              <DatePicker
                className="form-control"
                placeholder="Date of Birth"
                name="dob"
                value={dob ? dayjs(dob) : null}
                onChange={(date) => onInputChangeDate(date, "dob")}
                required
              />
            </div> */}
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="company">Company</label>
              <select
                id="company"
                className="form-control"
                name="company"
                value={company || ""}
                onChange={onInputChange}
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
                className="form-control"
                name="onBench"
                value={onBench || ""}
                onChange={onInputChange}
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

          <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
            {isEditMode && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleSendDetails}
              >
                Send Login Details
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-outline-primary">
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Employee {isEditMode ? "Updated" : "Added"} successfully</p>
      </Modal>
    </div>
  );
}