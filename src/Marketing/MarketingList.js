import React, { useState, useEffect } from 'react';
import CustomGrid from "../pages/CustomGrid";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function MarketingList() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/candidates/inMarketing`, {
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
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditCandidate = (candidateID) => {
    navigate(`/editcandidate/${candidateID}`);
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

  return (
    <div className="container">
    <div className="py-4">
      <h2>InMarketing List</h2>
      {isLoading ? (
          <p>Loading...</p>
        ) : rowData.length === 0 ? (
          <p>No candidates to display for Marketing.</p>
        ) : (
          <CustomGrid data={rowData} columns={gridColumns} customColumns={customColumns} />
        )}
    </div>
    </div>
  );
}

