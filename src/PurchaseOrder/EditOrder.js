import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [order, setOrder] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId,employeeId } = location.state; // Extracting orderId from location state

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

      // Fetching order details
      const orderResponse = await fetch(`${apiUrl}/orders/${orderId}`, requestOptions);
      if (!orderResponse.ok) {
        throw new Error("Failed to fetch order");
      }
      const orderData = await orderResponse.json();
      setOrder(orderData);

      // Fetching employee details
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
        {/* Displaying First Name and Last Name */}
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={employeeDetails.firstName || ""} // Use the firstName property from employeeDetails to display the value
            readOnly // Make the input read-only
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={employeeDetails.lastName || ""} // Use the lastName property from employeeDetails to display the value
            readOnly // Make the input read-only
          />
        </div>
        {/* Rest of the form */}
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
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
}


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function EditOrder() {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const [order, setOrder] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { orderId } = location.state; // Extracting orderId from location state

//   useEffect(() => {
//     fetchOrder();
//   }, []);

//   const fetchOrder = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const requestOptions = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await fetch(`${apiUrl}/orders/${orderId}`, requestOptions); // Fetching the order data using orderId
//       if (!response.ok) {
//         throw new Error("Failed to fetch order");
//       }
//       const orderData = await response.json();
//       setOrder(orderData);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching order:", error);
//     }
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const requestOptions = {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(order),
//       };
//       const response = await fetch(`${apiUrl}/employees/orders/${orderId}`, requestOptions);
//       if (!response.ok) {
//         throw new Error("Failed to update order");
//       }
//       navigate("/");
//     } catch (error) {
//       console.error("Error updating order:", error);
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setOrder((prevOrder) => ({
//       ...prevOrder,
//       [name]: value,
//     }));
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Edit Order</h2>
//       <form onSubmit={handleFormSubmit}>
//         {/* Displaying First Name and Last Name */}
//         <div>
//           <label>First Name:</label>
//           <input
//             type="text"
//             name="firstName"
//             value={order.firstName} // Use the firstName property from order to display the value
//             readOnly // Make the input read-only
//           />
//         </div>
//         <div>
//           <label>Last Name:</label>
//           <input
//             type="text"
//             name="lastName"
//             value={order.lastName} // Use the lastName property from order to display the value
//             readOnly // Make the input read-only
//           />
//         </div>
//         {/* Rest of the form */}
//         <div>
//           <label>Date Of Joining:</label>
//           <input
//             type="text"
//             name="dateOfJoining"
//             value={order.dateOfJoining}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Project End Date:</label>
//           <input
//             type="text"
//             name="projectEndDate"
//             value={order.projectEndDate}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Bill Rate:</label>
//           <input
//             type="text"
//             name="billRate"
//             value={order.billRate}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Client Name:</label>
//           <input
//             type="text"
//             name="endClientName"
//             value={order.endClientName}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Vendor PhoneNo:</label>
//           <input
//             type="text"
//             name="vendorPhoneNo"
//             value={order.vendorPhoneNo}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Vendor Email:</label>
//           <input
//             type="text"
//             name="vendorEmailId"
//             value={order.vendorEmailId}
//             onChange={handleInputChange}
//           />
//         </div>
//         <button type="submit">Update Order</button>
//       </form>
//     </div>
//   );
// }





/*
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state;
  

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`${apiUrl}/orders/${orderId}`, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      const orderData = await response.json();
      setOrder(orderData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
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
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
}
*/



/*
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function EditOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;  
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state && location.state.orderId;

  const [order, setOrder] = useState({
    dateOfJoining : "",
    projectEndDate : "",
    billRate : "",
    endClientName : "",
    vendorPhoneNo : "",
    vendorEmailId : ""
  });

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      if (orderId) 
      {
        const response = await fetch(`${apiUrl}/orders/${orderId}`, config);
        console.log(orderId)
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  

  const {
    dateOfJoining,
    projectEndDate,
    billRate,
    endClientName,
    vendorPhoneNo,
    vendorEmailId
  } = order;
  
  const onInputChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {

      await axios.put(`${apiUrl}/orders/${orderId}`, order);
      navigate("/editorder", { state: { orderId: orderId } });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Edit Order</h2>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <label htmlFor="dateOfJoining"></label>
          <input
            type="text"
            className="form-control"
            placeholder="Date Of Joining"
            name="dateOfJoining"
            value={dateOfJoining}
            onChange={(e) => onInputChange(e)}
            required
        />
        </div>
        <div className="form-group">
          <label htmlFor="projectEndDate"></label>
          <input
            type="text"
            className="form-control"
            placeholder="Project End Date"
            name="projectEndDate"
            value={projectEndDate}
            onChange={(e) => onInputChange(e)}
            required
        />
        </div>
        <div className="form-group">
          <label htmlFor="billRate"></label>
          <input
            type="text"
            className="form-control"
            placeholder="Bill Rate"
            name="billRate"
            value={billRate}
            onChange={(e) => onInputChange(e)}
            required
        />
        </div>
        <div className="form-group">
          <label htmlFor="endClientName"></label>
          <input
            type="text"
            className="form-control"
            placeholder="End Client Name"
            name="endClientName"
            value={endClientName}
            onChange={(e) => onInputChange(e)}
            required
        />
        </div>
        <div className="form-group">
          <label htmlFor="vendorPhoneNo"></label>
          <input
            type="text"
            className="form-control"
            placeholder="Vendor Phone No"
            name="vendorPhoneNo"
            value={vendorPhoneNo}
            onChange={(e) => onInputChange(e)}
            required
        />
        </div>
        <div className="form-group">
          <label htmlFor="vendorEmailId"></label>
          <input
            type="text"
            className="form-control"
            placeholder="Vendor Email Id  "
            name="vendorEmailId"
            value={vendorEmailId}
            onChange={(e) => onInputChange(e)}
            required
        />
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Update
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/purchaseorder">
          Cancel
        </Link>
      </form>
    </div>
  );
}
*/