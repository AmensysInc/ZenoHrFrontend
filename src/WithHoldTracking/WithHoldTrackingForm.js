import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditor from "react-froala-wysiwyg";

export default function WithHoldTrackingForm({ mode }) {
  const apiUrl = process.env.REACT_APP_API_URL;
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

  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const employeeResponse = await axios.get(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );

      const { firstName, lastName } = employeeResponse.data;
      setEmployeeDetails({ firstName, lastName });
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    const actualAmtValue = tracking.actualHours * tracking.actualRate;
    const paidAmtValue = tracking.paidHours * tracking.paidRate;
    const balanceValue = actualAmtValue - paidAmtValue;
    setTracking((prevTracking) => ({
      ...prevTracking,
      actualAmt: actualAmtValue,
      paidAmt: paidAmtValue,
      balance: balanceValue,
    }));
    if (mode === "add" || (mode === "edit" && employeeId)) {
      fetchEmployeeDetails();

      if (mode === "edit") {
        const token = localStorage.getItem("token");
        const requestOptions = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .get(`${apiUrl}/trackings/${trackingId}`, requestOptions)
          .then((historyResponse) => {
            setTracking(historyResponse.data);
          })
          .catch((error) => {
            console.error("Error while fetching data:", error);
          });
      }
    }
  }, [
    mode,
    employeeId,
    trackingId,
    tracking.actualHours,
    tracking.actualRate,
    tracking.paidHours,
    tracking.paidRate,
  ]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(tracking),
      };

      const response = await fetch(
        `${apiUrl}/employees${
          mode === "edit"
            ? `/trackings/${trackingId}`
            : `/${employeeId}/trackings`
        }`,
        requestOptions
      );

      if (response.status === 200 || response.status === 201) {
        showModal();
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "adding"} project:`,
        error
      );
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
    setTracking({ ...tracking, ["excelData"]: html });
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} Project
        </h2>
        <form onSubmit={(e) => onSubmit(e)}>
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
          <div className="form-group row">
            <div className="col">
              <label>Month:</label>
              <select
                className="form-control"
                name="month"
                value={tracking.month}
                onChange={(e) => onInputChange(e)}
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
                onChange={(e) => onInputChange(e)}
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
          <div className="form-group row">
            <div className="col">
              <label>Actual Hours:</label>
              <input
                type="text"
                className="form-control"
                name="actualHours"
                value={actualHours}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>
          <div className="col">
            <label>Actual Rate:</label>
            <input
              type="text"
              className="form-control"
              name="actualRate"
              value={actualRate}
              onChange={(e) => onInputChange(e)}
            />
            <div className="form-group row">
              <div className="col">
                <label>Paid Hours:</label>
                <input
                  type="text"
                  className="form-control"
                  name="paidHours"
                  value={paidHours}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="col">
                <label>Paid Rate:</label>
                <input
                  type="text"
                  className="form-control"
                  name="paidRate"
                  value={paidRate}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col">
                <label>Actual Amount:</label>
                <input
                  type="text"
                  className="form-control"
                  name="actualAmt"
                  value={tracking.actualAmt}
                  readOnly
                />
              </div>
              <div className="col">
                <label>Paid Amount:</label>
                <input
                  type="text"
                  className="form-control"
                  name="paidAmt"
                  value={tracking.paidAmt}
                  readOnly
                />
              </div>
              <div className="col">
                <label>Balance:</label>
                <input
                  type="text"
                  className="form-control"
                  name="balance"
                  value={tracking.balance}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label htmlFor="editorHtml">Excel Data :</label>
              <FroalaEditor
                model={tracking.excelData}
                name="editorHtml"
                onModelChange={handleEditorChange}
                onPaste={handlePaste}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-outline-primary">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>WithHold {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}
