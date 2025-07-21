import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import {
  createVisa,
  fetchEmployeeDetails,
  fetchVisaDetails,
  updateVisa,
} from "../SharedComponents/services/VisaDetailsService";

export default function VisaDetailsForm({ mode }) {
  const navigate = useNavigate();
  const { visaId, employeeId } = useParams();

  const [validationError, setValidationError] = useState("");
  const [startDateValidationError, setStartDateValidationError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
  });

  const [details, setDetails] = useState({
    visaType: "",
    visaStartDate: "",
    visaExpiryDate: "",
    visaNumber: "",
    i94Number: "",
    visaIssuedBy: "",
    issuedDate: "",
    i94Date: "",
    clientVendorName: "",
    lcaAddress: "",
    lcaNumber: "",
    lcaWage: "",
    jobTitle: "",
    i140Status: "",
  });

  const {
    visaType,
    visaStartDate,
    visaExpiryDate,
    visaNumber,
    i94Number,
    visaIssuedBy,
    issuedDate,
    i94Date,
    clientVendorName,
    lcaAddress,
    lcaNumber,
    lcaWage,
    jobTitle,
    i140Status,
  } = details;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await fetchEmployeeDetails(employeeId);
        if (employeeResponse) {
          setEmployeeDetails(employeeResponse);
        }

        if (mode === "edit") {
          const response = await fetchVisaDetails(visaId);
          setDetails(response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [mode, employeeId, visaId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const startDate = new Date(visaStartDate);
    const expiryDate = new Date(visaExpiryDate);

    if (startDate >= expiryDate) {
      setStartDateValidationError("Please Enter Valid Dates.");
      setValidationError("");
      return;
    }

    try {
      const success =
        mode === "edit"
          ? await updateVisa(visaId, details)
          : await createVisa(employeeId, details);

      if (success) {
        showModal();
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "adding"} visa:`, error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate(`/editemployee/${employeeId}/visa-details`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onInputChangeDate = (date, name) => {
    if (date) {
      setDetails((prev) => ({
        ...prev,
        [name]: date.format("YYYY-MM-DD"),
      }));
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div className="form-container">
      <h2 className="text-center m-4">
        {isEditMode ? "Edit" : "Add"} Visa Details
      </h2>

      {startDateValidationError && (
        <p className="text-danger">{startDateValidationError}</p>
      )}
      {validationError && <p className="text-danger">{validationError}</p>}

      <form onSubmit={onSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              value={employeeDetails.firstName || ""}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              value={employeeDetails.lastName || ""}
              disabled
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Visa Start Date</label>
            <DatePicker
              className="form-control"
              value={visaStartDate ? dayjs(visaStartDate) : null}
              onChange={(date) => onInputChangeDate(date, "visaStartDate")}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label>Visa Expiry Date</label>
            <DatePicker
              className="form-control"
              value={visaExpiryDate ? dayjs(visaExpiryDate) : null}
              onChange={(date) => onInputChangeDate(date, "visaExpiryDate")}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Visa Type</label>
          <select
            className="form-control"
            name="visaType"
            value={visaType}
            onChange={onInputChange}
            required
          >
            <option value="">Select Visa Type</option>
            <option value="H1B">H1B</option>
            <option value="OPT">OPT</option>
            <option value="GREENCARD">Green Card</option>
            <option value="H4AD">H4AD</option>
            <option value="CPT">CPT</option>
          </select>
        </div>

        <div className="form-group">
          <label>I-94 Date</label>
          <DatePicker
            className="form-control"
            value={i94Date ? dayjs(i94Date) : null}
            onChange={(date) => onInputChangeDate(date, "i94Date")}
          />
        </div>

        <div className="form-group">
          <label>LCA Address</label>
          <input
            type="text"
            className="form-control"
            name="lcaAddress"
            value={lcaAddress}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>LCA Number</label>
          <input
            type="text"
            className="form-control"
            name="lcaNumber"
            value={lcaNumber}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>LCA Wage</label>
          <input
            type="text"
            className="form-control"
            name="lcaWage"
            value={lcaWage}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            className="form-control"
            name="jobTitle"
            value={jobTitle}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>I-140 Status</label>
          <select
            className="form-control"
            name="i140Status"
            value={i140Status}
            onChange={onInputChange}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Denied">Denied</option>
          </select>
        </div>

        <button type="submit" className="btn btn-outline-primary">
          {isEditMode ? "Update" : "Submit"}
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Visa Details {isEditMode ? "Updated" : "Added"} Successfully</p>
        </Modal>
      </form>
    </div>
  );
}