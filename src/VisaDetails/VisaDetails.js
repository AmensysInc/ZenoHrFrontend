import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input, Button } from "antd";
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
  const { employeeId } = useParams();

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

      const data = await getVisaForEmployee(
        employeeId,
        currentPage,
        pageSize,
        searchQuery,
        searchField
      );

      setVisaDetails(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching visa details:", error);
    }
  };

  const handleEditDetails = (employeeId, visaId) => {
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

        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary" onClick={() => handleAddDetails(employeeId)}>
            <BiSolidAddToQueue size={15} />
            &nbsp;Visa Details
          </button>
        </div>

        <div className="search-container mb-3 d-flex align-items-center gap-2">
          <Select
            value={searchField}
            onChange={(value) => setSearchField(value)}
            style={{ width: 160 }}
          >
            <Select.Option value="">Select Field</Select.Option>
            <Select.Option value="visaStartDate">Visa Start Date</Select.Option>
            <Select.Option value="visaExpiryDate">Visa End Date</Select.Option>
            <Select.Option value="visaType">Visa Type</Select.Option>
            <Select.Option value="i94Date">I94 Date</Select.Option>
            <Select.Option value="lcaNumber">LCA Number</Select.Option>
            <Select.Option value="jobTitle">Job Title</Select.Option>
            <Select.Option value="i140Status">I140 Status</Select.Option>
          </Select>
          <Input.Search
            placeholder="Search..."
            onSearch={handleSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            enterButton
            style={{ maxWidth: 300 }}
          />
          <Button onClick={handleClearSearch}>Clear</Button>
        </div>

        <div className="table-responsive">
          <table className="table border shadow">
            <thead className="table-light">
              <tr>
                <th>S.No</th>
                <th>Visa Start Date</th>
                <th>Visa Expiry Date</th>
                <th>Visa Type</th>
                <th>I94 Date</th>
                <th>LCA Number</th>
                <th>LCA Wage</th>
                <th>Job Title</th>
                <th>I140 Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visaDetails.length > 0 ? (
                visaDetails.map((details, index) => {
                  const userIndex = index + currentPage * pageSize;
                  return (
                    <tr key={userIndex}>
                      <td>{userIndex + 1}</td>
                      <td>{details.visaStartDate}</td>
                      <td>{details.visaExpiryDate}</td>
                      <td>{details.visaType}</td>
                      <td>{details.i94Date}</td>
                      <td>{details.lcaNumber}</td>
                      <td>{details.lcaWage}</td>
                      <td>{details.jobTitle}</td>
                      <td>{details.i140Status}</td>
                      <td>
                        <FiEdit2
                          onClick={() => handleEditDetails(employeeId, details.visaId)}
                          size={20}
                          title="Edit Visa Details"
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No Visa Details Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
