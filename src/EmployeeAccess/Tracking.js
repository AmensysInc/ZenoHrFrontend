import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/Home.css'; 

const Tracking = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [trackings, setTrackings] = useState([]);
  const employeeId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTrackings();
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
      console.log(response.data.content)
    } catch (error) {
      console.error('Error fetching trackings:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center">Tracking Details</h2>
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
