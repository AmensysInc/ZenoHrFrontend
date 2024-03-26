import React, { useState, useEffect } from "react";
import CustomGrid from "../SharedComponents/CustomGrid";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { Select, Input, Button } from "antd";
import Pagination from "../SharedComponents/Pagination";
import { deleteCompanies, fetchCompanies } from "../SharedComponents/services/CompaniesServies";

export default function Companies() {
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
    const { content, totalPages } = await fetchCompanies(currentPage, pageSize, searchQuery, searchField);
    setRowData(content);
    setIsLoading(false);
    setTotalPages(totalPages);
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
    { field: "companyName", label: "Company" },
    { field: "email", label: "Email" },
  ];

  const customColumns = [
    {
      label: "",
      field: "actions",
      render: (params) => (
        <>
          <AiFillDelete
            onClick={() => handleDeleteCompany(params.data.companyId)}
            size={20}
            title="Delete"
            style={{ cursor: "pointer" }}
          />
        </>
      ),
    },
  ];

  const handleDeleteCompany = async (companyId) => {
    const success = await deleteCompanies(companyId);
    if (success) {
      fetchData();
    }
  };

  return (
    <>
      <h2>Companies List</h2>
      <div className="search-container">
        <div className="search-bar">
          <Select
            value={searchField}
            onChange={(value) => setSearchField(value)}
            style={{ width: 120 }}
          >
            <Select.Option value="">Select Field</Select.Option>
            <Select.Option value="companyName">Company</Select.Option>
            <Select.Option value="email">Email Id</Select.Option>
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
        <p>No companies to display.</p>
      ) : (
        <CustomGrid
          data={rowData}
          columns={gridColumns}
          customColumns={customColumns}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
