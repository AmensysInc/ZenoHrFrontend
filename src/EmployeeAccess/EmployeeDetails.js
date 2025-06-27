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
      const employeeId = sessionStorage.getItem("id");
      const token = sessionStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`${apiUrl}/employees/${employeeId}`,config);
      console.log(response)
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container"> 
      <h2 className="text-center">Employee Details</h2>
      <div className="table-container">
        <table className="table border shadow">
          <tbody>
            <tr>
              <th>First Name</th>
              <td>{employee.firstName}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{employee.lastName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{employee.emailID}</td>
            </tr>
            <tr>
              <th>Company</th>
              <td>{employee.company.companyName}</td>
            </tr>
            <tr>
              <th>Date Of Birth</th>
              <td>{employee.dob}</td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>{employee.phoneNo}</td>
            </tr>
            <tr>
              <th>Working Status</th>
              <td>{employee.onBench}</td>
            </tr>
          </tbody>
        </table>
      </div>
        {/* <Link to={"/trackings"}>
          <button>View WithHoldTracking</button>
        </Link>
        <Link to={"/withholdSheet"}>
          <button>View WithHoldSheet</button>
        </Link> */}
    </div>
  );
};

export default EmployeeDetails;
