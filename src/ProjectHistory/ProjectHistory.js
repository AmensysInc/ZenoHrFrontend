import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [projectHistory, setProjectHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();
  const employeeId = location.state.employeeId;

  useEffect(() => {
    fetchProjectHistory();
  }, [currentPage]);

  const fetchProjectHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `${apiUrl}/employees/${employeeId}/project-history`,
        config
      );
      const data = await response.json();     
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentProjectHistory = data.slice(
        indexOfFirstItem,
        indexOfLastItem
      );
      setProjectHistory(currentProjectHistory);
    } catch (error) {
      console.error("Error fetching project history:", error);
    }
  };
  const totalPages = Math.ceil(projectHistory.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">Project History</h4>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Sub VendorOne</th>
              <th scope="col">Sub VendorTwo</th>
              <th scope="col">Project Address</th>
              <th scope="col">Project StartDate</th>
              <th scope="col">Project EndDate</th>
              <th scope="col">Project Status</th>
            </tr>
          </thead>
          <tbody>
            {projectHistory.length > 0 ? (
              projectHistory.map((history, index) => (
                <tr key={index}>
                  <th scope="row">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </th>
                  <td>{history.subVendorOne}</td>
                  <td>{history.subVendorTwo}</td>
                  <td>{history.projectAddress}</td>
                  <td>{history.projectStartDate}</td>
                  <td>{history.projectEndDate}</td>
                  <td>{history.projectStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No Project History</td>
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