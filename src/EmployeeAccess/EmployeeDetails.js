import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EmployeeDetails = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const employeeId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
      const response = await axios.get(`${apiUrl}/employees/${employeeId}`,config);
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h2>Employee Details</h2>
      <div>
        <strong>First Name:</strong> {employee.firstName}
      </div>
      <div>
        <strong>Last Name:</strong> {employee.lastName}
      </div>
      <div>
        <strong>Email:</strong> {employee.emailID}
      </div>
      <div>
        <strong>Date of Birth:</strong> {employee.dob}
      </div>
      <div>
        <strong>College of Graduation:</strong> {employee.clgOfGrad}
      </div>
      <div>
        <strong>Visa Status:</strong> {employee.visaStatus}
      </div>
      <div>
        <strong>Visa Start Date:</strong> {employee.visaStartDate}
      </div>
      <div>
        <strong>Visa Expiry Date:</strong> {employee.visaExpiryDate}
      </div>
      <div>
        <strong>On Bench:</strong> {employee.onBench}
      </div>
      <Link to={"/trackings"}>
          <button>View Tracking</button>
      </Link>

    </div>
  );
};

export default EmployeeDetails;
