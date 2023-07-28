import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function EmployeeDetails() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:8082/employees/${employeeId}`,
        config
      );
      const { data } = response;
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const {
    firstName,
    lastName,
    emailID,
    dob,
    clgOfGrad,
    visaStatus,
    visaStartDate,
    visaExpiryDate,
    onBench,
  } = employee;

  return (
    <div className="container mt-5">
      <h2>Employee Details</h2>
      <div>
        <p>
          <strong>First Name:</strong> {firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {lastName}
        </p>
        <p>
          <strong>Email:</strong> {emailID}
        </p>
        <p>
          <strong>Date of Birth:</strong> {dob}
        </p>
        <p>
          <strong>College Graduation:</strong> {clgOfGrad}
        </p>
        <p>
          <strong>Visa Status:</strong> {visaStatus}
        </p>
        <p>
          <strong>Visa Start Date:</strong> {visaStartDate}
        </p>
        <p>
          <strong>Visa Expiry Date:</strong> {visaExpiryDate}
        </p>
        <p>
          <strong>Working Status:</strong> {onBench ? "On Bench" : "Working"}
        </p>
      </div>
      <Link className="btn btn-primary" to={`/editemployee/${employeeId}`}>
        Edit Employee
      </Link>
      <Link className="btn btn-secondary mx-2" to="/">
        Back to Home
      </Link>
    </div>
  );
}

