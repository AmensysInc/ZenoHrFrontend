import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import dayjs from "dayjs";
import FormInput from "../SharedComponents/FormInput";

export default function EditProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let { projectId, employeeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectHistory, setProjectHistory] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjectHistoryAndEmployee();
  }, []);

  const fetchProjectHistoryAndEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [historyResponse, employeeResponse] = await Promise.all([
        axios.get(`${apiUrl}/projects/${projectId}`, requestOptions),
        axios.get(`${apiUrl}/employees/${employeeId}`, requestOptions),
      ]);

      setProjectHistory(historyResponse.data);
      setEmployeeDetails(employeeResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${apiUrl}/employees/projects/${projectId}`,
        projectHistory,
        requestOptions
      );

      if (response.status === 200) {
        showModal();
      }
    } catch (error) {
      console.error("Error updating project history:", error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate(`/editemployee/${employeeId}/project-history`);
  };

  const onInputChange = (e) => {
    setProjectHistory({ ...projectHistory, [e.target.name]: e.target.value });
  };
  const onInputChangeDate = (date, name) => {
    if (date) {
      setProjectHistory({
        ...projectHistory,
        [name]: date.format("YYYY-MM-DD"),
      });
    }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const selectOptions = [
    { label: "-- Select --", value: "" },
    { label: "Active", value: "Active" },
    { label: "Terminated", value: "Terminated" },
    { label: "Ended", value: "Ended" },
    { label: "On Hold", value: "On Hold" },
  ];
  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Project History</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-row">
            <FormInput
              label="First Name"
              type="text"
              name="firstName"
              value={employeeDetails.firstName}
              onChange={onInputChange}
              required
            />
            <FormInput
              label="Last Name"
              type="text"
              name="lastName"
              value={employeeDetails.lastName}
              onChange={onInputChange}
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Sub Vendor One"
              type="text"
              name="subVendorOne"
              value={projectHistory.subVendorOne}
              onChange={onInputChange}
              required
            />

            <FormInput
              label="Sub Vendor Two"
              type="text"
              name="subVendorTwo"
              value={projectHistory.subVendorTwo}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-row">
            <FormInput
              label="Project Address"
              type="text"
              name="projectAddress"
              value={projectHistory.projectAddress}
              onChange={onInputChange}
              required
            />
            <div className="form-group col-md-6">
              <FormInput
                label="Project Status"
                type="select"
                name="projectStatus"
                value={projectHistory.projectStatus}
                onChange={onInputChange}
                required
                selectOptions={selectOptions}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <FormInput
                label="Project Start Date"
                type="date"
                className="form-control"
                name="dateOfJoining"
                value={
                  projectHistory.projectStartDate
                    ? dayjs(projectHistory.projectStartDate)
                    : null
                }
                onChange={(date) =>
                  onInputChangeDate(date, "projectStartDate")
                }
                required
              />
            </div>
            <div className="form-group col-md-6">
              <FormInput
                label="Project End Date"
                type="date"
                className="form-control"
                name="dateOfJoining"
                value={
                  projectHistory.projectEndDate
                    ? dayjs(projectHistory.projectEndDate)
                    : null
                }
                onChange={(date) =>
                  onInputChangeDate(date, "projectEndDate")
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <button type="submit" className="btn btn-outline-primary">
                Update
              </button>
            </div>
            <div className="form-group col-md-6">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleNavigate(employeeId)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>ProjectHistory Updated succesfully</p>
        </Modal>
      </div>
    </div>
  );
}
