import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [projectHistory, setProjectHistory] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [projectStatusOptions, setProjectStatusOptions] = useState([
    "Active",
    "Terminated",
    "Ended",
    "On Hold",
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, employeeId } = location.state;
  console.log("Location state:", location.state);

  useEffect(() => {
    fetchProjectHistoryAndEmployee();
  }, []);

  const fetchProjectHistoryAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const historyresponse = await fetch(
        `${apiUrl}/projects/${projectId}`,
        requestOptions
      );
      if (!historyresponse.ok) {
        throw new Error("Failed to fetch project history");
      }
      const projectHistory = await historyresponse.json();
      setProjectHistory(projectHistory);
      const employeeResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );

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
        body: JSON.stringify(projectHistory),
      };
      const response = await fetch(
        `${apiUrl}/employees/projects/${projectId}`,
        requestOptions
      );
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
    setProjectHistory((prevHistory) => ({
      ...prevHistory,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit ProjectHistory</h2>
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
          <label>Sub VendorOne</label>
          <input
            type="text"
            name="subVendorOne"
            value={projectHistory.subVendorOne}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Sub VendorTwo</label>
          <input
            type="text"
            name="subVendorTwo"
            value={projectHistory.subVendorTwo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Project Address</label>
          <input
            type="text"
            name="projectAddress"
            value={projectHistory.projectAddress}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Project Start Date</label>
          <input
            type="text"
            name="projectStartDate"
            value={projectHistory.projectStartDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Project End Date</label>
          <input
            type="text"
            name="projectEndDate"
            value={projectHistory.projectEndDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Project Status</label>
          <select
            name="projectStatus"
            value={projectHistory.projectStatus}
            onChange={handleInputChange}
          >
            {projectStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
