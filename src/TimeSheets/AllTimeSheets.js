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
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await get(`/companies?page=0&size=100`);
        if (response.data && response.data.content) {
          setCompanies(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = (e) => {
    setSelectedCompanyId(e.target.value);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
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
            let filteredProjects = projectResponse.data.content;

            // Show only active projects unless checkbox is checked
            if (!showAllProjects) {
              filteredProjects = filteredProjects.filter(
                (project) => project.projectStatus === "Active"
              );
            }

            const projectsWithEndDate = filteredProjects.map((project) => {
              const projectEndDate = new Date(project.projectEndDate);
              return { ...project, projectEndDate };
            });

            return { ...employee, projects: projectsWithEndDate };
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
  }, [currentPage, pageSize, showAllProjects]);

  const fetchTimeSheets = async () => {
    try {
      const response = await post("/timeSheets/getAllTimeSheetsByMonthYear", {
        month: selectedMonth,
        year: selectedYear,
      });
      setTimeSheets(response.data);
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
      const date = new Date(selectedYear, selectedMonth - 1, i);
      dates.push({
        date: date.toLocaleDateString("en-US"),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
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
    renderDates().forEach((dateObj) => {
      const date = new Date(dateObj.date);
      const regularHours = findRegularHours(empId, projectId, date.getDate());
      if (regularHours !== undefined) {
        editedRegularHoursObj[`${empId}-${projectId}-${date.getDate()}`] =
          regularHours;
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
          renderDates().forEach((dateObj) => {
            const date = new Date(dateObj.date);
            const editedValue =
              editedRegularHours[
                `${employee.employeeID}-${project.projectId}-${date.getDate()}`
              ];
            if (editedValue !== undefined) {
              const originalValue = findRegularHours(
                employee.employeeID,
                project.projectId,
                date.getDate()
              );
              if (parseFloat(editedValue) !== originalValue) {
                updatedTimeSheets.push({
                  empId: employee.employeeID,
                  projectId: project.projectId,
                  date: date.toISOString(),
                  regularHours: parseFloat(editedValue),
                  sheetId: getTimeSheetId(
                    employee.employeeID,
                    project.projectId,
                    date.getDate()
                  ),
                });
              }
            }
          });
        });
      });
      if (updatedTimeSheets.length > 0) {
        await updateTimesheet(updatedTimeSheets);
      }
      await fetchTimeSheets();
      setEditingRow(null);
    } catch (error) {
      console.error("Error saving edited value:", error);
    }
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
      await post("/timeSheets/createSheet", requestBody);
    } catch (error) {
      console.error("Error updating timesheets:", error);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Employee Grid</h2>
      <div>
        <label htmlFor="month">Month:</label>
        <select id="month" value={selectedMonth || ""} onChange={handleMonthChange}>
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
        <select id="year" value={selectedYear || ""} onChange={handleYearChange}>
          <option value="">Select Year</option>
          {(() => {
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let year = currentYear - 5; year <= currentYear + 5; year++) {
              years.push(
                <option key={year} value={year}>
                  {year}
                </option>
              );
            }
            return years;
          })()}
        </select>
        <label htmlFor="company">Company:</label>
        <select
          id="company"
          value={selectedCompanyId}
          onChange={handleCompanyChange}
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company.companyID} value={company.companyID}>
              {company.companyName}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={showAllProjects}
            onChange={() => setShowAllProjects(!showAllProjects)}
          />
          Show All Projects
        </label>
      </div>
      {selectedMonth !== null && selectedYear !== null && (
        <table className="table">
          <thead>
            <tr>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Company</th>
              <th>Projects</th>
              {renderDates().map((dateObj, index) => (
                <th
                  key={index}
                  style={{ color: dateObj.isWeekend ? "red" : "black" }}
                >
                  {dateObj.date}
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter(
                (emp) =>
                  !selectedCompanyId ||
                  emp.company.toLowerCase().includes(selectedCompanyId.toLowerCase())
              )
              .map((employee) => (
                <React.Fragment key={employee.id}>
                  {employee.projects.length > 0 ? (
                    employee.projects.map((project, index) => (
                      <tr key={`${employee.id}-${index}`}>
                        {index === 0 && (
                          <>
                            <td rowSpan={employee.projects.length}>
                              {employee.firstName}
                            </td>
                            <td rowSpan={employee.projects.length}>
                              {employee.lastName}
                            </td>
                            <td rowSpan={employee.projects.length}>
                              {employee.company}
                            </td>
                          </>
                        )}
                        <td
                          style={{
                            color:
                              project.projectEndDate < new Date()
                                ? "red"
                                : "black",
                          }}
                        >
                          {`${project.subVendorOne}/${project.subVendorTwo}`}
                        </td>
                        {renderDates().map((dateObj, idx) => (
                          <td
                            key={idx}
                            onDoubleClick={() =>
                              toggleEditMode(employee.employeeID, project.projectId)
                            }
                            style={{
                              color: dateObj.isWeekend ? "red" : "black",
                            }}
                          >
                            {editingRow === employee.employeeID &&
                            editedprojectId === project.projectId ? (
                              <input
                                type="text"
                                value={
                                  editedRegularHours[
                                    `${employee.employeeID}-${project.projectId}-${new Date(dateObj.date).getDate()}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleEditChange(
                                    e,
                                    employee.employeeID,
                                    project.projectId,
                                    new Date(dateObj.date).getDate()
                                  )
                                }
                              />
                            ) : (
                              findRegularHours(
                                employee.employeeID,
                                project.projectId,
                                new Date(dateObj.date).getDate()
                              )
                            )}
                          </td>
                        ))}
                        <td>
                          {editingRow === employee.employeeID &&
                            editedprojectId === project.projectId && (
                              <button onClick={handleSave}>Save</button>
                            )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={employee.id}>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.company}</td>
                      <td colSpan={renderDates().length + 1}>No Projects</td>
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
