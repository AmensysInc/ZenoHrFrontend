import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const employeeID = sessionStorage.getItem("id");

  // Fetch all files
  const fetchFiles = async () => {
    if (!employeeID) {
      setError("No employee ID found in session.");
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8082/employees/prospectFiles/${employeeID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [employeeID]);

  // Download a file
  const downloadFile = async (fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8082/employees/prospectFiles/${employeeID}/${fileName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file.");
    }
  };

  // Upload files
  const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("documents", file);
    }

    try {
      setUploading(true);
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://localhost:8082/employees/prospectFiles/${employeeID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Files uploaded successfully!");
      fetchFiles(); // Refresh file list
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload files.");
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset file input
    }
  };

  if (loading) return <p>Loading files...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Employee Files</h2>
        <label className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer">
          {uploading ? "Uploading..." : "Upload Files"}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {files.length === 0 ? (
        <p>No files found for this employee.</p>
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">File Name</th>
              <th className="border px-4 py-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2">{file}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => downloadFile(file)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
