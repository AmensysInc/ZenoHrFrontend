import React, { useState } from "react";
import { DatePicker } from "antd";
import { Modal } from "antd";
import dayjs from "dayjs";

export default function ProjectHistoryForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit,
  employeeDetails,
}) {
  const [project, setProject] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    firstName,
    lastName,
    subVendorOne,
    subVendorTwo,
    projectAddress,
    projectStartDate,
    projectEndDate,
    projectStatus,
  } = project;

  const onInputChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const onInputChangeDate = (date, name) => {
    setProject({ ...project, [name]: date });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    onSubmit(project);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel();
  };

  return (
    <div className="form-container">
      <h2 className="text-center m-4">
        {isEdit ? "Edit Project History" : "Add Project"}
      </h2>
      <form onSubmit={(e) => onSubmit(project)}>
        <div className="form-row">
          <div className="form-group col-md-6">
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
          <div className="form-group col-md-6">
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
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
          <label htmlFor="projectStartDate">Project Start Date</label>
          {isEdit ? (
            <DatePicker
              type="text"
              name="projectStartDate"
              className="form-control"
              value={dayjs(projectStartDate)}
              onChange={(date) =>
                onInputChangeDate(date, "projectStartDate")
              }
              required
            />
          ) : (
            <DatePicker
              className="form-control"
              name="projectStartDate"
              value={projectStartDate}
              onChange={(date) =>
                onInputChange({ target: { name: "projectStartDate", value: date } })
              }
              required
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="projectEndDate">Project End Date</label>
          {isEdit ? (
            <DatePicker
              type="text"
              name="projectEndDate"
              className="form-control"
              value={dayjs(projectEndDate)}
              onChange={(date) =>
                onInputChangeDate(date, "projectEndDate")
              }
              required
            />
          ) : (
            <DatePicker
              className="form-control"
              name="projectEndDate"
              value={projectEndDate}
              onChange={(date) =>
                onInputChange({ target: { name: "projectEndDate", value: date } })
              }
              required
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="projectStatus">Project Status</label>
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
          {isEdit ? "Update" : "Submit"}
        </button>
        <button
          type="button"
          className="btn btn-outline-danger mx-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>
            {isEdit
              ? "Project History Updated successfully"
              : "Project History added successfully"}
          </p>
        </Modal>
      </form>
    </div>
  );
}
