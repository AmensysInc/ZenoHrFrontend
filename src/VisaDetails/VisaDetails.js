import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input , Button } from "antd";
import { getUserDetails } from "../SharedComponents/services/OrderService";
import { getVisaForEmployee } from "../SharedComponents/services/VisaDetailsService";

export default function VisaDetails() {
  const [visaDetails, setVisaDetails] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const navigate = useNavigate();
  let {employeeId} = useParams();

  useEffect(() => {
    if (employeeId) {
      fetchVisaDetails();
    }
  }, [currentPage, pageSize, employeeId, searchQuery, searchField]);

  const fetchVisaDetails = async () => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("page", currentPage);
      searchParams.append("size", pageSize);
      if (searchQuery) {
        searchParams.append("searchField", searchField);
        searchParams.append("searchString", searchQuery);
      }
      const detailsData = await getUserDetails(employeeId);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
      const data = await getVisaForEmployee(employeeId, currentPage, pageSize, searchQuery, searchField);
      setVisaDetails(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching visa details:", error);
    }
  };

  const handleEditDetails = (employeeId,visaId) => {
    navigate(`/editemployee/${employeeId}/visa-details/${visaId}/editvisadetails`);
  };

  const handleAddDetails = (employeeId) => {
    navigate(`/editemployee/${employeeId}/visa-details/add-visa-details`);
  };
  const handleSearch = () => {
    fetchVisaDetails();
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    fetchVisaDetails();
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
            onClick={() => handleAddDetails(employeeId)}
          >
            <BiSolidAddToQueue size={15} />
            Visa Details
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
              <Select.Option value="visaStartDate">Visa StartDate</Select.Option>
              <Select.Option value="visaExpiryDate">Visa EndDate</Select.Option>
              <Select.Option value="visaType">Visa Type</Select.Option>
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
                        onClick={() => handleEditDetails(employeeId,details.visaId)}
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
