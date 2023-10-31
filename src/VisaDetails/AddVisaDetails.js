import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Modal } from 'antd';
import FormInput from "../SharedComponents/FormInput";

export default function AddVisaDetails() {
    const apiUrl = process.env.REACT_APP_API_URL;
    let navigate = useNavigate();
    const { employeeId } = useParams();
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [validationError, setValidationError] = useState("");
    const [startDateValidationError, setStartDateValidationError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [details, setDetails] = useState({
      firstName: "",
      lastName: "",
      visaType: "",
      visaStartDate: "",
      visaExpiryDate: ""
    });

    const {firstName, lastName, visaType, visaStartDate, visaExpiryDate} = details;

    useEffect(() => {
        loadEmployeeDetails();
      }, []);
    
      const loadEmployeeDetails = async () => {
        try {
          const token = localStorage.getItem("token");
    
          var myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
    
          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
    
          const response = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
          const data = await response.json();
          setEmployeeDetails(data);
        } catch (error) {
          console.error("Error loading employee details:", error);
        }
      };

      const onSubmit = async (e) => { 
        e.preventDefault();
      
        const startDate = new Date(visaStartDate);
    const expiryDate = new Date(visaExpiryDate);

    if (startDate >= expiryDate) {
      setStartDateValidationError("Please Enter Valid Details.");
      setValidationError("");
      return;
    }
      
        try {
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(details)
          };
          const response = await fetch(`${apiUrl}/employees/${employeeId}/visa-details`, requestOptions);
          if(response.status === 200){
            showModal();
          }
        } catch (error) {
          console.error("Error adding order:", error);
        }
      };

      const onInputChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
      };
      const onInputChangeDate = (date, name) => {
        if (date) {
          setDetails({ ...details, [name]: date.format("YYYY-MM-DD") });
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

      const selectOptions = [
        { label: "-- Select --", value: "" },
        { label: "H1B", value: "H1B" },
        { label: "OPT", value: "OPT" },
        { label: "Green Card", value: "Green Card" },
        { label: "CPT", value: "CPT" },
      ];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">New Visa Details</h2>
      {startDateValidationError && <p className="text-danger">{startDateValidationError}</p>}
      {validationError && <p className="text-danger">{validationError}</p>}
      <form onSubmit={(e) => onSubmit(e)}>

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
            value={visaType}
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
                visaStartDate
                  ? dayjs(visaStartDate)
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
                visaExpiryDate
                  ? dayjs(visaExpiryDate)
                  : null
              }
              onChange={(date) => onInputChangeDate(date, "visaExpiryDate")}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger mx-2"
          onClick={() => handleNavigate(employeeId)}
        >
          Cancel
        </button>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>VisaDetails added succesfully</p>
      </Modal>        
      </form>
    </div>
  )
}