import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [order, setOrder] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId,employeeId } = location.state;

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

      const orderResponse = await fetch(`${apiUrl}/orders/${orderId}`, requestOptions);
      if (!orderResponse.ok) {
        throw new Error("Failed to fetch order");
      }
      const orderData = await orderResponse.json();
      setOrder(orderData);

      const employeeResponse = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
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
        body: JSON.stringify(order),
      };
      const response = await fetch(`${apiUrl}/employees/orders/${orderId}`, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
      navigate("/");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate("/orders", { state: { employeeId } });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Order</h2>
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
          <input
            type="text"
            name="dateOfJoining"
            value={order.dateOfJoining}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date Of Joining:</label>
          <input
            type="text"
            name="dateOfJoining"
            value={order.dateOfJoining}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Project End Date:</label>
          <input
            type="text"
            name="projectEndDate"
            value={order.projectEndDate}
            onChange={handleInputChange}
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
        <button type="submit">Update</button>
        <button
          type="button"
          className="btn btn-outline-danger mx-2"
          onClick={() => handleNavigate(employeeId)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}