import React, { useState, useEffect } from "react";
import CustomGrid from "../SharedComponents/CustomGrid";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input, Button } from "antd";
import { fetchCandidatesWithMarketing } from "../SharedComponents/apicalls/CandidateService";

export default function MarketingList() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, searchField]);

  const fetchData = async () => {
    const { content, totalPages } = await fetchCandidatesWithMarketing(currentPage, pageSize, searchQuery, searchField);
      setRowData(content);
      setIsLoading(false);
      setTotalPages(totalPages);
    }

  const handleEditCandidate = (candidateID) => {
    navigate(`/marketing/editcandidate/${candidateID}`);
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    fetchData();
  };

  const gridColumns = [
    { field: "firstName", label: "First Name" },
    { field: "lastName", label: "Last Name" },
    { field: "skills", label: "Skills" },
    { field: "recruiterName", label: "Recruiter Name" },
    { field: "phoneNo", label: "Phone Number" },
    { field: "emailAddress", label: "Email" },
    { field: "university", label: "University" },
    { field: "originalVisaStatus", label: "Visa Status" },
    { field: "comments", label: "Comments" },
    { field: "candidateStatus", label: "Candidate Status" },
  ];

  const customColumns = [
    {
      label: "",
      field: "actions",
      render: (params) => (
        <>
          <FiEdit2
            onClick={() => handleEditCandidate(params.data.candidateID)}
            size={20}
            title="Edit Candidate"
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="py-4">
        <h2>InMarketing List</h2>
        <div className="search-container">
          <div className="search-bar">
            <Select
              value={searchField}
              onChange={(value) => setSearchField(value)}
              style={{ width: 120 }}
            >
              <Select.Option value="">Select Field</Select.Option>
              <Select.Option value="firstName">First Name</Select.Option>
              <Select.Option value="lastName">Last Name</Select.Option>
              <Select.Option value="emailAddress">Email Id</Select.Option>
              <Select.Option value="phoneNo">Phone No</Select.Option>
              <Select.Option value="recruiterName">
                Recruiter Name
              </Select.Option>
              <Select.Option value="skills">Skills</Select.Option>
              <Select.Option value="candidateStatus">
                Candidate Status
              </Select.Option>
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
        {isLoading ? (
          <p>Loading...</p>
        ) : rowData.length === 0 ? (
          <p>No candidates to display for Marketing.</p>
        ) : (
          <CustomGrid
            data={rowData}
            columns={gridColumns}
            customColumns={customColumns}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
