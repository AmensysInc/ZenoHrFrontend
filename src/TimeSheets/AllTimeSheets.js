import React, { useEffect, useState } from "react";
import { get, post } from "../SharedComponents/httpClient ";
import Pagination from "../SharedComponents/Pagination";
import { FaDownload } from "react-icons/fa";

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
  const [documents, setDocuments] = useState({});
  const [visibleDocRow, setVisibleDocRow] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8082";

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
          })
        );

        setEmployees(employeesWithProjects);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
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

  const getTimeSheetId = (empId, projectId, date) => {
    const timeSheet = timeSheets.find(
      (sheet) =>
        sheet.empId === empId &&
        sheet.projectId === projectId &&
        new Date(sheet.date).getDate() === date
    );
    return timeSheet ? timeSheet.sheetId : null;
  };

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const renderDates = () => {
    if (selectedMonth === null || selectedYear === null) return [];
    const numDays = daysInMonth(selectedMonth, selectedYear);
    return Array.from({ length: numDays }, (_, i) => {
      const date = new Date(selectedYear, selectedMonth - 1, i + 1);
      return {
        date: date.toLocaleDateString("en-US"),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      };
    });
  };

  const toggleEditMode = (empId, projectId) => {
    setEditingRow(empId);
    setEditedprojectId(projectId);
    const edited = {};
    renderDates().forEach((dateObj) => {
      const date = new Date(dateObj.date);
      const regHours = findRegularHours(empId, projectId, date.getDate());
      edited[`${empId}-${projectId}-${date.getDate()}`] = regHours;
    });
    setEditedRegularHours(edited);
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
            const key = `${employee.employeeID}-${
              project.projectId
            }-${date.getDate()}`;
            const editedValue = editedRegularHours[key];
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
        await post("/timeSheets/createSheet", updatedTimeSheets);
      }
      await fetchTimeSheets();
      setEditingRow(null);
    } catch (error) {
      console.error("Error saving timesheets:", error);
    }
  };

  const handleDownloadFile = async (
    employeeID,
    projectID,
    year,
    month,
    filename
  ) => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${apiUrl}/timeSheets/downloadFile/${employeeID}/${projectID}/${year}/${month}/${filename}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // <-- Add token here
          },
        }
      );

      if (!response.ok) throw new Error("File download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1); // Month is 0-based
    return date.toLocaleString("default", { month: "long" });
  };

  const handleFetchDocuments = async (employeeID, projectID) => {
    const key = `${employeeID}-${projectID}`;
    setVisibleDocRow((prev) => (prev === key ? null : key));

    if (visibleDocRow === key) return;

    try {
      const response = await get(
        `${apiUrl}/timeSheets/getUploadedFiles/${employeeID}/${projectID}/${selectedYear}/${getMonthName(
          selectedMonth
        )}`
      );
      setDocuments((prev) => ({
        ...prev,
        [key]: response.data || [],
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Employee Grid</h2>
      <div>
        <label htmlFor="month">Month:</label>
        <select
          id="month"
          value={selectedMonth || ""}
          onChange={(e) => setSelectedMonth(+e.target.value)}
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

        <label htmlFor="year">Year:</label>
        <select
          id="year"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(+e.target.value)}
        >
          <option value="">Select Year</option>
          {Array.from({ length: 11 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <label htmlFor="company">Company:</label>
        <select
          id="company"
          value={selectedCompanyId}
          onChange={handleCompanyChange}
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company.companyId} value={company.companyId}>
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
              {renderDates().map((dateObj, idx) => (
                <th
                  key={idx}
                  style={{ color: dateObj.isWeekend ? "red" : "black" }}
                >
                  {dateObj.date}
                </th>
              ))}
              <th>Documents</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter(
                (emp) =>
                  !selectedCompanyId ||
                  emp.company?.companyId?.toString() === selectedCompanyId
              )
              .map((employee) => (
                <React.Fragment key={employee.employeeID}>
                  {employee.projects.length > 0 ? (
                    employee.projects.map((project, index) => {
                      const rowKey = `${employee.employeeID}-${project.projectId}`;
                      return (
                        <React.Fragment key={rowKey}>
                          <tr>
                            {index === 0 && (
                              <>
                                <td rowSpan={employee.projects.length}>
                                  {visibleDocRow === rowKey ? (
                                    <strong>{employee.firstName}</strong>
                                  ) : (
                                    employee.firstName
                                  )}
                                </td>
                                <td rowSpan={employee.projects.length}>
                                  {visibleDocRow === rowKey ? (
                                    <strong>{employee.lastName}</strong>
                                  ) : (
                                    employee.lastName
                                  )}
                                </td>
                                <td rowSpan={employee.projects.length}>
                                  {employee.company?.companyName || "N/A"}
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
                            {renderDates().map((dateObj, i) => {
                              const date = new Date(dateObj.date);
                              const key = `${employee.employeeID}-${
                                project.projectId
                              }-${date.getDate()}`;
                              return (
                                <td
                                  key={i}
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
                                      value={editedRegularHours[key] || ""}
                                      onChange={(e) =>
                                        handleEditChange(
                                          e,
                                          employee.employeeID,
                                          project.projectId,
                                          date.getDate()
                                        )
                                      }
                                    />
                                  ) : (
                                    findRegularHours(
                                      employee.employeeID,
                                      project.projectId,
                                      date.getDate()
                                    )
                                  )}
                                </td>
                              );
                            })}
                            <td>
                              <button
                                onClick={() =>
                                  handleFetchDocuments(
                                    employee.employeeID,
                                    project.projectId
                                  )
                                }
                              >
                                {visibleDocRow === rowKey ? "Hide" : "View"}{" "}
                                Docs
                              </button>
                            </td>
                            <td>
                              {editingRow === employee.employeeID &&
                                editedprojectId === project.projectId && (
                                  <button onClick={handleSave}>Save</button>
                                )}
                            </td>
                          </tr>
                          {visibleDocRow === rowKey && (
                            <tr>
                              <td colSpan={5 + renderDates().length + 2}>
                                <strong>Documents:</strong>
                                {documents[rowKey]?.length > 0 ? (
                                  <ul>
                                    {documents[rowKey].map((doc, idx) => (
                                      <li key={idx}>
                                        <a
                                          href={doc.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ marginRight: "8px" }}
                                        >
                                          {doc.fileName}
                                        </a>
                                        <button
                                          onClick={() =>
                                            handleDownloadFile(
                                              employee.employeeID,
                                              project.projectId,
                                              selectedYear,
                                              getMonthName(selectedMonth),
                                              doc.fileName
                                            )
                                          }
                                          style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#007bff",
                                          }}
                                          title="Download"
                                        >
                                          <FaDownload />
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No documents uploaded.</p>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.company?.companyName || "N/A"}</td>
                      <td colSpan={renderDates().length + 3}>No Projects</td>
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
