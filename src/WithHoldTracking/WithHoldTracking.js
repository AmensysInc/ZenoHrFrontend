import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import "../PurchaseOrder/PurchaseOrder.css";

export default function WithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [trackings, setTrackings] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;
  

  const handleAddTracking = (employeeId) => {
    navigate("/tracking/addtracking", { state: { employeeId } });
  };

  useEffect(() => { 
    loadTrackings();
  }, [currentPage]);

  const loadTrackings = async () => {
    try {
      const token = localStorage.getItem("token");

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const trackingsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/trackings`, requestOptions
      );
      const detailsResponse = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      const trackingsData = await trackingsResponse.json();
      const detailsData = await detailsResponse.json();
      setTrackings(trackingsData);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
    } catch (error) {
      console.error("Error loading trackings:", error);
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrackings = trackings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trackings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleEditTracking = (trackingId) => {
    navigate("/tracking/edittracking", { state: { employeeId,trackingId } });
  };
  const totalBalance = trackings.reduce(
    (acc, tracking) => acc + parseFloat(tracking.balance),
    0
  );
  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">
          {userDetail.first} {userDetail.last} - Tracking Details
        </h4>
        <div className="add-orders d-flex justify-content-start">
        <button
        className="btn btn-primary"
        onClick={() => handleAddTracking(employeeId)}
        >
          <BiSolidAddToQueue size={15}/>
          WH-Tracking
        </button>
        </div>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Month</th>
              <th scope="col">Year</th>
              <th scope="col">Actual Hours</th>
              <th scope="col">Actual Rate</th>
              <th scope="col">Actual Amount</th>
              <th scope="col">Paid Hours</th>
              <th scope="col">Paid Rate</th>
              <th scope="col">Paid Amount</th>
              <th scope="col">Balance</th>
              
            </tr>
          </thead>
          <tbody>
            {currentTrackings.length > 0 ? (
              currentTrackings.map((tracking, index) => (
                <tr key={index}>
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                  <td>{tracking.month}</td>
                  <td>{tracking.year}</td>
                  <td>{tracking.actualHours}</td>
                  <td>{tracking.actualRate}</td>
                  <td>{tracking.actualAmt}</td>
                  <td>{tracking.paidHours}</td>
                  <td>{tracking.paidRate}</td>
                  <td>{tracking.paidAmt}</td>
                  <td>{tracking.balance}</td>
                  <td>
                  <div className="icon-container">
                  <FiEdit2 onClick={() => handleEditTracking(tracking.trackingId)} size={20}/>
                  </div>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No Trackings</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="total-balance">Total Balance: {totalBalance}</div>
      <div className="pagination"></div>
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
    </div>
  );
}
