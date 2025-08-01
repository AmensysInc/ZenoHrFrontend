import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tracking = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [trackings, setTrackings] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const employeeId = sessionStorage.getItem('id');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchTrackings();
    fetchEmployeeEmail();
  }, []);

  const fetchTrackings = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${apiUrl}/employees/${employeeId}/trackings`,
        config
      );
      setTrackings(response.data.content);
    } catch (error) {
      console.error('Error fetching trackings:', error);
    }
  };

  const fetchEmployeeEmail = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${apiUrl}/employees/${employeeId}`,
        config
      );
      setEmployeeEmail(response.data.emailID);
    } catch (error) {
      console.error("Failed to fetch employee email:", error);
    }
  };

  const handleSendEmail = async () => {
    if (!employeeEmail) {
      alert("Email not available.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/auth/resetPassword`,
        {
          email: employeeEmail,
          category: "WITHHOLD_EMP",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Email sent successfully.");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Tracking Details</h2>
        <button
          className="btn btn-success"
          onClick={handleSendEmail}
          disabled={!employeeEmail}
        >
          Call me
        </button>
      </div>

      <div className="table-container">
        <table className="table border shadow">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Month</th>
              <th>Year</th>
              <th>Actual Hours</th>
              <th>Actual Rate</th>
              <th>Actual Amount</th>
              <th>Paid Hours</th>
              <th>Paid Rate</th>
              <th>Paid Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {trackings.map((tracking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{tracking.month}</td>
                <td>{tracking.year}</td>
                <td>{tracking.actualHours}</td>
                <td>{tracking.actualRate}</td>
                <td>{tracking.actualAmt}</td>
                <td>{tracking.paidHours}</td>
                <td>{tracking.paidRate}</td>
                <td>{tracking.paidAmt}</td>
                <td>{tracking.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tracking;
