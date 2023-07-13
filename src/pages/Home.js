import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";


export default function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showAddOrdersLink, setShowAddOrdersLink] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
     fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const response = await fetch(`${apiUrl}/employees`,{
      //   method : "GET",
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch("http://localhost:8082/employees", requestOptions)
      const jsonData = await response.json();
      setUsers(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewOrders = (employeeId) => {
    navigate(`/orders`, { state: { employeeId } });
    setShowAddOrdersLink(true);
  };

  const handleViewTracking = (employeeId) => {
    navigate("/tracking", { state: { employeeId } });
  };

  const handleAddOrder = (employeeId) => {
    const employee = users.find((emp) => emp.employeeID === employeeId);
    if (employee) {
      navigate("/addorder", { state: { employeeId, onBench: employee.onBench } });
    }
  };
  

  const handleEditEmployee = (employeeId) => {
    navigate("/editemployee", { state: { employeeId } });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await fetch(`${apiUrl}/employees/${employeeId}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="py-4">
        
        <h4 className="text-center">Employee details</h4>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">FirstName</th>
              <th scope="col">LastName</th>
              <th scope="col">EmailID</th>
              <th scope="col">Visa Status</th>
              <th scope="col">Date Of Birth</th>
              <th scope="col">College Graduation</th>
              <th scope="col">Visa StartDate</th>
              <th scope="col">Visa EndDate</th>
              <th scope="col">Working Status</th>
              <th scope="col">View Orders</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((employee, index) => (
                <tr key={index}>
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.emailID}</td>
                  <td>{employee.visaStatus}</td>
                  <td>{employee.dob}</td>
                  <td>{employee.clgOfGrad}</td>
                  <td>{employee.visaStartDate}</td>
                  <td>{employee.visaExpiryDate}</td>
                  <td>{employee.onBench ? "Yes" : "No"}</td>
                  <td>
                  <button
                      className="btn btn-primary"
                      onClick={() => handleEditEmployee(employee.employeeID)}
                    >
                      Edit Employee
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewOrders(employee.employeeID)}
                    >
                      View Orders
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>handleViewTracking(employee.employeeID)}
                    >
                      View Tracking
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddOrder(employee.employeeID)}
                    >
                      Add Order
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteEmployee(employee.employeeID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          )
        )}
      </div>
      {showAddOrdersLink && (
        <NavLink className="btn btn-outline-light" to="/addorders">
          Add Orders
        </NavLink>
        
      )}
    </div>
  );
}

