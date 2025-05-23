import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { TbCloudDownload } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";

// Configure dayjs to use Sunday as the first day of the week
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const WeeklyTimesheet = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week'));
  const [times, setTimes] = useState({});
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isFileInputEnabled, setIsFileInputEnabled] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8082";

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTimesheetData();
      fetchUploadedFiles();
    }
  }, [selectedProjectId, currentWeekStart]);

  useEffect(() => {
    setIsFileInputEnabled(!!selectedProjectId);
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    const employeeId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    if (!employeeId || !token) {
      console.error("Employee ID or token not found");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/employees/${employeeId}/projects`,
        {
          params: { page: 0, size: 50, searchField: "", searchString: "" },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(response.data.content || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheetData = async () => {
    const employeeId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    if (!employeeId || !token) return;

    try {
      setLoading(true);
      const weekDates = getWeekDays();
      const monthYearPairs = Array.from(
        new Set(weekDates.map((date) => `${date.month() + 1}-${date.year()}`))
      );
      const newTimes = {};
      
      for (const pair of monthYearPairs) {
        const [month, year] = pair.split("-").map(Number);
        const response = await axios.post(
          `${apiUrl}/timeSheets/getAllTimeSheets`,
          {
            employeeId,
            projectId: selectedProjectId,
            month,
            year,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        (response.data || []).forEach((entry) => {
          const entryDate = dayjs(entry.date).format("YYYY-MM-DD");
          newTimes[entryDate] = {
            sheetId: entry.sheetId,
            regularHours: entry.regularHours,
          };
        });
      }
      setTimes(newTimes);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedFiles = async () => {
    const employeeId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    if (!employeeId || !token || !selectedProjectId) return;

    try {
      const weekStart = currentWeekStart;
      const month = weekStart.month() + 1;
      const year = weekStart.year();
      const monthName = getMonthName(month);

      const response = await axios.get(
        `${apiUrl}/timeSheets/getUploadedFiles/${employeeId}/${selectedProjectId}/${year}/${monthName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUploadedFiles(response.data);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber - 1];
  };

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, 'day'));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => prev.subtract(7, 'day'));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => prev.add(7, 'day'));
  };

  const handleTimeChange = (date, value) => {
    setTimes(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        regularHours: value,
      },
    }));
  };

  const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles(prevFiles => {
      const currentTotalSize = prevFiles.reduce((sum, file) => sum + file.size, 0);
      const filteredNewFiles = [];
      let newTotalSize = currentTotalSize;

      for (const file of newFiles) {
        if (newTotalSize + file.size > MAX_TOTAL_SIZE) {
          alert(`Cannot add ${file.name} - total size would exceed ${MAX_TOTAL_SIZE / 1024 / 1024}MB`);
          continue;
        }

        const isDuplicate = prevFiles.some(f => 
          f.name === file.name && 
          f.size === file.size && 
          f.lastModified === file.lastModified
        );

        if (!isDuplicate) {
          filteredNewFiles.push(file);
          newTotalSize += file.size;
        }
      }

      return [...prevFiles, ...filteredNewFiles];
    });
    event.target.value = "";
  };

  const handleSaveTimesheet = async () => {
    const employeeId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    if (!employeeId || !token || !selectedProjectId) return;

    try {
      setLoading(true);
      
      // Save timesheet entries
      const entries = Object.entries(times).map(([dateStr, data]) => {
        const date = dayjs(dateStr);
        return {
          employeeId,
          projectId: selectedProjectId,
          date: date.valueOf(),
          regularHours: Number(data.regularHours || 0),
          overTimeHours: 0,
          sheetId: data.sheetId || null,
          month: date.month() + 1,
          year: date.year(),
          status: null,
        };
      });
      
      await axios.post(`${apiUrl}/timeSheets/createTimeSheet`, entries, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Upload files if any
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append("employeeID", employeeId);
        selectedFiles.forEach(file => formData.append("documents", file));

        const year = currentWeekStart.year();
        const monthName = getMonthName(currentWeekStart.month() + 1);

        await axios.post(
          `${apiUrl}/timeSheets/uploadfiles/${employeeId}/${selectedProjectId}/${year}/${monthName}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSelectedFiles([]);
        const fileInput = document.getElementById("fileInput");
        if (fileInput) fileInput.value = "";
        fetchUploadedFiles();
      }
      alert("Timesheet and files saved successfully!");
    } catch (error) {
      console.error("Error saving timesheet:", error);
      alert("Failed to save timesheet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileName) => {
    if (!fileName) return;

    const employeeId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    const year = currentWeekStart.year();
    const monthName = getMonthName(currentWeekStart.month() + 1);

    try {
      const response = await fetch(
        `${apiUrl}/timeSheets/downloadFile/${employeeId}/${selectedProjectId}/${year}/${monthName}/${fileName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to download file");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (!fileName) return;

    const employeeId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${apiUrl}/timeSheets/deleteUploadedFile/${employeeId}/${fileName}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setUploadedFiles(prevFiles => 
        prevFiles.filter(file => file.fileName !== fileName)
      );
      console.log(`File ${fileName} deleted successfully`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const getTotalHours = () => {
    const weekDates = getWeekDays();
    return weekDates.reduce((sum, date) => {
      const dateStr = date.format("YYYY-MM-DD");
      return sum + Number(times[dateStr]?.regularHours || 0);
    }, 0);
  };

  const handleThisWeek = () => {
    setCurrentWeekStart(dayjs().startOf('week'));
  };

  const handleDateSelect = (e) => {
    const selectedDate = dayjs(e.target.value);
    if (selectedDate.isValid()) {
      setCurrentWeekStart(selectedDate.startOf('week'));
    }
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const weekDays = getWeekDays();

  return (
    <div style={{ padding: 20 }}>
      <h2>Timesheet (Week of {currentWeekStart.format("MMM D, YYYY")})</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Select Project: </label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">-- Select a Project --</option>
          {projects.map((projectHistory) => (
            <option
              key={projectHistory.projectId}
              value={projectHistory.projectId}
            >
              {projectHistory.subVendorOne}/{projectHistory.subVendorTwo}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Pick Date: </label>
        <input
          type="date"
          onChange={handleDateSelect}
          value={currentWeekStart.format("YYYY-MM-DD")}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={handlePrevWeek}>⬅️ Previous Week</button>
        <button onClick={handleThisWeek} style={{ marginLeft: 10 }}>
          🕓 This Week
        </button>
        <button onClick={handleNextWeek} style={{ marginLeft: 10 }}>
          Next Week ➡️
        </button>
        {selectedProjectId && (
          <button
            onClick={handleSaveTimesheet}
            style={{
              marginLeft: 20,
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Save Timesheet
          </button>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table
            border="1"
            cellPadding="10"
            style={{
              marginTop: 20,
              textAlign: "center",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                {weekDays.map((date) => (
                  <th key={date.format("YYYY-MM-DD")}>
                    {date.format("ddd (D MMM)")}
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {weekDays.map((date) => (
                  <td key={date.format("date-row")}>
                    {date.format("YYYY-MM-DD")}
                  </td>
                ))}
                <td></td>
              </tr>
              <tr>
                {weekDays.map((date) => (
                  <td key={date.format("day-row")}>{date.format("dddd")}</td>
                ))}
                <td>
                  <strong>Hours</strong>
                </td>
              </tr>
              <tr>
                {weekDays.map((date) => {
                  const dateStr = date.format("YYYY-MM-DD");
                  return (
                    <td key={dateStr}>
                      <input
                        type="number"
                        value={times[dateStr]?.regularHours || ""}
                        onChange={(e) => handleTimeChange(dateStr, e.target.value)}
                        min="0"
                        max="24"
                        step="0.25"
                        style={{ width: "60px", padding: "5px" }}
                        disabled={!selectedProjectId}
                      />
                    </td>
                  );
                })}
                <td>
                  <strong>{getTotalHours()}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileChange}
              disabled={!isFileInputEnabled}
              style={{ display: "none" }}
            />
            <label
              htmlFor="fileInput"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: isFileInputEnabled ? "#4CAF50" : "#cccccc",
                color: "white",
                borderRadius: "4px",
                cursor: isFileInputEnabled ? "pointer" : "not-allowed",
                marginRight: "10px",
              }}
            >
              Choose Files
            </label>

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <h5>Selected Files:</h5>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                        padding: "5px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                      }}
                    >
                      <span style={{ flex: 1 }}>{file.name}</span>
                      <FaTimes
                        size={14}
                        onClick={() => handleRemoveSelectedFile(index)}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          marginLeft: "10px",
                        }}
                        title="Remove file"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            <h3>Uploaded Files</h3>
            {uploadedFiles.length === 0 ? (
              <div>No files uploaded for this project and month.</div>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {uploadedFiles.map((file, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginRight: 10 }}>
                      {file.fileName}
                      {file.uploadedAt && (
                        <span
                          style={{
                            fontSize: "0.8em",
                            color: "#666",
                            marginLeft: "10px",
                          }}
                        >
                          (Uploaded: {new Date(file.uploadedAt).toLocaleDateString()})
                        </span>
                      )}
                    </span>
                    <TbCloudDownload
                      size={25}
                      title="Download"
                      onClick={() => handleDownloadFile(file.fileName)}
                      style={{ cursor: "pointer", marginRight: 10 }}
                    />
                    <AiFillDelete
                      size={20}
                      title="Delete"
                      onClick={() => handleDeleteFile(file.fileName)}
                      style={{ cursor: "pointer", color: "#ff6b6b" }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSaveTimesheet}
            disabled={!selectedProjectId}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedProjectId ? "#4CAF50" : "#f2f2f2",
              color: selectedProjectId ? "white" : "#aaa",
              border: "none",
              borderRadius: "4px",
              cursor: selectedProjectId ? "pointer" : "not-allowed",
              marginTop: 20,
            }}
          >
            Save Timesheet and Upload Files
          </button>

          {!selectedProjectId && (
            <div style={{ marginTop: 20, color: "#ff6b6b" }}>
              Please select a project to view and edit timesheet data.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeeklyTimesheet;