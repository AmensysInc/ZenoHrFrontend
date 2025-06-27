import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { FaCheck, FaTimes } from "react-icons/fa";
import CustomGrid from "../SharedComponents/CustomGrid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getTimeSheetStatus } from "../SharedComponents/services/TimeSheetService";
import { get, post } from "../SharedComponents/httpClient ";
import _ from "lodash";
import { TbCloudDownload } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";

const { Option } = Select;

export default function TimeSheets() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [timeSheets, setTimeSheets] = useState([]);
  const [timeSheetsOriginal, setTimeSheetsOriginal] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState(["APPROVED", "REJECTED", "PENDING"]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isFileInputEnabled, setIsFileInputEnabled] = useState(false);
  const defaultCompanyId = Number(sessionStorage.getItem("defaultCompanyId")) || null;
  const roleFromSessionStorage = sessionStorage.getItem("role");
  const employeeIdFromSessionStorage = sessionStorage.getItem("id");
  const role = roleFromSessionStorage
    ? roleFromSessionStorage.replace(/"/g, "")
    : "";

  useEffect(() => {
    setIsFileInputEnabled(!!(selectedProject && selectedMonth && selectedYear));
  }, [selectedProject, selectedMonth, selectedYear]);

  useEffect(() => {
    if (role === "ADMIN") {
      get("/employees")
        .then((response) => {
          const data = response.data;
          // if (data && data.content && Array.isArray(data.content)) {
          //   setEmployees(data.content);
           if (data && data.content && Array.isArray(data.content)) {
          const filteredEmployees = data.content.filter(employee => 
            employee.company && employee.company.companyId === defaultCompanyId
          );
          setEmployees(filteredEmployees);
          } else {
            console.error("API response does not contain an array:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    } else {
      setSelectedEmployee(employeeIdFromSessionStorage);
    }
  }, [apiUrl]);

  useEffect(() => {
    getTimeSheetStatus().then((data) => {
      setStatus(data);
    });
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      get(`employees/${selectedEmployee}/projects`)
        .then((response) => {
          const data = response.data;
          if (data && data.content && Array.isArray(data.content)) {
            setProjects(data.content);
          } else {
            console.error("API response does not contain an array:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });
    }
  }, [selectedEmployee, apiUrl]);

  useEffect(() => {
    if (selectedEmployee && selectedProject && selectedYear && selectedMonth) {
      const monthName = monthOptions[parseInt(selectedMonth, 10) - 1];
      get(
        `/timeSheets/getUploadedFiles/${selectedEmployee}/${selectedProject.projectId}/${selectedYear}/${monthName}`
      )
        .then((response) => {
          const data = response.data;
          const formattedFiles = data.map((file) => ({
            ...file,
            formattedDate: formatUploadedDate(file.uploadedAt),
          }));
          setUploadedFiles(formattedFiles);
        })
        .catch((error) => {
          console.error("Error fetching uploaded files:", error);
        });
    }
  }, [selectedEmployee, selectedProject, selectedYear, selectedMonth]);

  const formatUploadedDate = (dateArray) => {
    if (!dateArray || dateArray.length < 6) return "";
    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (selectedEmployee && selectedMonth && selectedYear && selectedProject) {
      const datesInMonth = getDatesInMonth(selectedMonth, selectedYear);
      const requestBody = {
        month: parseInt(selectedMonth, 10),
        year: selectedYear,
        employeeId: selectedEmployee,
        projectId: selectedProject.projectId,
      };

      post("/timeSheets/getAllTimeSheets", requestBody)
        .then((response) => {
          const data = response.data;
          if (data && Array.isArray(data)) {
            const dataMap = new Map(
              data.map((item) => [
                item.date,
                {
                  ...item,
                  date: new Date(item.date),
                  day: getAbbreviatedDay(new Date(item.date)),
                },
              ])
            );

            const filledData = datesInMonth.map((date) => {
              const dataItem = dataMap.get(date.getTime());
              return dataItem
                ? { ...dataItem, __dirty: false }
                : {
                    date,
                    regularHours: 0,
                    overTimeHours: 0,
                    day: getAbbreviatedDay(date),
                    __dirty: false,
                    status: null,
                  };
            });

            setTimeSheets(filledData);
            setTimeSheetsOriginal(_.cloneDeep(filledData));
          } else {
            console.error("API response does not contain an array:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching time sheets:", error);
        });
    } else {
      setTimeSheets([]);
    }
  }, [selectedEmployee, selectedMonth, selectedYear, selectedProject]);

  const onCellValueChanged = (params) => {
    const { data, colDef, newValue } = params;
    const { field } = colDef;

    setTimeSheets((prevTimeSheets) =>
      prevTimeSheets.map((record) => {
        if (record.date === data.date) {
          const updatedRecord = { ...record, [field]: newValue, __dirty: true };
          return updatedRecord;
        }
        return record;
      })
    );
  };
  const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    setSelectedFiles((prevFiles) => {
      // Calculate current total size
      const currentTotalSize = prevFiles.reduce(
        (sum, file) => sum + file.size,
        0
      );

      // Filter new files
      const filteredNewFiles = [];
      let newTotalSize = currentTotalSize;

      for (const file of newFiles) {
        if (newTotalSize + file.size > MAX_TOTAL_SIZE) {
          alert(
            `Cannot add ${file.name} - total size would exceed ${
              MAX_TOTAL_SIZE / 1024 / 1024
            }MB`
          );
          continue;
        }

        const isDuplicate = prevFiles.some(
          (f) =>
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

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = () => {
    const transformedData = timeSheets
      .filter((record) => record.__dirty)
      .map((record) => ({
        month: selectedMonth,
        year: selectedYear,
        employeeId: selectedEmployee,
        projectId: selectedProject.projectId,
        sheetId: record.sheetId,
        regularHours: record.regularHours,
        overTimeHours: record.overTimeHours,
        date: record.date.toISOString(),
        status: record.status,
      }));

    post("/timeSheets/createTimeSheet", transformedData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching time sheets:", error);
      });

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("employeeID", selectedEmployee);
      selectedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      const monthName = monthOptions[parseInt(selectedMonth, 10) - 1];

      post(
        `/timeSheets/uploadfiles/${selectedEmployee}/${selectedProject.projectId}/${selectedYear}/${monthName}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((response) => {
          console.log(response);
          setSelectedFiles([]);
          get(
            `/timeSheets/getUploadedFiles/${selectedEmployee}/${selectedProject.projectId}/${selectedYear}/${monthName}`
          ).then((response) => {
            const data = response.data;
            const formattedFiles = data.map((file) => ({
              ...file,
              formattedDate: formatUploadedDate(file.uploadedAt),
            }));
            setUploadedFiles(formattedFiles);
          });
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
        });
    }

    setTimeSheets((prevTimeSheets) =>
      prevTimeSheets.map((record) => ({ ...record, __dirty: false }))
    );
  };

  const handleCancel = () => {
    setTimeSheets(timeSheetsOriginal);
    setSelectedFiles([]);
  };

  const handleDelete = (fileName) => {
    if (!fileName || !selectedEmployee) return;

    const token = sessionStorage.getItem("token");
    fetch(
      `${apiUrl}/timeSheets/deleteUploadedFile/${selectedEmployee}/${fileName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(() => {
        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => file.fileName !== fileName)
        );
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const handleApprove = (timeSheet) => {
    let timeSheetData = [
      {
        month: selectedMonth,
        year: selectedYear,
        employeeId: selectedEmployee,
        projectId: selectedProject.projectId,
        sheetId: timeSheet.sheetId,
        regularHours: timeSheet.regularHours,
        overTimeHours: timeSheet.overTimeHours,
        date: timeSheet.date.toISOString(),
        status: "APPROVED",
      },
    ];

    const updatedTimeSheets = timeSheets.map((t) =>
      t.date === timeSheet.date ? { ...t, status: "APPROVED" } : t
    );

    setTimeSheets(updatedTimeSheets);

    post("/timeSheets/createTimeSheet", timeSheetData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching time sheets:", error);
      });
  };

  const handleReject = (timeSheet) => {
    let timeSheetData = [
      {
        month: selectedMonth,
        year: selectedYear,
        employeeId: selectedEmployee,
        projectId: selectedProject.projectId,
        sheetId: timeSheet.sheetId,
        regularHours: timeSheet.regularHours,
        overTimeHours: timeSheet.overTimeHours,
        date: timeSheet.date.toISOString(),
        status: "REJECTED",
      },
    ];

    const updatedTimeSheets = timeSheets.map((t) =>
      t.date === timeSheet.date ? { ...t, status: "REJECTED" } : t
    );

    setTimeSheets(updatedTimeSheets);

    post("/timeSheets/createTimeSheet", timeSheetData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching time sheets:", error);
      });
  };

  const handleDownloadFile = (fileName) => {
    if (
      !fileName ||
      !selectedEmployee ||
      !selectedProject ||
      !selectedYear ||
      !selectedMonth
    )
      return;

    const token = sessionStorage.getItem("token");
    const monthName = monthOptions[parseInt(selectedMonth, 10) - 1];

    fetch(
      `${apiUrl}/timeSheets/downloadFile/${selectedEmployee}/${selectedProject.projectId}/${selectedYear}/${monthName}/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to download file");
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        alert("Error downloading file. Please try again.");
      });
  };

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const yearOptions = Array.from({ length: 80 }, (_, i) => 2020 + i);

  const getDayStyle = (params) => {
    if (params.value instanceof Date) {
      return params.value.getDay() === 0 || params.value.getDay() === 6
        ? { color: "red" }
        : {};
    }
    return {};
  };

  const getAbbreviatedDay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const getDatesInMonth = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const datesArray = [];
    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      datesArray.push(new Date(date));
    }
    return datesArray;
  };

  const [gridOptions] = useState({
    defaultColDef: { resizable: true },
    onCellValueChanged: onCellValueChanged,
  });

  const columnDefs = [
    { headerName: "Date", field: "date", width: 150, cellStyle: getDayStyle },
    { headerName: "Day", field: "day", width: 80, cellStyle: getDayStyle },
    {
      headerName: "Regular Hours",
      field: "regularHours",
      width: 150,
      editable: true,
    },
    {
      headerName: "Overtime Hours",
      field: "overTimeHours",
      width: 150,
      editable: true,
    },
    { headerName: "Status", field: "status", width: 120, editable: false },
  ];

  const customColumns = [
    {
      label: "",
      field: "actions",
      render: (params) => (
        <>
          <FaCheck
            size={20}
            title="Approve"
            onClick={() => handleApprove(params.data)}
            style={{ color: "green", cursor: "pointer", marginRight: "10px" }}
          />
          <FaTimes
            size={20}
            title="Reject"
            onClick={() => handleReject(params.data)}
            style={{ color: "red", cursor: "pointer" }}
          />
        </>
      ),
    },
  ];

  const handleApproveAll = () => {
  // Filter out only the timesheets that need to be approved (not already approved)
  const timesheetsToApprove = timeSheets.filter(
    (ts) => ts.status !== "APPROVED" && (ts.regularHours > 0 || ts.overTimeHours > 0)
  );
  const handleApproveAll = () => {
  const timesheetsToApprove = timeSheets.filter(
    (ts) => ts.status !== "APPROVED" && (ts.regularHours > 0 || ts.overTimeHours > 0)
  );

  if (timesheetsToApprove.length === 0) {
    alert("No timesheets to approve or all are already approved!");
    return;
  }

  if (!window.confirm(`Are you sure you want to approve ${timesheetsToApprove.length} timesheets?`)) {
    return;
  }
};

  if (timesheetsToApprove.length === 0) {
    alert("No timesheets to approve or all are already approved!");
    return;
  }

  const timeSheetData = timesheetsToApprove.map((timeSheet) => ({
    month: selectedMonth,
    year: selectedYear,
    employeeId: selectedEmployee,
    projectId: selectedProject.projectId,
    sheetId: timeSheet.sheetId,
    regularHours: timeSheet.regularHours,
    overTimeHours: timeSheet.overTimeHours,
    date: timeSheet.date.toISOString(),
    status: "APPROVED",
  }));

  // Update local state
  const updatedTimeSheets = timeSheets.map((t) => {
    if (timesheetsToApprove.some((ts) => ts.date === t.date)) {
      return { ...t, status: "APPROVED", __dirty: true };
    }
    return t;
  });

  setTimeSheets(updatedTimeSheets);

  // Send to API
  post("/timeSheets/createTimeSheet", timeSheetData)
    .then((response) => {
      console.log("All timesheets approved:", response);
    })
    .catch((error) => {
      console.error("Error approving all timesheets:", error);
    });
};


  return (
    <div
      className="timesheets-container"
      style={{ marginLeft: "200px", width: "50%" }}
    >
      <div className="input-group">
        {role === "ADMIN" && (
          <div className="input-item">
            <label>Employee</label>
            <Select
              style={{ width: "150px", marginRight: "8px" }}
              value={selectedEmployee.employeeID}
              onChange={(value) => setSelectedEmployee(value)}
            >
              <Option value="">-- Select --</Option>
              {Array.isArray(employees) &&
                employees.map((employee) => (
                  <Option key={employee.employeeID} value={employee.employeeID}>
                    {employee.firstName} {employee.lastName}
                  </Option>
                ))}
            </Select>
          </div>
        )}

        <div className="input-item">
          <label>Project</label>
          <Select
            className="select-class"
            value={selectedProject ? selectedProject.projectId : ""}
            onChange={(value) =>
              setSelectedProject(
                projects.find((project) => project.projectId === value)
              )
            }
          >
            <Option value="">-- Select --</Option>
            {Array.isArray(projects) &&
              projects.map((project) => (
                <Option key={project.projectId} value={project.projectId}>
                  {project.subVendorOne}/{project.subVendorTwo}
                </Option>
              ))}
          </Select>
        </div>
        <div className="input-item">
          <label>Month</label>
          <Select
            className="select-class"
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
          >
            <Option value="">-- Select --</Option>
            {monthOptions.map((month, index) => (
              <Option key={index + 1} value={(index + 1).toString()}>
                {month}
              </Option>
            ))}
          </Select>
        </div>

        <div className="input-item">
          <label>Year</label>
          <Select
            className="select-class"
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
          >
            <Option value="">-- Select --</Option>
            {yearOptions.map((year) => (
              <Option key={year} value={year.toString()}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "100%", marginTop: "20px" }}
      >
        <CustomGrid
          gridOptions={gridOptions}
          data={timeSheets}
          columns={columnDefs}
          customColumns={role === "ADMIN" ? customColumns : []}
        />
      </div>

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
          className={`btn ${
            !isFileInputEnabled ? "btn-outline-secondary" : "btn-primary"
          }`}
          style={{
            marginRight: "10px",
            cursor: isFileInputEnabled ? "pointer" : "not-allowed",
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

      <div style={{ marginTop: "20px" }}>
        <h4>Uploaded Files</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {uploadedFiles.map((file, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div>{file.fileName}</div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>
                  Uploaded: {file.uploadedAt}
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <TbCloudDownload
                  size={25}
                  title="Download"
                  onClick={() => handleDownloadFile(file.fileName)}
                  style={{ cursor: "pointer" }}
                />
                <AiFillDelete
                  onClick={() => handleDelete(file.fileName)}
                  size={20}
                  className="delete-icon"
                  title="Delete"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      

      <div style={{ marginTop: "20px" }}>
  {role === "ADMIN" && (
    <button
      onClick={handleApproveAll}
      disabled={timeSheets.length === 0}
      className={`btn ${
        timeSheets.length === 0 ? "btn-outline-secondary" : "btn-primary"
      }`}
      style={{ marginRight: "10px" }}
    >
      Approve All
    </button>
  )}
  <button
    onClick={handleSubmit}
    disabled={
      !(timeSheets.some((row) => row.__dirty) || selectedFiles.length > 0)
    }
    className={`btn ${
      !(timeSheets.some((row) => row.__dirty) || selectedFiles.length > 0)
        ? "btn-outline-secondary"
        : "btn-success"
    }`}
    style={{ marginRight: "10px" }}
  >
    Submit
  </button>
  <button
    onClick={handleCancel}
    disabled={timeSheets.every((row) => !row.__dirty)}
    className={`btn ${
      timeSheets.every((row) => !row.__dirty)
        ? "btn-outline-secondary"
        : "btn-danger"
    }`}
  >
    Cancel
  </button>
</div>
    </div>
  );
}