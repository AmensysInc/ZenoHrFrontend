import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tracking = () => {
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
        `http://localhost:8082/employees/${employeeId}/trackings`,
        config
      );
      setTrackings(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching trackings:', error);
    }
  };

  return (
    <div>
      <h2>Tracking Details</h2>
      <table>
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
  );
};

export default Tracking;


