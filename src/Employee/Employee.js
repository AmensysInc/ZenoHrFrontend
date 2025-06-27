import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiDollar } from "react-icons/bi";
import { HiShoppingCart } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input, Button } from "antd";
import "../Employee/Employee.css";
import {
  deleteEmployee,
  fetchEmployees,
} from "../SharedComponents/services/EmployeeServices";

export default function Employee() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const navigate = useNavigate();
  const defaultCompanyId = Number(sessionStorage.getItem("defaultCompanyId"));

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, searchField]);

const fetchData = async () => {
  const { content, totalPages } = await fetchEmployees(
    currentPage,
    pageSize,
    searchQuery,
    searchField
  );

  const loggedInUserId = sessionStorage.getItem("id");

  if (loggedInUserId === "admin_id") {
    // Admin sees all employees
    setUsers(content);
  } else {
    // Normal user: filter employees based on default company
    const filteredContent = content.filter(employee =>
      employee.company && employee.company.companyId === defaultCompanyId
    );
    setUsers(filteredContent);
  }

  setTotalPages(totalPages);
};

/*
  const fetchData = async () => {
    const { content, totalPages } = await fetchEmployees(
      currentPage,
      pageSize,
      searchQuery,
      searchField
    );
    setUsers(content);
    setTotalPages(totalPages);
  };
*/

  const handleDeleteEmployee = async (employeeId) => {
    const success = await deleteEmployee(employeeId);
    if (success) {
      fetchData();
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

  const handleSearch = () => {
    fetchData();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    fetchData();
  };

  return (
    <>
      <h4 className="text-center">Employee details</h4>

      {/* Search bar and company display */}
      <div
        className="search-container"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
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
            <Select.Option value="company">Company</Select.Option>
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
          <Button onClick={handleClearSearch}>Clear</Button>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            className="add-user-link"
            to="/adduser"
            style={{ marginRight: "10px" }}
          >
            <BsFillPersonPlusFill size={25} title="Add Employee" />
          </Link>
          <Link className="add-pro-link" to="/addprospect">
            <AiOutlineUsergroupAdd size={25} title="Prospect Employee" />
          </Link>
        </div>
      </div>

      {/* Employee table */}
      <div>
        <table className="table table-striped border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">FirstName</th>
              <th scope="col">LastName</th>
              <th scope="col">EmailID</th>
              <th scope="col">Company</th>
              <th scope="col">Phone No</th>
              <th scope="col">Working Status</th>
              <th scope="col">Actions</th>
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
                    <td>{employee.company ? employee.company.companyName : 'N/A'}</td>
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
                <td colSpan="8">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
