import React, { useEffect, useState, useCallback, useRef } from "react";
import { Select } from "antd";
import { FaCheck, FaDownload } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
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
  const [selectedFile, setSelectedFile] = useState("");

  // Function to handle file selection
  const handleFileSelect = (value) => {
    setSelectedFile(value);
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const roleFromSessionStorage = sessionStorage.getItem("role");
  const employeeIdFromSessionStorage = sessionStorage.getItem("id");
  const role = roleFromSessionStorage
    ? roleFromSessionStorage.replace(/"/g, "")
    : "";

  useEffect(() => {
    if (role === "ADMIN") {
      get("/employees")
        .then((response) => {
          const data = response.data;

          if (data && data.content && Array.isArray(data.content)) {
            setEmployees(data.content);
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
    if (selectedEmployee) {
      // Fetch uploaded files for the selected employee
      get(`/timeSheets/getUploadedFiles/${selectedEmployee}`)
        .then((response) => {
          const data = response.data;
          // Assuming the response contains an array of file names
          setUploadedFiles(data);
        })
        .catch((error) => {
          console.error("Error fetching uploaded files:", error);
        });
    }
  }, [selectedEmployee]);

  useEffect(() => {
    getTimeSheetStatus().then((data) => {
      setStatus(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      get(`employees/${selectedEmployee}/projects`)
        .then((response) => {
          const data = response.data;
          console.log("Projects content:", data.content);
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
          console.log(data);
          if (data && Array.isArray(data)) {
            // Convert timestamp to Date and create a map for efficient lookup
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

            // Fill in missing dates with regular, OT hours, and day
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

  const handleSubmit = () => {
    // Filter and transform the dirty records to match API request body
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

    // Submit the transformed data
    post("/timeSheets/createTimeSheet", transformedData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching time sheets:", error);
      });
    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("employeeID", selectedEmployee);
    selectedFiles.forEach((file) => {
      formData.append("documents", file);
    });

    // Submit the transformed data along with files
    post(`/timeSheets/uploadfiles/${selectedEmployee}`, formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });

    // Reset the dirty state of the records
    setTimeSheets((prevTimeSheets) =>
      prevTimeSheets.map((record) => ({ ...record, __dirty: false }))
    );
  };

  const handleCancel = () => {
    // Reset the dirty state of the records without submitting changes
    setTimeSheets(timeSheetsOriginal);
    console.log(timeSheets);
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

  const startYear = 2020;
  const endYear = 2099;
  const yearOptions = [];

  for (let year = startYear; year <= endYear; year++) {
    yearOptions.push(year);
  }

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

  const [gridOptions, setGridOptions] = useState({
    defaultColDef: {
      resizable: true,
    },
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

  const handleApprove = (timeSheet) => {
    console.log("TiemSheet : ", timeSheet);
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

    // Update the state with the modified data
    setTimeSheets(updatedTimeSheets);

    console.log(timeSheet.sheetId);
    post("/timeSheets/createTimeSheet", timeSheetData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching time sheets:", error);
      });
  };

  const handleReject = (timeSheet) => {
    console.log("TiemSheet : ", timeSheet);
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

    // Update the state with the modified data
    setTimeSheets(updatedTimeSheets);

    console.log(timeSheet.sheetId);
    post("/timeSheets/createTimeSheet", timeSheetData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching time sheets:", error);
      });
  };

  const handleDownloadFile = (fileName) => {
    if (fileName) {
      const apiUrl = process.env.REACT_APP_API_URL;
      const employeeID = selectedEmployee;
      const token = sessionStorage.getItem("token");

      // Make API call to download file
      fetch(`${apiUrl}/timeSheets/downloadFile/${employeeID}/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          // Check if response is successful
          if (!response.ok) {
            throw new Error("Failed to download file");
          }
          // Convert response to blob
          return response.blob();
        })
        .then((blob) => {
          // Create URL for the blob
          const url = window.URL.createObjectURL(new Blob([blob]));
          // Create a temporary link element
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          // Simulate click on link to trigger download
          document.body.appendChild(link);
          link.click();
          // Cleanup
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    } else {
      console.warn("Please select a file to download.");
    }
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
            style={{ width: "150px", marginRight: "8px" }}
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
            style={{ width: "150px", marginRight: "8px" }}
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
          >
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
            style={{ width: "150px" }}
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
          >
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
        style={{ height: "400px", width: "100%" }}
      >
        <CustomGrid
          gridOptions={gridOptions}
          data={timeSheets}
          columns={columnDefs}
          customColumns={role === "ADMIN" ? customColumns : []}
        />
      </div>

      <input type="file" id="fileInput" multiple onChange={handleFileChange} />

      <div>
        <h4>Uploaded Files</h4>
        <ul>
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              {file}
              <TbCloudDownload
                size={25}
                title="Download"
                onClick={() => handleDownloadFile(file)}
              />
              <AiFillDelete
                // onClick={() => handleDelete(file)}
                size={20}
                className="delete-icon"
                title="Delete"
              />
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSubmit}
        disabled={timeSheets.every((row) => !row.__dirty)}
        className={`btn ${
          timeSheets.every((row) => !row.__dirty)
            ? "btn-outline-secondary"
            : "btn-success"
        }`}
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
  );
}
