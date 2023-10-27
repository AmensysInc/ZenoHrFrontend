import React, { useEffect, useState } from "react";
import "../PurchaseOrder/PurchaseOrder.css";
import { useNavigate, Link } from "react-router-dom";
import { BiDollar } from "react-icons/bi";
import { HiShoppingCart } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Pagination from "../reusableComponents/Pagination";
import { Select, Input , Button } from "antd";

export default function Employee() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, searchField]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const searchParams = new URLSearchParams();
      searchParams.append("page", currentPage);
      searchParams.append("size", pageSize);
      if (searchQuery) {
        searchParams.append("searchField", searchField);
        searchParams.append("searchString", searchQuery);
      }

      const response = await fetch(
        `${apiUrl}/employees?${searchParams.toString()}`,
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
    navigate(`/orders/${employeeId}`);
  };

  const handleViewTracking = (employeeId) => {
    navigate(`/tracking/${employeeId}`);
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/editemployee/${employeeId}`);
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

  const handleSearch = () => {
    fetchData();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    fetchData();
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">Employee details</h4>
        <div className="add-orders d-flex justify-content-end">
          <Link className="add-user-link" to="/adduser">
            <BsFillPersonPlusFill size={25} title="Add Employee" />
          </Link>
        </div>
        <div className="add-orders d-flex justify-content-end">
          <Link className="add-pro-link" to="/addprospect">
            <AiOutlineUsergroupAdd size={25} title="Prospect Employee" />
          </Link>
        </div>
        <div className="search-container">
          <div className="search-bar">
            <Select
              value={searchField}
              onChange={(value) => setSearchField(value)}
              style={{ width: 120 }}
            >
              <Select.Option value="">Select Field</Select.Option>
              <Select.Option value="firstName">First Name</Select.Option>
              <Select.Option value="lastName">Last Name</Select.Option>
              <Select.Option value="emailID">Email Id</Select.Option>
              <Select.Option value="phoneNo">Phone No</Select.Option>
              <Select.Option value="onBench">Working Status</Select.Option>
            </Select>
            <Input.Search
              placeholder="Search..."
              onSearch={handleSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              enterButton
            />
          </div>
          <Button onClick={handleClearSearch}>Clear</Button>
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
            {users && users.length > 0 ? (
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
                          onClick={() =>
                            handleEditEmployee(employee.employeeID)
                          }
                          size={20}
                          title="Edit Employee"
                        />
                        <HiShoppingCart
                          onClick={() => handleViewOrders(employee.employeeID)}
                          size={20}
                          title="Purchase Orders"
                        />
                        <BiDollar
                          onClick={() =>
                            handleViewTracking(employee.employeeID)
                          }
                          size={20}
                          title="WithHold Tracking"
                        />
                        <AiFillDelete
                          onClick={() =>
                            handleDeleteEmployee(employee.employeeID)
                          }
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
