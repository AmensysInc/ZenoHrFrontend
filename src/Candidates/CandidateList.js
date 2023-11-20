import React, { useState, useEffect } from "react";
import CustomGrid from "../SharedComponents/CustomGrid";
import { FiEdit2 } from "react-icons/fi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input, Button, Checkbox, InputNumber} from "antd";
import { AiFillDelete } from "react-icons/ai";
import { deleteCandidate, fetchCandidates, fetchCandidatesWithoutPagination, fetchCandidatesWithMarketing, fetchCandidatesWithMarketingAndWithouPagination} from "../SharedComponents/services/CandidateService";

export default function CandidateList({ inMarketing }) {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, searchField, pagination, inMarketing]);

  const fetchData = async () => {
      let result;

      if(inMarketing){
        if (pagination) {
          result = await fetchCandidatesWithMarketing(currentPage, pageSize, searchQuery, searchField);

          setRowData(result.content);
          setIsLoading(false);
          setTotalPages(result.totalPages);
        } else {
          result = await fetchCandidatesWithMarketingAndWithouPagination(searchQuery, searchField);
          setRowData(result);
        }
      }
      else{
        if (pagination) {
          result = await fetchCandidates(currentPage, pageSize, searchQuery, searchField);

          setRowData(result.content);
          setIsLoading(false);
          setTotalPages(result.totalPages);
        } else {
          result = await fetchCandidatesWithoutPagination(searchQuery, searchField);
          setRowData(result);
        }
      }
    }

  const handleSearch = () => {
    fetchData();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    fetchData();
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

  const gridColumns = [
    { field: "firstName", label: "First Name", resizable: true},
    { field: "lastName", label: "Last Name" },
    { field: "skills", label: "Skills" },
    { field: "recruiterName", label: "Recruiter Name" },
    { field: "phoneNo", label: "Phone Number" },
    { field: "emailAddress", label: "Email" },
    { field: "originalVisaStatus", label: "Visa Status" },
    { field: "marketingVisaStatus", label: "Marketing Visa"},
    { field: "comments", label: "Comments" },
    { field: "candidateStatus", label: "CandidateStatus" },
    {field: "reference", label: "Reference"}
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
          {!inMarketing?
          <AiFillDelete
            onClick={() => handleDeleteCandidate(params.data.candidateID)}
            size={20}
            title="Delete"
            style={{ cursor: "pointer" }}
          />:null}
        </>
      ),
    },
  ];

  const handleEditCandidate = (candidateID) => {
    navigate(`/editcandidate/${candidateID}`);
  };
  const handleDeleteCandidate = async (candidateID) => {
    const success = await deleteCandidate(candidateID);
    if (success) {
      fetchData();
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        {inMarketing? <h2>InMarketing List</h2> : <h2>Candidates List</h2>}
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
      <div className="pagination-checkbox">
        <Checkbox
          checked={pagination}
          onChange={(e) => setPagination(e.target.checked)}
        >
          Enable Pagination
        </Checkbox>
        {pagination?(
        <><span style={{ marginLeft: 16 }}>Page Size:</span><InputNumber
            min={1}
            value={pageSize}
            onChange={handlePageSizeChange} /></>):null}
      </div>
      {pagination?(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />):null}
    </div>
  );
}
