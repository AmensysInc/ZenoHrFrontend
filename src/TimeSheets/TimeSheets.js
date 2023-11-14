import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { get, post } from "../SharedComponents/httpClient ";

const { Option } = Select;

export default function TimeSheets() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [timeSheets, setTimeSheets] = useState([]);
  const [changedRecords, setChangedRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
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
  }, [apiUrl]);

  useEffect(() => {
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
  }, [selectedEmployee, apiUrl]);

  // const getDayStyle = (params) =>
  //   params.value && (params.value.getDay() === 0 || params.value.getDay() === 6)
  //     ? { color: "red" }
  //     : {};
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

  const onCellValueChanged = (params) => {
    const { data, colDef, newValue } = params;
    const { field } = colDef;
    if (field === "regularHours" || field === "overtimeHours") {
      const changedRecord = {
        employeeId: selectedEmployee,
        month: selectedMonth,
        year: selectedYear,
        date: data.date,
        [field]: newValue,
      };
      const isRecordChanged = changedRecords.some(
        (record) =>
          record.employeeId === selectedEmployee && record.date === data.date
      );
      setChangedRecords((prevRecords) =>
        isRecordChanged
          ? prevRecords.map((record) =>
              record.employeeId === selectedEmployee &&
              record.date === data.date
                ? changedRecord
                : record
            )
          : [...prevRecords, changedRecord]
      );
    }

    console.log("Changed record : " + changedRecords);
  };

  const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      { headerName: "Date", field: "date", width: 150, cellStyle: getDayStyle },
      { headerName: "Day", field: "day", width: 80 },
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
    ],
    defaultColDef: {
      editable: true,
      resizable: true,
    },
    onCellValueChanged: onCellValueChanged,
  });

  useEffect(() => {
    if (selectedEmployee && selectedMonth && selectedYear && selectedProject) {
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0);
      const datesInMonth = getDatesInMonth(selectedMonth, selectedYear);
  
      const requestBody = {
        month: parseInt(selectedMonth, 10),
        year: selectedYear,
        employeeId: selectedEmployee,
        projectId: selectedProject.projectId,
      };
      console.log(requestBody);
  
      post("/timesheets/getAllTimeSheets", requestBody)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data && Array.isArray(data)) {
          setTimeSheets(data);
        } else {
          console.error("API response does not contain an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching time sheets:", error);
      });
    }
  }, [selectedEmployee, selectedMonth, selectedYear, selectedProject]);
  

  const handleSubmit = () => {
    // Implement the logic to submit the changed data
    // For example, you can make an API call to update the backend with the changes

    // For demonstration purposes, logging the changed records
    console.log("Changed Records to Submit:", changedRecords);

    // Reset the changedRecords state after submission
    setChangedRecords([]);
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

  const startYear = 1990;
  const endYear = 2099;
  const yearOptions = [];

  for (let year = startYear; year <= endYear; year++) {
    yearOptions.push(year);
  }

  return (
    <div
      className="timesheets-container"
      style={{ marginLeft: "200px", maxWidth: "800px", width: "100%" }}
    >
      <div className="input-group">
        <div className="input-item">
          <label>Select Employee:</label>
          <select
            className="form-control"
            name="selectedEmployee"
            value={selectedEmployee.employeeID}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Select --</option>
            {Array.isArray(employees) &&
              employees.map((employee) => (
                <option
                  key={employee.employeeID}
                  value={employee.employeeID}
                >
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
          </select>
        </div>
        <div className="input-item">
          <label>Select Project:</label>
          <select
            className="form-control"
            name="selectedProject"
            value={selectedProject ? selectedProject.projectId : ""}
            onChange={(e) =>
              setSelectedProject(
                projects.find((project) => project.projectId === e.target.value)
              )
            }
          >
            <option value="">-- Select --</option>
            {Array.isArray(projects) &&
              projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.subVendorOne}/{project.subVendorTwo}
                </option>
              ))}
          </select>
        </div>
        <div className="input-item">
          <label>Select Month:</label>
          <Select
            style={{ width: "150px" }}
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
          <label>Select Year:</label>
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
        <AgGridReact
          gridOptions={gridOptions}
          rowData={timeSheets}
        ></AgGridReact>
      </div>
      <button
        onClick={handleSubmit}
        disabled={changedRecords.length === 0}
        type="submit"
        className="btn btn-outline-primary"
      >
        Submit
      </button>
    </div>
  );
}
