import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeFilesGrid = () => {
  const [employeeFiles, setEmployeeFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployeeFiles();
  }, []);

  const fetchEmployeeFiles = async () => {
    try {
      const token = sessionStorage.getItem("token"); // ✅ Your JWT stored here
      const res = await axios.get("http://localhost:8082/employees/prospectFiles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeFiles(res.data);
    } catch (err) {
      setError("Failed to load employee files.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (employeeID, fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/employees/prospectFiles/${employeeID}/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // important for downloading files
        }
      );

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed");
    }
  };

  if (loading) return <p>Loading employee files...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employees and Uploaded Files</h2>
      {Object.keys(employeeFiles).length === 0 ? (
        <p>No employees or files found.</p>
      ) : (
        <ul className="space-y-4">
          {Object.entries(employeeFiles).map(([employeeID, files]) => (
            <li key={employeeID} className="border rounded-lg p-3 shadow">
              <h3 className="font-semibold">Employee ID: {employeeID}</h3>
              {files.length === 0 ? (
                <p className="text-gray-500">No files uploaded.</p>
              ) : (
                <ul className="list-disc list-inside">
                  {files.map((fileName, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>{fileName}</span>
                      <button
                        onClick={() => handleDownload(employeeID, fileName)}
                        className="ml-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeFilesGrid;