import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeaveTypeDropdown from './LeaveTypeDropdown';

const LeaveApplicationForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const employeeId = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");

 const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [message, setMessage] = useState('');


  const handleLeaveTypeSelect = (leaveTypeId) => {
    setSelectedLeaveType(leaveTypeId);
  };


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/leave/apply`,
        null,
        {
          params: {
            employeeId,
            leaveTypeId: formData.leaveTypeId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.reason,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Leave application submitted successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit leave application');
    }
  };

  return (
    <div>
      <h2>Apply for Leave</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <LeaveTypeDropdown onSelect={handleLeaveTypeSelect} />
        <label>
          Start Date:
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          End Date:
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Reason:
          <textarea name="reason" value={formData.reason} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;
