import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function WithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [trackings, setTrackings] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  let location = useLocation();
  const { employeeId } = location.state;

  useEffect(() => {
    loadTrackings();
  }, []);

  const loadTrackings = async () => {
    try {
      const trackingsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/trackings`
      );
      const detailsResponse = await fetch(`${apiUrl}/employees/${employeeId}`);
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

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">
          {userDetail.first} {userDetail.last} - Tracking Details
        </h4>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Month</th>
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
                  <td>{tracking.actualHours}</td>
                  <td>{tracking.actualRate}</td>
                  <td>{tracking.actualAmt}</td>
                  <td>{tracking.paidHours}</td>
                  <td>{tracking.paidRate}</td>
                  <td>{tracking.paidAmt}</td>
                  <td>{tracking.balance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No Trackings</td>
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
    </div>
  );
}
