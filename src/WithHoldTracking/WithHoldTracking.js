import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../SharedComponents/Pagination";
import {
  getEmployeeDetails,
  getTrackingForEmployee,
  resetPassword,
} from "../SharedComponents/services/WithHoldService";

export default function WithHoldTracking() {
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
      const trackings = await getTrackingForEmployee(
        employeeId,
        currentPage,
        pageSize,
        searchQuery,
        searchField
      );
      const detailsData = await getEmployeeDetails(employeeId);
      console.log("Employee Details:", detailsData);
      setTrackings(trackings.content);
      setTotalPages(trackings.totalPages);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
        email: detailsData.emailID,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSendEmail = async () => {
    if (!userDetail.email) {
      alert("Email not available for this user.");
      return;
    }

    try {
      await resetPassword({
        email: userDetail.email,
        category: "WITH_HOLD",
      });
      alert("Email sent successfully.");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email.");
    }
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

        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-success"
            onClick={handleSendEmail}
            disabled={!userDetail.email}
          >
            Send Email
          </button>

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
                      <tr>
                        <th>S.No</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Project</th>
                        <th>Actual Hours</th>
                        <th>Actual Rate</th>
                        <th>Actual Amount</th>
                        <th>Paid Hours</th>
                        <th>Paid Rate</th>
                        <th>Paid Amount</th>
                        <th>Balance</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectTrackings.map((tracking, index) => (
                        <tr key={tracking.trackingId}>
                          <td>{index + 1}</td>
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
