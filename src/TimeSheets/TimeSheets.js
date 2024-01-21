import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getTimeSheetStatus } from "../SharedComponents/services/TimeSheetService";
import { get, post } from "../SharedComponents/httpClient ";
import _ from 'lodash';

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
  const [status, setStatus] = useState(["APPROVED","REJECTED","PENDING"]);

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
    getTimeSheetStatus().then( data =>{
      setStatus(data);
      console.log(data);
    })
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
                { ...item, date: new Date(item.date), day: getAbbreviatedDay(new Date(item.date)) },
              ])
            );

            // Fill in missing dates with regular, OT hours, and day
            const filledData = datesInMonth.map((date) => {
              const dataItem = dataMap.get(date.getTime());
              return dataItem ? { ...dataItem, __dirty: false } : { date, regularHours: 0, overTimeHours: 0, day: getAbbreviatedDay(date), __dirty: false, status: null };
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
        status: record.status
      }));
  
    // Submit the transformed data
    post('/timeSheets/createTimeSheet', transformedData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching time sheets:', error);
      });
  
    // Reset the dirty state of the records
    setTimeSheets((prevTimeSheets) =>
      prevTimeSheets.map((record) => ({ ...record, __dirty: false }))
    );
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
    columnDefs: [
      {headerName: "Date", field: "date", width: 150, cellStyle: getDayStyle },
      {headerName: "Day", field: "day", width: 80, cellStyle: getDayStyle },
      {headerName: "Regular Hours", field: "regularHours", width: 150, editable: true },
      {headerName: "Overtime Hours", field: "overTimeHours", width: 150, editable: true },
      {headerName: "Status", field: "status", width: 120, editable: false },
      {headerName: "Actions", field: "actions", width: 150,
        cellRendererFramework: (params) => (
          <div>
            <button onClick={() => handleApprove(params.data)}>Approve</button>
            <button onClick={() => handleReject(params.data)}>Reject</button>
          </div>
        ),
      }
    ],
    defaultColDef: {
      resizable: true,
    },
    onCellValueChanged: onCellValueChanged,
  });

  const handleCancel = () => {
    // Reset the dirty state of the records without submitting changes
    setTimeSheets(timeSheetsOriginal);
    console.log(timeSheets);
  };

  return (
    <div className="timesheets-container" style={{ marginLeft: "200px", maxWidth: "800px", width: "100%" }}>
      <div className="input-group">
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
        <div className="input-item">
          <label>Project</label>
          <Select
            style={{ width: "150px", marginRight: "8px" }}
            value={selectedProject ? selectedProject.projectId : ""}
            onChange={(value) => setSelectedProject(projects.find((project) => project.projectId === value))}
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
  
      <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
        <AgGridReact gridOptions={gridOptions} rowData={timeSheets}></AgGridReact>
      </div>
      <button
        onClick={handleSubmit}
        disabled={timeSheets.every((row) => !row.__dirty)}
        className={`btn ${timeSheets.every((row) => !row.__dirty) ? 'btn-outline-secondary' : 'btn-success'}`}
      >
        Submit
      </button>
      <button
          onClick={handleCancel}
          disabled={timeSheets.every((row) => !row.__dirty)}
          className={`btn ${timeSheets.every((row) => !row.__dirty) ? 'btn-outline-secondary' : 'btn-danger'}`}
        >
          Cancel
        </button>
    </div>
  );  
}
