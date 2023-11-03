import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input , Button } from "antd";

export default function PurchaseOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const navigate = useNavigate();
  let { employeeId } = useParams();
  
  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, searchQuery, searchField]);

  const loadOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");
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
      const ordersResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/orders?${searchParams.toString()}`,
        requestOptions
      );
      const detailsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
      const ordersData = await ordersResponse.json(); 
      const detailsData = await detailsResponse.json();
      const ordersArray = ordersData.content;
      setOrders(ordersArray);
      setTotalPages(ordersData.totalPages);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };
  const handleAddOrder = (employeeId) => {
    navigate(`/orders/${employeeId}/addorder`);
  };
  const handleEditOrder = (employeeId, orderId) => {
    navigate(`/orders/${employeeId}/${orderId}/editorder`);
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
        <h4 className="text-center">
          {userDetail.first} {userDetail.last}
        </h4>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => handleAddOrder(employeeId)}
          >
            <BiSolidAddToQueue size={15} />
            Orders
          </button>
        </div>
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
                  <td>{employeeOrder.dateOfJoining}</td>
                  <td>{employeeOrder.projectEndDate}</td>
                  <td>{employeeOrder.billRate}</td>
                  <td>{employeeOrder.endClientName}</td>
                  <td>{employeeOrder.vendorPhoneNo}</td>
                  <td>{employeeOrder.vendorEmailId}</td>
                  <td>
                    <div className="icon-container">
                      <FiEdit2 onClick={() => handleEditOrder(employeeId,employeeOrder.orderId)} size={20}/>
                    </div>
                  </td>
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
