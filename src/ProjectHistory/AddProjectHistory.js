import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Modal } from 'antd';
import FormInput from "../SharedComponents/FormInput";

export default function AddProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let { employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState({
    firstName: "",
    lastName: "",
    subVendorOne: "",
    subVendorTwo: "",
    projectAddress: "",
    projectStartDate: "",
    projectEndDate: "",
    projectStatus: "",
  });

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

  useEffect(() => {
    loadEmployeeDetails();
  }, []);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(project),
      };
      const response = await fetch(`${apiUrl}/employees/${employeeId}/projects`, requestOptions);
      if(response.status === 200){
        showModal();
      }
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const onInputChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };
  const onInputChangeDate = (date, name) => {
    if (date) {
      setProject({
        ...project,
        [name]: date.format("YYYY-MM-DD"),
      });
    }
  };

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
  const selectOptions = [
    { label: "-- Select --", value: "" },
    { label: "Active", value: "Active" },
    { label: "Terminated", value: "Terminated" },
    { label: "Ended", value: "Ended" },
    { label: "On Hold", value: "On Hold" },
  ];

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add Project</h2>
      <form onSubmit={(e) => onSubmit(e)}>
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
              value={subVendorOne}
              onChange={onInputChange}
              required
            />

            <FormInput
              label="Sub Vendor Two"
              type="text"
              name="subVendorTwo"
              value={subVendorTwo}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-row">
            <FormInput
              label="Project Address"
              type="text"
              name="projectAddress"
              value={projectAddress}
              onChange={onInputChange}
              required
            />
            <div className="form-group col-md-6">
              <FormInput
                label="Project Status"
                type="select"
                name="projectStatus"
                value={projectStatus}
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
                  projectStartDate
                    ? dayjs(projectStartDate)
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
                  projectEndDate
                    ? dayjs(projectEndDate)
                    : null
                }
                onChange={(date) =>
                  onInputChangeDate(date, "projectEndDate")
                }
                required
              />
            </div>
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
        <p>ProjectHistory added succesfully</p>
      </Modal>
      </form>
    </div>
  );
}
