import React, { useState, useEffect } from 'react';
import CustomGrid from "../pages/CustomGrid";
import { FiEdit2 } from "react-icons/fi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate,Link } from "react-router-dom";
import Pagination from "../pages/Pagination";

export default function CandidateList() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
const [pageSize, setPageSize] = useState(10);
const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/candidates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const data = await response.json();
      setRowData(data);
      console.log(data);
        setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const gridColumns = [
    { field: "firstName", label: "First Name" },
    { field: "lastName", label: "Last Name" },
    { field: "skills", label: "Skills" },
    { field: "recruiterName", label: "Recruiter Name" },
    { field: "phoneNo", label: "Phone Number" },
    {field: "emailAddress", label: "Email" },
    { field: "originalVisaStatus", label: "Visa Status"},
    { field: "comments", label: "Comments"},
    { field: "candidateStatus", label:"Candidate Status"}
  ];
  const customColumns = [
    {
      render: (candidate) => (
        <FiEdit2
          onClick={() => handleEditCandidate(candidate.candidateID)}
          size={20}
          title="Edit Candidate"
          style={{ cursor: 'pointer' }}
        />
      ),
    },
  ];
  
  const handleEditCandidate = (candidateID) => {
    navigate(`/editcandidate/${candidateID}`);
  };

  return (
    <div className="container">
    <div className="py-4">
      <h2>Candidates List</h2>
      <div className="add-orders d-flex justify-content-end">
          <Link className="add-user-link" to="/addcandidate">
            <BsFillPersonPlusFill size={25} title="Add Candidate" />
          </Link>
        </div>
      {isLoading ? (
          <p>Loading...</p>
        ) : rowData.length === 0 ? (
          <p>No candidates to display.</p>
        ) : (
          <CustomGrid data={rowData} columns={gridColumns} customColumns={customColumns} />
        )}
    </div>
    </div>
  );
}
