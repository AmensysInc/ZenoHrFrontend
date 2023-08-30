import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditor from "react-froala-wysiwyg";
import { Modal } from "antd";

export default function AddWithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let { employeeId } = useParams();

  const [editorHtml, setEditorHtml] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({});
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
  });
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");

  const {
    month,
    year,
    projectName,
    actualHours,
    actualRate,
    paidHours,
    paidRate,
    excelData,
  } = tracking;

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

  useEffect(() => {
    loadEmployeeDetails();
    fetchProjectNames();
    const actualAmtValue = actualHours * actualRate;
    const paidAmtValue = paidHours * paidRate;
    const balanceValue = actualAmtValue - paidAmtValue;

    setTracking({
      ...tracking,
      actualAmt: actualAmtValue,
      paidAmt: paidAmtValue,
      balance: balanceValue,
    });
  }, [actualHours, actualRate, paidHours, paidRate]);

  const fetchProjectNames = async () => {
    try {
      const token = localStorage.getItem("token");
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const projectHistoryResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/projects`,
        requestOptions
      );
      const projectHistoryData = await projectHistoryResponse.json();

      const projects = projectHistoryData.content || [];

      const uniqueProjectNames = [
        ...new Set(
          projects.map(
            (project) =>
              `${project.subVendorOne || ""} / ${project.subVendorTwo || ""}`
          )
        ),
      ];
      setProjectNames(uniqueProjectNames);
    } catch (error) {
      console.error("Error loading project names:", error);
    }
  };

  const onProjectNameChange = (e) => {
    setSelectedProjectName(e.target.value);
  };

  const loadEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
      const data = await response.json();
      setEmployeeDetails(data);
    } catch (error) {
      console.error("Error loading employee details:", error);
    }
  };

  const onInputChange = (e) => {
    setTracking({ ...tracking, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedTracking = {
      ...tracking,
      projectName: selectedProjectName,
    };
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTracking),
      };
      console.log("Submitting data:", tracking);
      const response = await fetch(
        `${apiUrl}/employees/${employeeId}/trackings`,
        requestOptions
      );
      if (response.status === 200) {
        showModal();
      }
    } catch (error) {
      console.error("Error adding withholding tracking:", error);
    }
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const rows = pasteData.split("\n");
    const parsedData = rows.map((row) => row.split("\t"));
    setTableData(parsedData);
  };

  const handleEditorChange = (html) => {
    setEditorHtml(html);
    setTracking({ ...tracking, ["excelData"]: html });
  };

  return (
    <div className="form-container">
      <h2 className="text-center m-4">New WithHoldTracking</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={employeeDetails.firstName || ""}
                disabled
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
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
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="month">Month:</label>
              <select
                className="form-control"
                name="month"
                value={month}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="" disabled>
                  Select month
                </option>
                {monthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="year">Year:</label>
              <select
                className="form-control"
                name="year"
                value={year}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="" disabled>
                  Select year
                </option>
                {yearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
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
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualHours">Actual Hours:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Hours"
                name="actualHours"
                value={actualHours}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualRate">Actual Rate:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Rate"
                name="actualRate"
                value={actualRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidHours">Paid Hours:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Hours"
                name="paidHours"
                value={paidHours}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidRate">Paid Rate:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Rate"
                name="paidRate"
                value={paidRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="actualAmt">Actual Amount:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual Amount"
                name="actualAmt"
                value={tracking.actualAmt}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paidAmt">Paid Amount:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid Amount"
                name="paidAmt"
                value={tracking.paidAmt}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="balance">Balance:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Balance"
                name="balance"
                value={tracking.balance}
                readOnly
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="editorHtml">Excel Data :</label>
          <FroalaEditor
            name="editorHtml"
            model={editorHtml}
            onModelChange={handleEditorChange}
            onPaste={handlePaste}
          />
        </div>

        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger mx-2"
          onClick={() => handleNavigate(employeeId)}
        >
          Cancel
        </button>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>WithHold added succesfully</p>
        </Modal>
      </form>
    </div>
  );
}
