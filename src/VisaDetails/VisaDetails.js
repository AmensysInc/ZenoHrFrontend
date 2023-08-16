import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";

export default function VisaDetails() {
    const apiUrl = process.env.REACT_APP_API_URL;    
    const [visaDetails, setVisaDetails] = useState([]);
    const [userDetail, setUserDetail] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const location = useLocation();
    const employeeId = location.state.employeeId;

    useEffect(() => {
      fetchVisaDetails();
    }, [currentPage]);

    const fetchVisaDetails = async () => {
        try {
            const token = localStorage.getItem('token');
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
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentVisaDetails = data.slice(
              indexOfFirstItem,
              indexOfLastItem
            );
            setVisaDetails(currentVisaDetails)
        } catch (error) {
            console.error("Error fetching visa details:", error);
        }
    };
    const totalPages = Math.ceil(visaDetails.length / itemsPerPage);
    const handlePageChange = (pageNumber) => 
    {
    setCurrentPage(pageNumber);
    };

    const handleEditDetails = (visaId) => {
      navigate("/editemployee/visa-details/editvisadetails", { state: { employeeId: employeeId, visaId: visaId }  });
    };
    
    const handleAddDetails = (employeeId) => {
      navigate("/editemployee/visa-details/addvisadetails", { state: { employeeId } });
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
        {/* <h4 className="text-center">Visa Details</h4> */}
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
              visaDetails.map((details, index) => (
                <tr key={index}>
                  <th scope="row">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </th>
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
              ))
            ) : (
              <tr>
                <td colSpan="7">No Visa Details Available</td>
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
  )
}
