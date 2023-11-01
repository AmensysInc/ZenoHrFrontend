import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../SharedComponents/Pagination";

export default function WithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [trackings, setTrackings] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const navigate = useNavigate();
  const { employeeId } = useParams();

  useEffect(() => {
    loadTrackings();
  }, [currentPage, pageSize, searchQuery, searchField]);

  const loadTrackings = async () => {
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
      const trackingsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/trackings?${searchParams.toString()}`,
        requestOptions
      );
      const detailsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
      const trackingsData = await trackingsResponse.json();
      const detailsData = await detailsResponse.json();
      setTrackings(trackingsData.content);
      console.log(trackingsData);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
    } catch (error) {
      console.error("Error loading trackings:", error);
    }
  };
  const handleSearch = () => {
    loadTrackings();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    loadTrackings();
  };

  const handleAddTracking = (employeeId) => {
    navigate(`/tracking/${employeeId}/addtracking`);
  };

  const handleEditTracking = (employeeId, trackingId) => {
    navigate(`/tracking/${employeeId}/${trackingId}/edittracking`);
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">
          {userDetail.first} {userDetail.last} - WithHold Details
        </h4>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => handleAddTracking(employeeId)}
          >
            <BiSolidAddToQueue size={15} />
            New WithHold
          </button>
        </div>

        {trackings.length === 0 ? (
          <p className="text-center">NO TRACKINGS</p>
        ) : (
          Object.entries(groupByProject(trackings)).map(
            ([projectName, projectTrackings]) => {
              const totalBalance = projectTrackings.reduce(
                (sum, tracking) => sum + tracking.balance,
                0
              );
              return (
                <div key={projectName} className="project-grid">
                  
                  <h5>Project: {projectName}</h5>
                  <table className="table border shadow">
                    <thead>
                      <th scope="col">S.No</th>
                      <th scope="col">Month</th>
                      <th scope="col">Year</th>
                      <th scope="col">Project</th>
                      <th scope="col">Actual Hours</th>
                      <th scope="col">Actual Rate</th>
                      <th scope="col">Actual Amount</th>
                      <th scope="col">Paid Hours</th>
                      <th scope="col">Paid Rate</th>
                      <th scope="col">Paid Amount</th>
                      <th scope="col">Balance</th>
                    </thead>
                    <tbody>
                      {projectTrackings.map((tracking, index) => (
                        <tr key={tracking.trackingId}>
                          <th scope="row">{index + 1}</th>
                          <td>{tracking.month}</td>
                          <td>{tracking.year}</td>
                          <td>{tracking.projectName}</td>
                          <td>{tracking.actualHours}</td>
                          <td>{tracking.actualRate}</td>
                          <td>{tracking.actualAmt}</td>
                          <td>{tracking.paidHours}</td>
                          <td>{tracking.paidRate}</td>
                          <td>{tracking.paidAmt}</td>
                          <td>{tracking.balance}</td>
                          <td>
                            <div className="icon-container">
                              <FiEdit2
                                onClick={() =>
                                  handleEditTracking(
                                    employeeId,
                                    tracking.trackingId
                                  )
                                }
                                size={20}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="11" className="text-end">
                          Total Balance: {totalBalance}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}

function groupByProject(trackings) {
  if (!Array.isArray(trackings)) {
    return {};
  }
  return trackings.reduce((groups, tracking) => {
    const projectName = tracking.projectName;
    if (!groups[projectName]) {
      groups[projectName] = [];
    }
    groups[projectName].push(tracking);
    return groups;
  }, {});
}
