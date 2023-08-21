import React, { useEffect, useState } from "react";
import "./Home.css";
import "../PurchaseOrder/PurchaseOrder.css";
import { useNavigate, Link } from "react-router-dom";
import { BiDollar } from "react-icons/bi";
import { HiShoppingCart } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";

export default function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/employees?page=${currentPage}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }

      const jsonData = await response.json();
      setUsers(jsonData.content);
      setTotalPages(jsonData.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewOrders = (employeeId) => {
    navigate(`/orders`, { state: { employeeId } });
  };

  const handleViewTracking = (employeeId) => {
    navigate("/tracking", { state: { employeeId } });
  };

  const handleEditEmployee = (employeeId) => {
    navigate("/editemployee", { state: { employeeId } });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const range = 2;
    const paginationItems = [];
    const startPage = Math.max(currentPage - range, 0); 
    const endPage = Math.min(currentPage + range, totalPages - 1);
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePagination(i)}
        >
          <span className="page-link">{i + 1}</span>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li
            className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
            onClick={() => handlePagination(0)}
          >
            <span className="page-link">First</span>
          </li>
          {paginationItems}
          <li
            className={`page-item ${
              currentPage === totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() => handlePagination(totalPages - 1)}
          >
            <span className="page-link">Last</span>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">Employee details</h4>
        <div className="add-orders d-flex justify-content-start">
        <Link className="add-user-link" to="/adduser">
            <BsFillPersonPlusFill size={25} />
          </Link>
        </div>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">FirstName</th>
              <th scope="col">LastName</th>
              <th scope="col">EmailID</th>
              <th scope="col">Phone No</th>
              <th scope="col">Working Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((employee, index) => {
                const userIndex = index + currentPage * pageSize;
                return (
                  <tr key={userIndex}>
                    <th scope="row">{userIndex + 1}</th>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.emailID}</td>
                    <td>{employee.phoneNo}</td>
                    <td>{employee.onBench}</td>
                    <td>
                    <div className="icon-container">
                        <FiEdit2
                          onClick={() => handleEditEmployee(employee.employeeID)}
                          size={20}
                          title="Edit Employee"
                        />
                        <HiShoppingCart
                          onClick={() => handleViewOrders(employee.employeeID)}
                          size={20}
                          title="Purchase Orders"
                        />
                        <BiDollar
                          onClick={() => handleViewTracking(employee.employeeID)}
                          size={20}
                          title="WithHold Tracking"
                        />
                        <AiFillDelete
                          onClick={() => handleDeleteEmployee(employee.employeeID)}
                          size={20}
                          className="delete-icon"
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    </div>
  );
}