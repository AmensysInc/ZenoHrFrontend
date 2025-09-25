import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditor from "react-froala-wysiwyg";
import {
  createTracking,
  fetchEmployeeDetails,
  fetchProjectNames,
  fetchTrackingDetails,
  updateTracking,
} from "../SharedComponents/services/WithHoldService";

export default function WithHoldTrackingForm({ mode }) {
  let navigate = useNavigate();
  let { trackingId, employeeId } = useParams();

  const [editorHtml, setEditorHtml] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
  });

  const [tracking, setTracking] = useState({
    firstName: "",
    lastName: "",
    month: "",
    year: "",
    projectName: "",
    actualHours: "",
    actualRate: "",
    actualAmt: "",
    paidHours: "",
    paidRate: "",
    paidAmt: "",
    balance: "",
    excelData: "",
    type: "",
    status: "",
    billRate: "",
  });

  const {
    month,
    year,
    projectName,
    actualHours,
    actualRate,
    paidHours,
    paidRate,
    excelData,
    type,
    status,
    billRate,
  } = tracking;

  const typeOptions = ["revenue", "payment", "expense", "tax", "deuctions"];
  const statusOptions = ["pending", "received", "paid"];
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");

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

  // calculate amounts when hours/rates change
  useEffect(() => {
    const actualAmtValue =
      (tracking.actualHours || 0) * (tracking.actualRate || 0);
    const paidAmtValue = (tracking.paidHours || 0) * (tracking.paidRate || 0);
    const balanceValue = actualAmtValue - paidAmtValue;

    setTracking((prevTracking) => ({
      ...prevTracking,
      actualAmt: actualAmtValue,
      paidAmt: paidAmtValue,
      balance: balanceValue,
    }));
  }, [
    tracking.actualHours,
    tracking.actualRate,
    tracking.paidHours,
    tracking.paidRate,
  ]);

  // fetch employee + project + tracking details
  useEffect(() => {
    const fetchData = async () => {
      if (mode === "add" || (mode === "edit" && employeeId)) {
        try {
          const employeeResponse = await fetchEmployeeDetails(employeeId);
          if (employeeResponse) {
            setEmployeeDetails(employeeResponse);
          }

          const projectNamesResponse = await fetchProjectNames(employeeId);
          if (projectNamesResponse.length > 0) {
            const projectNamesList = projectNamesResponse.map((project) => {
              return `${project.subVendorOne || ""} / ${
                project.subVendorTwo || ""
              }`;
            });
            setProjectNames(projectNamesList);
          }

          if (mode === "edit") {
            const trackingResponse = await fetchTrackingDetails(trackingId);
            if (trackingResponse) {
              setTracking(trackingResponse);
              setSelectedProjectName(trackingResponse.projectName || "");
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [mode, employeeId, trackingId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const updatedTracking = {
      ...tracking,
      projectName: selectedProjectName,
    };

    try {
      const success =
        mode === "edit"
          ? await updateTracking(trackingId, updatedTracking)
          : await createTracking(employeeId, updatedTracking);

      if (success) {
        showModal();
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "adding"} project:`,
        error
      );
    }
  };

  const onProjectNameChange = (e) => {
    setSelectedProjectName(e.target.value);
  };

  const handleNavigate = (employeeId) => {
    navigate(`/tracking/${employeeId}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setTracking({
      ...tracking,
      [name]: value,
    });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const rows = pasteData.split("\n");
    const parsedData = rows.map((row) => row.split("\t"));
    setTableData(parsedData);
  };

  const handleEditorChange = (html) => {
    setEditorHtml(html);
    setTracking({ ...tracking, excelData: html });
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} Withhold Details
        </h2>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={employeeDetails.firstName || ""}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={employeeDetails.lastName || ""}
                disabled
              />
            </div>
          </div>

          {/* Month & Year */}
          <div className="form-group row">
            <div className="col">
              <label>Month:</label>
              <select
                className="form-control"
                name="month"
                value={tracking.month}
                onChange={onInputChange}
              >
                <option value="" disabled>
                  Select month
                </option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Year:</label>
              <select
                className="form-control"
                name="year"
                value={tracking.year}
                onChange={onInputChange}
              >
                <option value="" disabled>
                  Select year
                </option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Name & Status */}
          <div className="form-group row">
            <div className="col">
              <label htmlFor="projectName">Project Name:</label>
              <select
                className="form-control"
                name="projectName"
                value={selectedProjectName}
                onChange={onProjectNameChange}
              >
                <option value="" disabled>
                  Select project name
                </option>
                {projectNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Type:</label>
              <select
                className="form-control"
                name="type"
                value={type}
                onChange={onInputChange}
              >
                <option value="" disabled>
                  Select type
                </option>
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Actual Hours & Actual Rate */}
          <div className="form-group row">
            <div className="col">
              <label>Actual Hours:</label>
              <input
                type="number"
                className="form-control"
                name="actualHours"
                value={actualHours}
                onChange={onInputChange}
              />
            </div>
            <div className="col">
              <label>Actual Rate:</label>
              <input
                type="number"
                className="form-control"
                name="actualRate"
                value={actualRate}
                onChange={onInputChange}
              />
            </div>
          </div>

          {/* Paid Hours & Paid Rate */}
          <div className="form-group row">
            <div className="col">
              <label>Paid Hours:</label>
              <input
                type="number"
                className="form-control"
                name="paidHours"
                value={paidHours}
                onChange={onInputChange}
              />
            </div>
            <div className="col">
              <label>Paid Rate:</label>
              <input
                type="number"
                className="form-control"
                name="paidRate"
                value={paidRate}
                onChange={onInputChange}
              />
            </div>
          </div>

          {/* Actual Amount, Paid Amount, Balance */}
          <div className="form-group row">
            <div className="col">
              <label>Actual Amount:</label>
              <input
                type="number"
                className="form-control"
                name="actualAmt"
                value={tracking.actualAmt}
                readOnly
              />
            </div>
            <div className="col">
              <label>Paid Amount:</label>
              <input
                type="number"
                className="form-control"
                name="paidAmt"
                value={tracking.paidAmt}
                readOnly
              />
            </div>
            <div className="col">
              <label>Balance:</label>
              <input
                type="number"
                className="form-control"
                name="balance"
                value={tracking.balance}
                readOnly
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col">
              <label>Status:</label>
              <select
                className="form-control"
                name="status"
                value={status}
                onChange={onInputChange}
              >
                <option value="" disabled>
                  Select status
                </option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Bill Rate:</label>
              <input
                type="number"
                className="form-control"
                name="billRate"
                value={billRate}
                onChange={onInputChange}
              />
            </div>
          </div>
          <div
            className="mt-3 d-flex justify-content-end align-items-center"
            style={{ gap: 12 }}
          >
            <button
              type="submit"
              className="btn btn-outline-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 40,
                padding: "0 16px",
              }}
            >
              {isEditMode ? "Update" : "Submit"}
            </button>

            {/* Cancel is a real button, not a Link */}
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => handleNavigate(employeeId)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 40,
                padding: "0 16px",
              }}
            >
              Cancel
            </button>
          </div>

          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>WithHold {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}