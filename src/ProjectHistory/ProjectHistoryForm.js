import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DatePicker,Modal } from "antd";
import dayjs from "dayjs";
import { createProject, fetchEmployeeDetails, fetchProjectDetails, updateProject } from "../SharedComponents/services/ProjectHistoryService";

export default function ProjectHistoryForm({ mode }) {
  let navigate = useNavigate();
  let { projectId, employeeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
  })
  const [project, setProject] = useState({
    subVendorOne: "",
    subVendorTwo: "",
    projectAddress: "",
    projectStartDate: "",
    projectEndDate: "",
    projectStatus: "",
  });

  const {
    subVendorOne,
    subVendorTwo,
    projectAddress,
    projectStartDate,
    projectEndDate,
    projectStatus,
  } = project;

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "add" || (mode === "edit" && employeeId)) {
        try {
          const employeeResponse = await fetchEmployeeDetails(employeeId);
          if (employeeResponse) {
            setEmployeeDetails(employeeResponse);
          }
          if (mode === "edit") {
            const response = await fetchProjectDetails(projectId);
            setProject(response);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    
    fetchData();
  }, [mode, employeeId, projectId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const success = mode === "edit"
        ? await updateProject(projectId, project)
        : await createProject(employeeId, project);
  
      if (success) {
        showModal();
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "adding"} project:`, error);
    }
  }
   
  const handleNavigate = (employeeId) => {
    navigate(`/editemployee/${employeeId}/project-history`);
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
    setProject({
      ...project,
      [name]: value,
    });
  };

  const onInputChangeDate = (date, name) => {
    if (date) {
      setProject({ ...project, [name]: date.format("YYYY-MM-DD") });
    }
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
          <div className="form-row">
            <div className="form-group col-md-6">
            <label htmlFor="subVendorOne">Sub VendorOne</label>
          <input
            type="text"
            className="form-control"
            placeholder="SubVendorOne"
            name="subVendorOne"
            value={subVendorOne}
            onChange={(e) => onInputChange(e)}
            required
          />
            </div>
            <div className="form-group col-md-6">
            <label htmlFor="subVendorTwo">Sub VendorTwo</label>
          <input
            type="text"
            className="form-control"
            placeholder="Sub VendorTwo"
            name="subVendorTwo"
            value={subVendorTwo}
            onChange={(e) => onInputChange(e)}
          />
            </div>
          </div>
          <div className="form-group">
          <label htmlFor="projectAddress">Project Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Project Address"
            name="projectAddress"
            value={projectAddress}
            onChange={(e) => onInputChange(e)}
            required
          />
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
            <label htmlFor="projectStartDate">Project Start Date</label>
          <DatePicker
            className="form-control"
            name="projectStartDate"
            value={projectStartDate ? dayjs(projectStartDate) : null}
            onChange={(date) => onInputChangeDate(date, "projectStartDate")}
            required
          />
            </div>
            <div className="form-group col-md-6">
            <label>Project End Date:</label>
              <DatePicker
                type="text"
                name="projectEndDate"
                className="form-control"
                value={projectEndDate ? dayjs(projectEndDate) : null}
                onChange={(date) => onInputChangeDate(date, "projectEndDate")}
                required
              />
            </div>
          </div>

          <div className="form-group">
          <label htmlFor="projectStatus">Project Status:</label>
            <select
              id="projectStatus"
              name="projectStatus"
              value={projectStatus}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option value="">-- Select --</option>
              <option value="Active">Active</option>
              <option value="Terminated">Terminated</option>
              <option value="Ended">Ended</option>
              <option value="OnHold">OnHold</option>
            </select>
          </div>
          <button type="submit" className="btn btn-outline-primary">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Project {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  )
}

