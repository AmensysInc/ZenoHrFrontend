import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditWithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tracking, setTracking] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const { employeeId, trackingId } = state || {};
  useEffect(() => {
    if (employeeId && trackingId) {
      fetchTracking();
      loadEmployeeDetails();
    }
  }, [employeeId, trackingId]);

  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`${apiUrl}/trackings/${trackingId}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch tracking');
      }
      const trackingData = await response.json();
      setTracking(trackingData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tracking:', error);
    }
  };

  const loadEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('token');

      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      const data = await response.json();
      setEmployeeDetails(data);
    } catch (error) {
      console.error('Error loading employee details:', error);
    }
  };

  useEffect(() => {
    const actualAmtValue = tracking.actualHours * tracking.actualRate;
    const paidAmtValue = tracking.paidHours * tracking.paidRate;
    const balanceValue = actualAmtValue - paidAmtValue;

    setTracking((prevTracking) => ({
      ...prevTracking,
      actualAmt: actualAmtValue,
      paidAmt: paidAmtValue,
      balance: balanceValue,
    }));
  }, [tracking.actualHours, tracking.actualRate, tracking.paidHours, tracking.paidRate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tracking),
      };
      const response = await fetch(`${apiUrl}/employees/trackings/${trackingId}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to update tracking');
      }
      navigate('/');
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTracking((prevTracking) => ({
      ...prevTracking,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleNavigate = (employeeId) => {
    navigate("/tracking", { state: { employeeId } });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit WithHold Tracking</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group row">
          <div className="col">
            <label>First Name:</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={employeeDetails.firstName}
              readOnly
            />
          </div>
          <div className="col">
            <label>Last Name:</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={employeeDetails.lastName}
              readOnly
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Month:</label>
            <input
              type="text"
              className="form-control"
              name="month"
              value={tracking.month}
              onChange={handleInputChange}
            />
          </div>
          <div className="col">
            <label>Year:</label>
            <input
              type="text"
              className="form-control"
              name="year"
              value={tracking.year}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Actual Hours:</label>
            <input
              type="text"
              className="form-control"
              name="actualHours"
              value={tracking.actualHours}
              onChange={handleInputChange}
            />
          </div>
          <div className="col">
            <label>Actual Rate:</label>
            <input
              type="text"
              className="form-control"
              name="actualRate"
              value={tracking.actualRate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Paid Hours:</label>
            <input
              type="text"
              className="form-control"
              name="paidHours"
              value={tracking.paidHours}
              onChange={handleInputChange}
            />
          </div>
          <div className="col">
            <label>Paid Rate:</label>
            <input
              type="text"
              className="form-control"
              name="paidRate"
              value={tracking.paidRate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Actual Amount:</label>
            <input
              type="text"
              className="form-control"
              name="actualAmt"
              value={tracking.actualAmt}
              readOnly
            />
          </div>
          <div className="col">
            <label>Paid Amount:</label>
            <input
              type="text"
              className="form-control"
              name="paidAmt"
              value={tracking.paidAmt}
              readOnly
            />
          </div>
          <div className="col">
            <label>Balance:</label>
            <input
              type="text"
              className="form-control"
              name="balance"
              value={tracking.balance}
              readOnly
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
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
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import '../WithHoldTracking/WithHoldTracking.css';

// export default function EditWithHoldTracking() {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const [tracking, setTracking] = useState({});
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const state = location.state;

//   const { employeeId, trackingId } = state || {};
//   useEffect(() => {
//     if (employeeId && trackingId) {
//       fetchTracking();
//       loadEmployeeDetails();
//     }
//   }, [employeeId, trackingId]);

//   const fetchTracking = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const requestOptions = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await fetch(`${apiUrl}/trackings/${trackingId}`, requestOptions);
//       if (!response.ok) {
//         throw new Error('Failed to fetch tracking');
//       }
//       const trackingData = await response.json();
//       setTracking(trackingData);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching tracking:', error);
//     }
//   };

//   const loadEmployeeDetails = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       var myHeaders = new Headers();
//       myHeaders.append('Authorization', `Bearer ${token}`);

//       var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//       };

//       const response = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
//       const data = await response.json();
//       setEmployeeDetails(data);
//     } catch (error) {
//       console.error('Error loading employee details:', error);
//     }
//   };

//   useEffect(() => {
//     const actualAmtValue = tracking.actualHours * tracking.actualRate;
//     const paidAmtValue = tracking.paidHours * tracking.paidRate;
//     const balanceValue = actualAmtValue - paidAmtValue;

//     setTracking((prevTracking) => ({
//       ...prevTracking,
//       actualAmt: actualAmtValue,
//       paidAmt: paidAmtValue,
//       balance: balanceValue,
//     }));
//   }, [tracking.actualHours, tracking.actualRate, tracking.paidHours, tracking.paidRate]);

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const requestOptions = {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(tracking),
//       };
//       const response = await fetch(`${apiUrl}/employees/trackings/${trackingId}`, requestOptions);
//       if (!response.ok) {
//         throw new Error('Failed to update tracking');
//       }
//       navigate('/');
//     } catch (error) {
//       console.error('Error updating tracking:', error);
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setTracking((prevTracking) => ({
//       ...prevTracking,
//       [name]: value,
//     }));
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Edit WithHold Tracking</h2>
//       <form onSubmit={handleFormSubmit}>
//         <div className="form-row">
//           <div className="form-group">
//             <label>First Name:</label>
//             <input type="text" name="firstName" value={employeeDetails.firstName} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Last Name:</label>
//             <input type="text" name="lastName" value={employeeDetails.lastName} readOnly />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Month:</label>
//             <input type="text" name="month" value={tracking.month} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Year:</label>
//             <input type="text" name="year" value={tracking.year} onChange={handleInputChange} />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Actual Hours:</label>
//             <input
//               type="text"
//               name="actualHours"
//               value={tracking.actualHours}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>Actual Rate:</label>
//             <input
//               type="text"
//               name="actualRate"
//               value={tracking.actualRate}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Paid Hours:</label>
//             <input
//               type="text"
//               name="paidHours"
//               value={tracking.paidHours}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>Paid Rate:</label>
//             <input
//               type="text"
//               name="paidRate"
//               value={tracking.paidRate}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Actual Amount:</label>
//             <input type="text" name="actualAmt" value={tracking.actualAmt} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Paid Amount:</label>
//             <input type="text" name="paidAmt" value={tracking.paidAmt} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Balance:</label>
//             <input type="text" name="balance" value={tracking.balance} readOnly />
//           </div>
//         </div>
//         <button type="submit">Update WithHold Tracking</button>
//       </form>
//     </div>
//   );
// }