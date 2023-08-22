import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import Pagination from "../pages/Pagination";

export default function ProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [projectHistory, setProjectHistory] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = location.state.employeeId;

  useEffect(() => {
    fetchProjectHistory();
  }, [currentPage, pageSize]);

  const fetchProjectHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const projectHistoryResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/projects?page=${currentPage}&size=${pageSize}`,
        requestOptions
      );
      const detailsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
      const projectHistoryData = await projectHistoryResponse.json();
      const detailsData = await detailsResponse.json();
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
      setProjectHistory(projectHistoryData.content);
      setTotalPages(projectHistoryData.totalPages);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleEditHistory = (projectId) => {
    navigate("/editemployee/project-history/editprojecthistory", {
      state: { employeeId, projectId },
    });
  };

  const handleAddProject = (employeeId) => {
    navigate("/editemployee/project-history/addproject", {
      state: { employeeId },
    });
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
            onClick={() => handleAddProject(employeeId)}
          >
            <BiSolidAddToQueue size={15} />
            New Projects
          </button>
        </div>
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
              projectHistory.map((history, index) => {
                const userIndex = index + currentPage * pageSize;
                return (
                <tr key={userIndex}>
                  <th scope="row">{userIndex + 1}</th>
                  <td>{history.subVendorOne}</td>
                  <td>{history.subVendorTwo}</td>
                  <td>{history.projectAddress}</td>
                  <td>{history.projectStartDate}</td>
                  <td>{history.projectEndDate}</td>
                  <td>{history.projectStatus}</td>
                  <td>
                    <div className="icon-container">
                      <FiEdit2
                        onClick={() => handleEditHistory(history.projectId)}
                        size={20}
                        title="Edit Project History"
                      />
                    </div>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="7">No Project History</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  );
}
