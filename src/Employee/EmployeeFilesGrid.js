import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeFilesGrid() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchFiles = (query = "") => {
    const token = sessionStorage.getItem("token");
    axios
      .get(`${API_URL}/employees/prospectFiles/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: query ? { search: query } : {},
      })
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.error("Error fetching prospect files", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchFiles(search);
  };

  // ✅ Download function
  const handleDownload = (employeeID, fileName) => {
    const token = sessionStorage.getItem("token");
    axios
      .get(
        `${API_URL}/employees/prospectFiles/${employeeID}/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // important for file download
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Error downloading file", err);
      });
  };

  const handleDelete = (employeeID, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    const token = sessionStorage.getItem("token");
    axios
      .delete(
        `${API_URL}/employees/prospectFiles/${employeeID}/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setFiles((prev) =>
          prev.filter(
            (f) => !(f.employeeID === employeeID && f.fileName === fileName)
          )
        );
        alert("File deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting file", err);
        alert("Failed to delete file");
      });
  };

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Employee Files</h2>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by file name, employee name, or ID"
          className="border px-3 py-2 rounded-lg w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setLoading(true);
            fetchFiles();
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Reset
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">File Name</th>
              <th className="px-4 py-2 text-left">Uploaded By</th>
              <th className="px-4 py-2 text-left">Uploaded Date & Time</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2">{file.fileName}</td>
                  <td className="px-4 py-2">{file.uploadedBy}</td>
                  <td className="px-4 py-2">
                    {new Date(
                      file.uploadTime[0],
                      file.uploadTime[1] - 1,
                      file.uploadTime[2],
                      file.uploadTime[3],
                      file.uploadTime[4],
                      file.uploadTime[5]
                    ).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() =>
                        handleDownload(file.employeeID, file.fileName)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Download
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(file.employeeID, file.fileName)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center">
                  No files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
