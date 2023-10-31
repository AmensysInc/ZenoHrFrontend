import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
import dayjs from "dayjs";
import FormInput from "../SharedComponents/FormInput";

export default function EditVisaDetails() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [visaDetails, setVisaDetails] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { employeeId, visaId } = useParams();

  useEffect(() => {
    fetchVisaDetailsAndEmployee();
  }, []);

  const fetchVisaDetailsAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const visaresponse = await fetch(
        `${apiUrl}/visa-details/${visaId}`,
        requestOptions
      );
      if (!visaresponse.ok) {
        throw new Error("Failed to fetch Visa Details");
      }
      const visaDetails = await visaresponse.json();
      setVisaDetails(visaDetails);
      const employeeResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );

      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employee details");
      }
      const employeeData = await employeeResponse.json();
      setEmployeeDetails(employeeData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (
      dayjs(visaDetails.visaExpiryDate).isBefore(
        dayjs(visaDetails.visaStartDate)
      )
    ) {
      alert("Visa end date cannot be before the start date.");
    } else {
      try {
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(visaDetails),
        };
        const response = await fetch(
          `${apiUrl}/employees/visa-details/${visaId}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Failed to update order");
        }
        if (response.status === 200) {
          showModal();
        }
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }
  };

  const onInputChange = (e) => {
    setVisaDetails({ ...visaDetails, [e.target.name]: e.target.value });
  };
  const onInputChangeDate = (date, name) => {
    if (date) {
      setVisaDetails({ ...visaDetails, [name]: date.format("YYYY-MM-DD") });
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const selectOptions = [
    { label: "-- Select --", value: "" },
    { label: "H1B", value: "H1B" },
    { label: "OPT", value: "OPT" },
    { label: "Green Card", value: "Green Card" },
    { label: "CPT", value: "CPT" },
  ];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Edit Visa Details</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-row">
          <FormInput
            label="First Name"
            type="text"
            name="firstName"
            value={employeeDetails.firstName}
            onChange={onInputChange}
            required
          />
          <FormInput
            label="Last Name"
            type="text"
            name="lastName"
            value={employeeDetails.lastName}
            onChange={onInputChange}
          />
        </div>
        <div>
          <FormInput
            label="Visa Type"
            type="select"
            name="visaType"
            value={visaDetails.visaType}
            onChange={onInputChange}
            required
            selectOptions={selectOptions}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <FormInput
              label="Visa Start Date"
              type="date"
              className="form-control"
              name="visaStartDate"
              value={
                visaDetails.visaStartDate
                  ? dayjs(visaDetails.visaStartDate)
                  : null
              }
              onChange={(date) => onInputChangeDate(date, "visaStartDate")}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <FormInput
              label="Visa Expiry Date"
              type="date"
              className="form-control"
              name="visaExpiryDate"
              value={
                visaDetails.visaExpiryDate
                  ? dayjs(visaDetails.visaExpiryDate)
                  : null
              }
              onChange={(date) => onInputChangeDate(date, "visaExpiryDate")}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Update
        </button>
        <button
          type="button"
          className="btn btn-outline-danger mx-2"
          onClick={() => handleNavigate(employeeId)}
        >
          Cancel
        </button>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>VisaDetails Updated succesfully</p>
        </Modal>
      </form>
    </div>
  );
}
