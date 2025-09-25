import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import {
  createProject,
  fetchEmployeeDetails,
  fetchProjectDetails,
  updateProject,
} from "../SharedComponents/services/ProjectHistoryService";

export default function ProjectHistoryForm({ mode }) {
  const navigate = useNavigate();
  const { projectId, employeeId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
  });

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
          if (employeeResponse) setEmployeeDetails(employeeResponse);

          if (mode === "edit" && projectId) {
            const response = await fetchProjectDetails(projectId);
            if (response) setProject(response);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [mode, employeeId, projectId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const success =
        mode === "edit"
          ? await updateProject(projectId, project)
          : await createProject(employeeId, project);

      if (success) setIsModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/editemployee/${employeeId}/project-history`);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleNavigate();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleNavigate();
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const onInputChangeDate = (date, name) => {
    setProject((prev) => ({
      ...prev,
      [name]: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">{isEditMode ? "Edit" : "Add"} Project</h2>

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

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="subVendorOne">Sub VendorOne</label>
              <input
                type="text"
                className="form-control"
                name="subVendorOne"
                value={subVendorOne}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="subVendorTwo">Sub VendorTwo</label>
              <input
                type="text"
                className="form-control"
                name="subVendorTwo"
                value={subVendorTwo}
                onChange={onInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="projectAddress">Project Address</label>
            <input
              type="text"
              className="form-control"
              name="projectAddress"
              value={projectAddress}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="projectStartDate">Project Start Date</label>
              {/* Use AntD size; avoid Bootstrap form-control on AntD */}
              <DatePicker
                className="w-100"
                value={projectStartDate ? dayjs(projectStartDate) : null}
                onChange={(d) => onInputChangeDate(d, "projectStartDate")}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="projectEndDate">Project End Date</label>
              <DatePicker
                className="w-100"
                value={projectEndDate ? dayjs(projectEndDate) : null}
                onChange={(d) => onInputChangeDate(d, "projectEndDate")}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div
            className="mt-3 d-flex justify-content-end align-items-center"
            style={{ gap: 12 }}
          >
            <button
              type="submit"
              className="btn btn-outline-primary"
              style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 16px" }}
            >
              {isEditMode ? "Update" : "Submit"}
            </button>

            {/* Cancel is a real button, not a Link */}
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleNavigate}
              style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 16px" }}
            >
              Cancel
            </button>
          </div>

          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Project {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}