import React, { useEffect, useState } from "react";
import Pagination from "../pages/Pagination";
import { Select, Input , Button } from "antd";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function PurchaseOrders() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  let { employeeId } = useParams();

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, searchQuery, searchField]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const searchParams = new URLSearchParams();
      searchParams.append("page", currentPage);
      searchParams.append("size", pageSize);
      if (searchQuery) {
        searchParams.append("searchField", searchField);
        searchParams.append("searchString", searchQuery);
      }
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const ordersResponse = await fetch(`${apiUrl}/orders?${searchParams.toString()}`, requestOptions);
      const ordersData = await ordersResponse.json();
      const ordersArray = ordersData.content;
      setOrders(ordersArray);
      setTotalPages(ordersData.totalPages);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };
  const handleSearch = () => {
    loadOrders();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    loadOrders();
  };

  return (
    <div className="container">
      <div className="py-4">
      <div className="search-container">
          <div className="search-bar">
            <Select
              value={searchField}
              onChange={(value) => setSearchField(value)}
              style={{ width: 120 }}
            >
              <Select.Option value="">Select Field</Select.Option>
              <Select.Option value="dateOfJoining">Data Of Joining</Select.Option>
              <Select.Option value="projectEndDate">Project End Date</Select.Option>
              <Select.Option value="billRate">Bill Rate</Select.Option>
              <Select.Option value="endClientName">Client Name</Select.Option>
              <Select.Option value="vendorPhoneNo">Vendor PhoneNo</Select.Option>
              <Select.Option value="vendorEmailId">Vendor EmailID</Select.Option>
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
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Date Of Joining</th>
              <th scope="col">Project End Date</th>
              <th scope="col">Bill Rate</th>
              <th scope="col">Client Name</th>
              <th scope="col">Vendor PhoneNo</th>
              <th scope="col">Vendor Email</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((employeeOrder, index) => {
                const userIndex = index + currentPage * pageSize;
                return (
                <tr key={userIndex}>
                  <th scope="row">{userIndex + 1}</th>
                  <td>{employeeOrder.employeeFirstName}</td>
                  <td>{employeeOrder.employeeLastName}</td>
                  <td>{employeeOrder.dateOfJoining}</td>
                  <td>{employeeOrder.projectEndDate}</td>
                  <td>{employeeOrder.billRate}</td>
                  <td>{employeeOrder.endClientName}</td>
                  <td>{employeeOrder.vendorPhoneNo}</td>
                  <td>{employeeOrder.vendorEmailId}</td>
                </tr>
              );
            })
            ) : (
              <tr>
                <td colSpan="7">No Orders</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  );
}
