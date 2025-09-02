import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VisaDetailsGrid() {
  const [visaDetails, setVisaDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchField, setSearchField] = useState("");
  const [searchString, setSearchString] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [showExpired, setShowExpired] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchVisaDetails = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/visa-details`, {
        params: { page, size, searchField, searchString },
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = response.data.content;

      if (showExpired) {
        const today = new Date().toISOString().split("T")[0];
        data = data
          .filter((visa) => visa.visaExpiryDate && visa.visaExpiryDate < today)
          .sort((a, b) => (a.visaExpiryDate < b.visaExpiryDate ? 1 : -1));
      } else {
        data = data.sort((a, b) =>
          (b.employeeName || "").localeCompare(a.employeeName || "")
        );
      }

      setVisaDetails(data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching visa details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVisaDetails();
  }, [page, size, showExpired]);

  const handleSearch = () => {
    setPage(0);
    fetchVisaDetails();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Visa Details (All Employees)</h2>
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showExpired}
            onChange={(e) => setShowExpired(e.target.checked)}
          />
          Show Expired Visas
        </label>
      </div>

      {loading ? (
        <p>Loading visa details...</p>
      ) : visaDetails.length === 0 ? (
        <p>No visa details found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Employee Name</th>
              <th className="border p-2">Visa Type</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">I-94 Date</th>
              <th className="border p-2">Job Title</th>
            </tr>
          </thead>
          <tbody>
            {visaDetails.map((visa) => (
              <tr key={visa.visaId} className="text-center">
                <td className="border p-2">{visa.employeeName || "N/A"}</td>
                <td className="border p-2">{visa.visaType}</td>
                <td className="border p-2">{visa.visaStartDate}</td>
                <td className="border p-2">{visa.visaExpiryDate}</td>
                <td className="border p-2">{visa.i94Date}</td>
                <td className="border p-2">{visa.jobTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
