import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { DatePicker } from "antd";
import { Modal } from 'antd';
import  dayjs  from 'dayjs';

export default function EditOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let { employeeId, orderId } = useParams();

  const [order, setOrder] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderAndEmployee();
  }, []);

  const fetchOrderAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const [orderResponse, employeeResponse] = await Promise.all([
        axios.get(`${apiUrl}/orders/${orderId}`, requestOptions),
        axios.get(`${apiUrl}/employees/${employeeId}`, requestOptions),
      ]);
  
      setOrder(orderResponse.data);
      setEmployeeDetails(employeeResponse.data);
  
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${apiUrl}/employees/orders/${orderId}`,
        order,
        requestOptions
      );

      if (response.status === 200) {
        showModal();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate(`/orders/${employeeId}`);
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleInputChangeDate = (date, name) => {
    setOrder((prevDetails) => ({
      ...prevDetails,
      [name]: date.format("YYYY-MM-DD"),
    }));
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
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Order</h2>
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
          <label>Date Of Joining:</label>
          <DatePicker
             type="text"
             name="dateOfJoining"
             className="form-control"
             value={dayjs(order.dateOfJoining)}
             onChange={(date) => handleInputChangeDate(date, "dateOfJoining")}
             required
            />
        </div>
        <div>
          <label>Project End Date:</label>
          <DatePicker
            type="text"
            name="projectEndDate"
            className="form-control"
            value={dayjs(order.projectEndDate)}
            onChange={(date) => handleInputChangeDate(date, "projectEndDate")}
            required
            />
        </div>
        <div>
          <label>Bill Rate:</label>
          <input
            type="text"
            name="billRate"
            value={order.billRate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            name="endClientName"
            value={order.endClientName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Vendor PhoneNo:</label>
          <input
            type="text"
            name="vendorPhoneNo"
            value={order.vendorPhoneNo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Vendor Email:</label>
          <input
            type="text"
            name="vendorEmailId"
            value={order.vendorEmailId}
            onChange={handleInputChange}
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
        </form>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>PurchaseOrder Updated succesfully</p>
      </Modal>
      </div>
    </div>
  );
}
