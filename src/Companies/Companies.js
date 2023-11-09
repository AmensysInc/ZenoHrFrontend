import React, { useState, useEffect } from "react";
import CustomGrid from "../SharedComponents/CustomGrid";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { fetchCompanies } from "../SharedComponents/services/CompaniesServies";

export default function Companies() {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const content = await fetchCompanies();
    setRowData(content);
    setIsLoading(false);
  };

  const gridColumns = [
    { field: "companyName", label: "Company" },
    { field: "email", label: "Email" },
  ];

  return (
    <div className="container">
      <div className="py-4">
        <h2>Companies List</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : rowData && rowData.length === 0 ? (
          <p>No companies to display.</p>
        ) : (
          <CustomGrid data={rowData} columns={gridColumns} />
        )}
      </div>
    </div>
  );
}
