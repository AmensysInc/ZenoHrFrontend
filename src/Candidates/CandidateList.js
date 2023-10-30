import React, { useState, useEffect } from "react";
import CustomGrid from "../SharedComponents/CustomGrid";
import { FiEdit2 } from "react-icons/fi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input, Button } from "antd";
import { AiFillDelete } from "react-icons/ai";

export default function CandidateList() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, searchField]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    try {
      const response = await fetch(
        `${apiUrl}/candidates?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const responseData = await response.json();
      setRowData(responseData.content);
      setIsLoading(false);
      setTotalPages(responseData.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
    { field: "candidateStatus", label: "CandidateStatus" },
  ];
  const customColumns = [
    {
      render: (candidate) => (
        <div className="icon-container">
          <FiEdit2
            onClick={() => handleEditCandidate(candidate.candidateID)}
            size={20}
            title="Edit Candidate"
            style={{ cursor: "pointer" }}
          />
          <AiFillDelete
            onClick={() => handleDeleteCandidate(candidate.candidateID)}
            size={20}
            className="delete-icon"
            title="Delete"
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  const handleEditCandidate = (candidateID) => {
    navigate(`/editcandidate/${candidateID}`);
  };
  const handleDeleteCandidate = async (candidateID) => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await fetch(`${apiUrl}/candidates/${candidateID}`, requestOptions);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <h2>Candidates List</h2>
        <div className="d-flex justify-content-end">
          <Link className="add-user-link" to="/addcandidate">
            <BsFillPersonPlusFill size={25} title="Add Candidate" />
          </Link>
        </div>
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
          <p>No candidates to display.</p>
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
