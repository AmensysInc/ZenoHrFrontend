import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../ProjectHistory/ProjectHistory.css";

export default function ProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [projectHistory, setProjectHistory] = useState([]);
  const location = useLocation();
  const employeeId = location.state.employeeId;

  useEffect(() => {
    fetchProjectHistory();
  }, []);

  const fetchProjectHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `${apiUrl}/employees/${employeeId}/project-history`,
        config
      );
      const data = await response.json();
      setProjectHistory(data);
    } catch (error) {
      console.error("Error fetching project history:", error);
    }
  };

  return (
    <div>
      <h2>Project History</h2>
      <div>
        {projectHistory.length > 0 ? (
          projectHistory.map((history, index) => (
            <div key={index} className="project-item">
              <div className="project-item-cell">S.No: {index + 1}</div>
              <div className="project-item-cell">Sub VendorOne: {history.subVendorOne}</div>
              <div className="project-item-cell">Sub VendorTwo: {history.subVendorTwo}</div>
              <div className="project-item-cell">Project Address: {history.projectAddress}</div>
              <div className="project-item-cell">Project StartDate: {history.projectStartDate}</div>
              <div className="project-item-cell">Project EndDate: {history.projectEndDate}</div>
              <div className="project-item-cell">Project Status: {history.projectStatus}</div>
            </div>
          ))
        ) : (
          <div className="no-history">No Project History</div>
        )}
      </div>
    </div>
  );
}

