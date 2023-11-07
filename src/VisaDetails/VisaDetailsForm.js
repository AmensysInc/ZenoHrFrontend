import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { createVisa, fetchEmployeeDetails, fetchVisaDetails, updateVisa } from "../SharedComponents/apicalls/VisaDetailsService";

export default function VisaDetailsForm({ mode }) {
  let navigate = useNavigate();
  let { visaId, employeeId } = useParams();
  const [validationError, setValidationError] = useState("");
  const [startDateValidationError, setStartDateValidationError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
  });
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    visaType: "",
    visaStartDate: "",
    visaExpiryDate: "",
  });

  const { firstName, lastName, visaType, visaStartDate, visaExpiryDate } = details;

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "add" || (mode === "edit" && employeeId)) {
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
      }
    };
    
    fetchData();
  }, [mode, employeeId, visaId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const startDate = new Date(visaStartDate);
    const expiryDate = new Date(visaExpiryDate);

    if (startDate >= expiryDate) {
      setStartDateValidationError("Please Enter Valid Details.");
      setValidationError("");
      return;
    }
    try {
      const success = mode === "edit"
        ? await updateVisa(visaId, details)
        : await createVisa(employeeId, details);
  
      if (success) {
        showModal();
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "adding"} project:`, error);
    }
  }

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
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const onInputChangeDate = (date, name) => {
    if (date) {
      setDetails({ ...details, [name]: date.format("YYYY-MM-DD") });
    }
  };
  

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} VisaDetails
        </h2>
        {startDateValidationError && (
          <p className="text-danger">{startDateValidationError}</p>
        )}
        {validationError && <p className="text-danger">{validationError}</p>}
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={employeeDetails.firstName || ""}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={employeeDetails.lastName || ""}
                disabled
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="visaStartDate">Visa Start Date</label>
              <DatePicker
                className="form-control"
                name="visaStartDate"
                value={visaStartDate ? dayjs(visaStartDate) : null}
                onChange={(date) => onInputChangeDate(date, "visaStartDate")}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>Visa Expiry Date</label>
              <DatePicker
                type="text"
                name="visaExpiryDate"
                className="form-control"
                value={visaExpiryDate ? dayjs(visaExpiryDate) : null}
                onChange={(date) => onInputChangeDate(date, "visaExpiryDate")}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="visaType">Visa Type</label>
            <select
              id="visaType"
              name="visaType"
              value={visaType}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option value="">Select Visa Type</option>
              <option value="H1B">H1B</option>
              <option value="OPT">OPT</option>
              <option value="GREENCARD">GREENCARD</option>
              <option value="H4AD">H4AD</option>
              <option value="CPT">CPT</option>
            </select>
          </div>
          <button type="submit" className="btn btn-outline-primary">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>VisaDetails {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}
