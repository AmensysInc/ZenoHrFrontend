import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Buttons() {
  const navigate = useNavigate();
  let { employeeId } = useParams();

  const handleProjectHistory = (employeeId) => {
    navigate(`/editemployee/${employeeId}/project-history`);
  };

  const handleVisaDetails = (employeeId) => {
    navigate(`/editemployee/${employeeId}/visa-details`);
  };
  return (
    <div className="button-container">
      <button
        type="button"
        className="add-user-link"
        onClick={() => handleProjectHistory(employeeId)}
        title="Project History"
        style={{ marginLeft: "4000px" }}
      >
        Project History
      </button>
      <button
        type="button"
        className="add-pro-link"
        onClick={() => handleVisaDetails(employeeId)}
        title="Visa Details"
        style={{ marginLeft: "4000px" }}
      >
        Visa Details
      </button>
    </div>
  );
}
