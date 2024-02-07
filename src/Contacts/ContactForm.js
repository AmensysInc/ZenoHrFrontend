import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createEmployee, fetchEmployeeDataById, updateEmployee } from "../SharedComponents/services/ContactServices";

export default function ContactForm({ mode }) {
  const navigate = useNavigate();
  let { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
  } = employee;

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchData = async () => {
        const employeeData = await fetchEmployeeDataById(id);
        if (employeeData) {
          setEmployee(employeeData);
        }
      };
      fetchData();
    }
  }, [mode, id]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const success = mode === "edit"
        ? await updateEmployee(id, employee)
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
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} Contact
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
              name="email"
              value={email}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="phoneNumber">Phone No</label>
            <input
              type="number"
              className="form-control"
              placeholder="Phone no"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          </div>
          <button type="submit" className="btn btn-outline-primary">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/contacts">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Contact {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}
