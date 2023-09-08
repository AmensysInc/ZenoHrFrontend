import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "antd";
import { Modal } from 'antd';
import  dayjs  from 'dayjs';

export default function EditVisaDetails() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [visaDetails, setVisaDetails] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visaTypeOptions, setVisaTypeOptions] = useState([
    "H1B",
    "OPT",
    "Green Card",
    "H4 EAD",
    "CPT",
  ]);
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
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVisaDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleInputChangeDate = (date, name) => {
    setVisaDetails((prevDetails) => ({
      ...prevDetails,
      [name]: date.format("YYYY-MM-DD"),
    }));
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

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Edit Visa Details</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={employeeDetails.firstName || ""}
            readOnly
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={employeeDetails.lastName || ""}
            readOnly
          />
        </div>
        <div>
          <label>Visa Type</label>
          <select
            name="visaType"
            value={visaDetails.visaType}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select Visa Type
            </option>
            {visaTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Visa Start Date</label>
          <DatePicker
               type="text"
               name="visaStartDate"
               className="form-control"
               value={dayjs(visaDetails.visaStartDate)}
               onChange={(date) => handleInputChangeDate(date, "visaStartDate")}
               required
          />  
        </div>
        <div>
          <label>Visa Expiry Date</label>
          <DatePicker
               type="text"
               name="visaExpiryDate"
               className="form-control"
               value={dayjs(visaDetails.visaExpiryDate)}
               onChange={(date) => handleInputChangeDate(date, "visaExpiryDate")}
               required
          />          
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
