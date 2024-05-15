import React, { useEffect, useState } from "react";
import { get, post } from "../SharedComponents/httpClient ";
import Pagination from "../SharedComponents/Pagination";

const AllTimeSheets = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [timeSheets, setTimeSheets] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedRegularHours, setEditedRegularHours] = useState({});
  const [editedprojectId, setEditedprojectId] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await get(
          `/employees?page=${currentPage}&size=${pageSize}`
        );
        if (!response.data.content) {
          console.error("Response data content is missing");
          return;
        }
        const employeesWithProjects = await Promise.all(
          response.data.content.map(async (employee) => {
            const projectResponse = await get(
              `/employees/${employee.employeeID}/projects`
            );
            return { ...employee, projects: projectResponse.data.content };
          })
        );
        setEmployees(employeesWithProjects);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [currentPage, pageSize]);

  const fetchTimeSheets = async () => {
    try {
      const response = await post("/timeSheets/getAllTimeSheetsByMonthYear", {
        month: selectedMonth,
        year: selectedYear,
      });
      const sheetIds = response.data.map((timeSheet) => timeSheet.sheetId);
      setTimeSheets(response.data);
      console.log("Response from server:", response);
    } catch (error) {
      console.error("Error fetching time sheets:", error);
    }
  };

  useEffect(() => {
    if (selectedMonth !== null && selectedYear !== null) {
      fetchTimeSheets();
    }
  }, [selectedMonth, selectedYear]);

  const findRegularHours = (empId, projectId, date) => {
    const timeSheet = timeSheets.find(
      (sheet) =>
        sheet.empId === empId &&
        sheet.projectId === projectId &&
        new Date(sheet.date).getDate() === date
    );
    return timeSheet ? timeSheet.regularHours : 0;
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const renderDates = () => {
    if (selectedMonth === null || selectedYear === null) return [];
    const numDays = daysInMonth(selectedMonth, selectedYear);
    const dates = [];
    for (let i = 1; i <= numDays; i++) {
      dates.push(
        `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-${i
          .toString()
          .padStart(2, "0")}`
      );
    }
    return dates;
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const toggleEditMode = (empId, projectId) => {
    setEditingRow(empId);
    setEditedprojectId(projectId);
    setEditedRegularHours({});
    const editedRegularHoursObj = {};
    renderDates().forEach((date) => {
      const regularHours = findRegularHours(
        empId,
        projectId,
        new Date(date).getDate()
      );
      if (regularHours !== undefined) {
        editedRegularHoursObj[
          `${empId}-${projectId}-${new Date(date).getDate()}`
        ] = regularHours;
      }
    });
    setEditedRegularHours(editedRegularHoursObj);
  };

  const handleEditChange = (e, empId, projectId, date) => {
    const value = e.target.value;
    setEditedRegularHours({
      ...editedRegularHours,
      [`${empId}-${projectId}-${date}`]: value,
    });
  };

  const handleSave = async () => {
    try {
      const updatedTimeSheets = [];
      employees.forEach((employee) => {
        employee.projects.forEach((project) => {
          renderDates().forEach((date) => {
            const editedValue =
              editedRegularHours[
                `${employee.employeeID}-${project.projectId}-${new Date(
                  date
                ).getDate()}`
              ];
            if (editedValue !== undefined) {
              updatedTimeSheets.push({
                empId: employee.employeeID,
                projectId: project.projectId,
                date: new Date(
                  selectedYear,
                  selectedMonth - 1,
                  new Date(date).getDate()
                ).toISOString(),
                regularHours: parseFloat(editedValue),
                sheetId: getTimeSheetId(
                  employee.employeeID,
                  project.projectId,
                  new Date(date).getDate()
                ),
              });
            }
          });
        });
      });
      await updateTimesheet(updatedTimeSheets);
      // Update the timeSheets state with the edited data
      setTimeSheets((prevTimeSheets) => {
        return prevTimeSheets.map((sheet) => {
          const editedSheet = updatedTimeSheets.find(
            (updatedSheet) => updatedSheet.sheetId === sheet.sheetId
          );
          console.log(editedSheet)
          if (editedSheet) {
            return { ...sheet, regularHours: editedSheet.regularHours };
          }
          return sheet;
        });
      });
      setEditingRow(null);
    } catch (error) {
      console.error("Error saving edited value:", error);
    }
  };

  const getTimeSheetId = (empId, projectId, date) => {
    const timeSheet = timeSheets.find(
      (sheet) =>
        sheet.empId === empId &&
        sheet.projectId === projectId &&
        new Date(sheet.date).getDate() === date
    );
    return timeSheet ? timeSheet.sheetId : null;
  };

  const updateTimesheet = async (updatedTimeSheets) => {
    try {
      const requestBody = updatedTimeSheets.map((updatedTimeSheet) => ({
        month: selectedMonth,
        year: selectedYear,
        employeeId: updatedTimeSheet.empId,
        projectId: updatedTimeSheet.projectId,
        sheetId: updatedTimeSheet.sheetId,
        regularHours: updatedTimeSheet.regularHours,
        date: updatedTimeSheet.date,
      }));
      console.log(requestBody);
      const response = await post("/timeSheets/createSheet", requestBody);
      console.log(response.data);
    } catch (error) {
      console.error("Error updating timesheets:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Employee Grid</h2>
      <div>
        <label htmlFor="month">Month:</label>
        <select id="month" value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2020, i, 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
        <label htmlFor="year">Year:</label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="">Select Year</option>
          {Array.from({ length: 9 }, (_, i) => (
            <option key={2020 + i} value={2020 + i}>
              {2020 + i}
            </option>
          ))}
        </select>
      </div>
      {selectedMonth !== null && selectedYear !== null && (
        <table className="table">
          <thead>
            <tr>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Projects</th>
              {renderDates().map((date, index) => (
                <th key={index}>{date}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <React.Fragment key={employee.id}>
                {employee.projects.length > 0 ? (
                  employee.projects.map((project, index) => (
                    <tr key={`${employee.id}-${index}`}>
                      {index === 0 ? (
                        <>
                          <td rowSpan={employee.projects.length}>
                            {employee.firstName}
                          </td>
                          <td rowSpan={employee.projects.length}>
                            {employee.lastName}
                          </td>
                        </>
                      ) : null}
                      <td>{`${project.subVendorOne}/${project.subVendorTwo}`}</td>
                      {renderDates().map((date, index) => (
                        <td
                          key={index}
                          onDoubleClick={() =>
                            toggleEditMode(
                              employee.employeeID,
                              project.projectId
                            )
                          }
                        >
                          {editingRow === employee.employeeID &&
                          editedprojectId === project.projectId ? (
                            <input
                              type="text"
                              value={
                                editedRegularHours[
                                  `${employee.employeeID}-${
                                    project.projectId
                                  }-${new Date(date).getDate()}`
                                ]
                              }
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  employee.employeeID,
                                  project.projectId,
                                  new Date(date).getDate()
                                )
                              }
                            />
                          ) : (
                            findRegularHours(
                              employee.employeeID,
                              project.projectId,
                              new Date(date).getDate()
                            )
                          )}
                        </td>
                      ))}
                      <td>
                        {editingRow === employee.employeeID &&
                          editedprojectId === project.projectId && (
                            <button
                              onClick={() => handleSave(employee.employeeID)}
                            >
                              Save
                            </button>
                          )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={employee.id}>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>No projects</td>
                    {renderDates().map((date, index) => (
                      <td key={index}>
                        {findRegularHours(
                          employee.employeeID,
                          null,
                          new Date(date).getDate()
                        )}
                      </td>
                    ))}
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AllTimeSheets;
