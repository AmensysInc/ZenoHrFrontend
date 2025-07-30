import React, { useEffect, useState } from "react";
import { get, post } from "../SharedComponents/httpClient ";
import Pagination from "../SharedComponents/Pagination";
import { FaCheck, FaTimes } from "react-icons/fa";
import { TbNotes } from "react-icons/tb";

const AllTimeSheets = () => {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]); // Store all employees
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
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteEmployeeId, setNoteEmployeeId] = useState(null);
  const [noteProjectId, setNoteProjectId] = useState(null);

  const fetchUploadedFiles = async (employeeId, projectId) => {
    try {
      const token = sessionStorage.getItem("token");
      const monthName = new Date(
        selectedYear,
        selectedMonth - 1,
        1
      ).toLocaleString("default", {
        month: "long",
      });

      const response = await get(
        `/timeSheets/getUploadedFiles/${employeeId}/${projectId}/${selectedYear}/${monthName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploadedDocs(response.data);
      console.log(response);
      setShowDocsModal(true);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      alert("Failed to fetch uploaded documents.");
    }
  };

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await get(`/companies?page=0&size=100`);
        if (response.data && response.data.content) {
          setCompanies(response.data.content);
          console.log("Companies fetched:", response.data.content);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Handle company selection
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    console.log("Selected company ID:", companyId);
    setSelectedCompanyId(companyId);
    setCurrentPage(0); // Reset to first page when company changes
  };

  // Fetch all employees (without company filter initially)
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        // Fetch all employees first
        const response = await get(`/employees?page=0&size=1000`); // Get all employees

        if (!response.data.content) {
          console.error("Response data content is missing");
          setLoading(false);
          return;
        }

        console.log("All employees fetched:", response.data.content);

        const employeesWithProjects = await Promise.all(
          response.data.content.map(async (employee) => {
            try {
              const projectResponse = await get(
                `/employees/${employee.employeeID}/projects`
              );

              let filteredProjects = projectResponse.data.content || [];

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
            } catch (error) {
              console.error(
                `Error fetching projects for employee ${employee.employeeID}:`,
                error
              );
              return { ...employee, projects: [] };
            }
          })
        );

        setAllEmployees(employeesWithProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchAllEmployees();
  }, [showAllProjects]);

  // Filter employees based on selected company
  useEffect(() => {
    let filteredEmployees = allEmployees;

    if (selectedCompanyId) {
      // Debug: Log employee data structure
      console.log("All employees data:", allEmployees);
      console.log("Looking for company ID:", selectedCompanyId);

      filteredEmployees = allEmployees.filter((employee) => {
        // Debug: Log each employee's company data
        console.log("Employee company data:", {
          employee: employee.firstName + " " + employee.lastName,
          company: employee.company,
          companyId: employee.company?.companyId,
          companyID: employee.company?.companyID,
          companyName: employee.company?.companyName,
        });

        // Check multiple possible company ID fields and formats
        const employeeCompanyId =
          employee.company?.companyId ||
          employee.company?.companyID ||
          employee.companyId ||
          employee.companyID;

        // Match by ID (number or string)
        return (
          employeeCompanyId &&
          employeeCompanyId.toString() === selectedCompanyId.toString()
        );
      });

      console.log(
        "Filtered employees for company:",
        selectedCompanyId,
        filteredEmployees
      );
    }

    // Apply pagination
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    setEmployees(paginatedEmployees);
    setTotalPages(Math.ceil(filteredEmployees.length / pageSize));
  }, [allEmployees, selectedCompanyId, currentPage, pageSize]);

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

  const handleApprove = (employee, project) => {
    const timeSheetData = timeSheets
      .filter(
        (sheet) =>
          sheet.empId === employee.employeeID &&
          sheet.projectId === project.projectId &&
          new Date(sheet.date).getMonth() + 1 === selectedMonth &&
          new Date(sheet.date).getFullYear() === selectedYear
      )
      .map((sheet) => ({
        month: selectedMonth,
        year: selectedYear,
        employeeId: employee.employeeID,
        projectId: project.projectId,
        sheetId: sheet.sheetId,
        regularHours: sheet.regularHours,
        overTimeHours: sheet.overTimeHours,
        date: new Date(sheet.date).toISOString(),
        status: "APPROVED",
      }));

    const updatedTimeSheets = timeSheets.map((t) =>
      timeSheetData.some((s) => s.sheetId === t.sheetId)
        ? { ...t, status: "APPROVED" }
        : t
    );

    setTimeSheets(updatedTimeSheets);

    post("/timeSheets/createTimeSheet", timeSheetData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error approving time sheets:", error);
      });
  };

  const handleReject = (employee, project) => {
    const timeSheetData = timeSheets
      .filter(
        (sheet) =>
          sheet.empId === employee.employeeID &&
          sheet.projectId === project.projectId &&
          new Date(sheet.date).getMonth() + 1 === selectedMonth &&
          new Date(sheet.date).getFullYear() === selectedYear
      )
      .map((sheet) => ({
        month: selectedMonth,
        year: selectedYear,
        employeeId: employee.employeeID,
        projectId: project.projectId,
        sheetId: sheet.sheetId,
        regularHours: sheet.regularHours,
        overTimeHours: sheet.overTimeHours,
        date: new Date(sheet.date).toISOString(),
        status: "REJECTED",
      }));

    const updatedTimeSheets = timeSheets.map((t) =>
      timeSheetData.some((s) => s.sheetId === t.sheetId)
        ? { ...t, status: "REJECTED" }
        : t
    );

    setTimeSheets(updatedTimeSheets);

    post("/timeSheets/createTimeSheet", timeSheetData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error rejecting time sheets:", error);
      });
  };

const handleOpenNotes = async (employeeId, projectId) => {
  try {
    const requestBody = {
      month: selectedMonth,
      year: selectedYear,
      employeeId,
      projectId,
    };
    const response = await post("/timeSheets/getAllTimeSheets", requestBody);
    // Look for first time sheet with a non-empty note
    const note = response.data.find((sheet) => sheet.notes)?.notes;

    setNoteEmployeeId(employeeId);
    setNoteProjectId(projectId);
    setNoteText(note || "");
    setShowNotesModal(true);
  } catch (error) {
    console.error("Error fetching notes:", error);
    setNoteText("");
    setShowNotesModal(true);
  }
};

  const handleSaveNote = async () => {
    try {
      // Find matching timesheet (any date in selected month)
      const existingSheet = timeSheets.find(
        (sheet) =>
          sheet.empId === noteEmployeeId &&
          sheet.projectId === noteProjectId &&
          new Date(sheet.date).getMonth() + 1 === selectedMonth &&
          new Date(sheet.date).getFullYear() === selectedYear
      );

      const sheetId = existingSheet?.sheetId || null;

      const requestBody = [
        {
          month: selectedMonth,
          year: selectedYear,
          employeeId: noteEmployeeId,
          projectId: noteProjectId,
          sheetId: sheetId,
          date: new Date(selectedYear, selectedMonth - 1, 1),
          notes: noteText,
        },
      ];

      await post("/timeSheets/createTimeSheet", requestBody);
      alert("Note saved successfully!");
      setShowNotesModal(false);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    }
  };

  return (
    <div className="container">
      <h2>All Employee Time Sheets</h2>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="month" style={{ marginRight: "10px" }}>
          Month:
        </label>
        <select
          id="month"
          value={selectedMonth || ""}
          onChange={handleMonthChange}
          style={{ marginRight: "20px" }}
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2020, i, 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <label htmlFor="year" style={{ marginRight: "10px" }}>
          Year:
        </label>
        <select
          id="year"
          value={selectedYear || ""}
          onChange={handleYearChange}
          style={{ marginRight: "20px" }}
        >
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

        <label htmlFor="company" style={{ marginRight: "10px" }}>
          Company:
        </label>
        <select
          id="company"
          value={selectedCompanyId}
          onChange={handleCompanyChange}
          style={{ marginRight: "20px" }}
        >
          <option value="">All Companies</option>
          {companies.map((company) => {
            console.log("Company in dropdown:", company); // Debug log
            return (
              <option key={company.companyId} value={company.companyId}>
                {company.companyName}
              </option>
            );
          })}
        </select>

        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={showAllProjects}
            onChange={() => setShowAllProjects(!showAllProjects)}
            style={{ marginRight: "5px" }}
          />
          Show All Projects
        </label>
      </div>

      {selectedMonth !== null && selectedYear !== null && (
        <div style={{ overflowX: "auto" }}>
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
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <React.Fragment key={employee.employeeID}>
                    {employee.projects.length > 0 ? (
                      employee.projects.map((project, index) => (
                        <tr
                          key={`${employee.employeeID}-${project.projectId}-${index}`}
                        >
                          {index === 0 && (
                            <>
                              <td rowSpan={employee.projects.length}>
                                {employee.firstName}
                              </td>
                              <td rowSpan={employee.projects.length}>
                                {employee.lastName}
                              </td>
                              <td rowSpan={employee.projects.length}>
                                {employee.company?.companyName}
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
                                toggleEditMode(
                                  employee.employeeID,
                                  project.projectId
                                )
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
                                      `${employee.employeeID}-${
                                        project.projectId
                                      }-${new Date(dateObj.date).getDate()}`
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
                            editedprojectId === project.projectId ? (
                              <button onClick={handleSave}>Save</button>
                            ) : (
                              <>
                                <FaCheck
                                  size={20}
                                  title="Approve"
                                  onClick={() =>
                                    handleApprove(employee, project)
                                  }
                                  style={{
                                    color: "green",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                  }}
                                />
                                <FaTimes
                                  size={20}
                                  title="Reject"
                                  onClick={() =>
                                    handleReject(employee, project)
                                  }
                                  style={{
                                    color: "red",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                  }}
                                />
                                <TbNotes
                                  size={20}
                                  title="Notes"
                                  onClick={() =>
                                    handleOpenNotes(
                                      employee.employeeID,
                                      project.projectId
                                    )
                                  }
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    fetchUploadedFiles(
                                      employee.employeeID,
                                      project.projectId
                                    )
                                  }
                                  style={{
                                    padding: "2px 6px",
                                    fontSize: "12px",
                                  }}
                                >
                                  View Docs
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={employee.employeeID}>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                        <td>{employee.company?.companyName}</td>
                        <td colSpan={renderDates().length + 1}>No Projects</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={renderDates().length + 4}
                    style={{ textAlign: "center" }}
                  >
                    {selectedCompanyId
                      ? "No employees found for selected company"
                      : "No employees found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      {showNotesModal && (
        <>
          <div
            onClick={() => setShowNotesModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 999,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              zIndex: 1000,
              width: "400px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            <h5>Notes</h5>
            <textarea
              rows={5}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              style={{ width: "100%" }}
              placeholder="Add notes here..."
            />
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button onClick={handleSaveNote}>Save</button>
              <button onClick={() => setShowNotesModal(false)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllTimeSheets;