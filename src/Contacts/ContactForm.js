import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createEmployee,
  fetchEmployeeDataById,
  updateEmployee,
} from "../SharedComponents/services/ContactServices";

export default function ContactForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    linkedinLink: "", // Updated field name to match backend
  });

  const { firstName, lastName, email, phoneNumber, linkedinLink } = employee;

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchData = async () => {
        try {
          const employeeData = await fetchEmployeeDataById(id);
          if (employeeData) {
            setEmployee(employeeData);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };
      fetchData();
    }
  }, [mode, id]);

  const onSubmit = async (event) => {
  event.preventDefault();
  try {
    const success =
      mode === "edit"
        ? await updateEmployee(id, employee)
        : await createEmployee(employee); // Send as object, not array

    if (success) {
      showModal();
    }
  } catch (error) {
    console.error(
      `Error ${mode === "edit" ? "updating" : "adding"} contact:`,
      error.response?.data || error.message
    );
  }
};


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/contacts");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/contacts");
  };

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const isEditMode = mode === "edit";

  return (
    <div className="container mt-4">
      <div className="form-container">
        <h2 className="text-center mb-4">
          {isEditMode ? "Edit" : "Add"} Contact
        </h2>
        <form onSubmit={onSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={firstName}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={lastName}
                onChange={onInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="linkedinLink" className="form-label">
              LinkedIn Profile
            </label>
            <input
              type="url"
              className="form-control"
              name="linkedinLink"
              value={linkedinLink}
              onChange={onInputChange}
              placeholder=""
            />
          </div>

          <button type="submit" className="btn btn-outline-primary me-2">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger" to="/contacts">
            Cancel
          </Link>
        </form>

        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Contact {isEditMode ? "Updated" : "Added"} successfully!</p>
        </Modal>
      </div>
    </div>
  );
}
