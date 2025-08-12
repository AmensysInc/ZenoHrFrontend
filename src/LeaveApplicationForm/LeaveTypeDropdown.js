import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveTypeDropdown = ({ onSelect }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/leave/leave-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaveTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch leave types:", error);
    }
  };

  return (
    <div>
      <label htmlFor="leaveType">Leave Type:</label>
      <select
        id="leaveType"
        className="form-control"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          -- Select Leave Type --
        </option>
        {leaveTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name} ({type.defaultDays} days)
          </option>
        ))}
      </select>
    </div>
  );
};

export default LeaveTypeDropdown;
