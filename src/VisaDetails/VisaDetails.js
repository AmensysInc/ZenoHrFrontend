import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import Pagination from "../pages/Pagination";

export default function VisaDetails() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [visaDetails, setVisaDetails] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = location.state.employeeId;

  useEffect(() => {
    fetchVisaDetails(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchVisaDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const detailsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        config
      );
      const detailsData = await detailsResponse.json();
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
      const response = await fetch(
        `${apiUrl}/employees/${employeeId}/visa-details`,
        config
      );
      const data = await response.json();
      console.log(data);
      setVisaDetails(data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching visa details:", error);
    }
  };

  const handleEditDetails = (visaId) => {
    navigate("/editemployee/visa-details/editvisadetails", {
      state: { employeeId: employeeId, visaId: visaId },
    });
  };

  const handleAddDetails = (employeeId) => {
    navigate("/editemployee/visa-details/addvisadetails", {
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
            onClick={() => handleAddDetails(employeeId)}
          >
            <BiSolidAddToQueue size={15} />
            Visa Details
          </button>
        </div>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Visa Start Date</th>
              <th scope="col">Visa Expiry Date</th>
              <th scope="col">Visa Type</th>
            </tr>
          </thead>
          <tbody>
            {visaDetails.length > 0 ? (
              visaDetails.map((details, index) => {
                const userIndex = index + currentPage * pageSize;
                return (
                <tr key={userIndex}>
                  <th scope="row">{userIndex + 1}</th>
                  <td>{details.visaStartDate}</td>
                  <td>{details.visaExpiryDate}</td>
                  <td>{details.visaType}</td>
                  <td>
                    <div className="icon-container">
                      <FiEdit2
                        onClick={() => handleEditDetails(details.visaId)}
                        size={20}
                        title="Edit Visa Details"
                      />
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No Visa Details Available</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  );
}
