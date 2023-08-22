import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../PurchaseOrder/PurchaseOrder.css";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../pages/Pagination";

export default function PurchaseOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;

  const handleAddOrder = (employeeId) => {
    navigate("/orders/addorder", { state: { employeeId } });
  };

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const ordersResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/orders?page=${currentPage}&size=${pageSize}`,
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
  const handleEditOrder = (orderId) => {
    navigate("/orders/editorder", { state: { employeeId, orderId } });
  };
  
  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">
          {userDetail.first} {userDetail.last}
        </h4>
        <div className="add-orders d-flex justify-content-start">
          <button
            className="btn btn-primary"
            onClick={() => handleAddOrder(employeeId)}
          >
            <BiSolidAddToQueue size={15} />
            Orders
          </button>
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
                      <FiEdit2 onClick={() => handleEditOrder(employeeOrder.orderId)} size={20}/>
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
