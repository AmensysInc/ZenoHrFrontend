
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import { Modal } from 'antd';
import  dayjs  from 'dayjs';

export default function EditProjectHistory() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let { projectId, employeeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectHistory, setProjectHistory] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});

  const [projectStatusOptions, setProjectStatusOptions] = useState([
    "Active",
    "Terminated",
    "Ended",
    "On Hold",
  ]);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectHistory((prevHistory) => ({
      ...prevHistory,
      [name]: value,
    }));
  };

  const handleInputChangeDate = (date, name) => {
    setProjectHistory((prevDetails) => ({
      ...prevDetails,
      [name]: date.format("YYYY-MM-DD"),
    }));
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
  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Project History</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={employeeDetails.firstName || ""}
                readOnly
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={employeeDetails.lastName || ""}
                readOnly
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Sub Vendor One:</label>
              <input
                type="text"
                name="subVendorOne"
                value={projectHistory.subVendorOne}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label>Sub Vendor Two:</label>
              <input
                type="text"
                name="subVendorTwo"
                value={projectHistory.subVendorTwo}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Address:</label>
            <input
              type="text"
              name="projectAddress"
              value={projectHistory.projectAddress}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Project Start Date:</label>
              <DatePicker
                type="text"
                name="projectStartDate"
                className="form-control"
                value={dayjs(projectHistory.projectStartDate)}
                onChange={(date) =>
                  handleInputChangeDate(date, "projectStartDate")
                }
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>Project End Date:</label>
              <DatePicker
                type="text"
                name="projectEndDate"
                className="form-control"
                value={dayjs(projectHistory.projectEndDate)}
                onChange={(date) =>
                  handleInputChangeDate(date, "projectEndDate")
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Status:</label>
            <select
              name="projectStatus"
              value={projectHistory.projectStatus}
              onChange={handleInputChange}
              className="form-control"
            >
              {projectStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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



// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import ProjectHistoryForm from "./ProjectHistoryForm";

// export default function EditProjectHistory() {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const navigate = useNavigate();
//   const { projectId, employeeId } = useParams();
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [projectDetails, setProjectDetails] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchEmployeeDetails();
//     fetchProjectDetails();
//   }, []);

//   const fetchEmployeeDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const requestOptions = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const employeeResponse = await axios.get(
//         `${apiUrl}/employees/${employeeId}`,
//         requestOptions
//       );
//       setEmployeeDetails(employeeResponse.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching employee data:", error);
//     }
//   };

//   const handleUpdate = async (updatedProject) => {
//     try {
//       const token = localStorage.getItem("token");
//       const requestOptions = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.put(
//         `${apiUrl}/employees/projects/${projectId}`,
//         updatedProject,
//         requestOptions
//       );

//       if (response.status === 200) {
//         showModal();
//       }
//     } catch (error) {
//       console.error("Error updating project history:", error);
//     }
//   };

//   const handleCancel = () => {
//     navigate(`/editemployee/${employeeId}/project-history`);
//   };

//   const fetchProjectDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const requestOptions = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const [projectResponse] = await Promise.all([
//         axios.get(`${apiUrl}/projects/${projectId}`, requestOptions),
//       ]);

//       setProjectDetails(projectResponse.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching project data:", error);
//     }
//   };

//   const showModal = () => {
//     // Implement the modal logic here
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <ProjectHistoryForm
//        projectHistory={projectDetails}
//         initialData={{
//           firstName: employeeDetails.firstName || "",
//           lastName: employeeDetails.lastName || "",
//           subVendorOne: projectDetails.subVendorOne || "",
//           subVendorTwo: projectDetails.subVendorTwo || "",
//           projectAddress: projectDetails.projectAddress || "",
//           projectStartDate: projectDetails.projectStartDate || "",
//           projectEndDate: projectDetails.projectEndDate || "",
//           projectStatus: projectDetails.projectStatus || "",
//         }}
//         onSubmit={handleUpdate}
//         onCancel={handleCancel}
//         isEdit={true}
//         employeeDetails={employeeDetails}
//       />
//     </div>
//   );
// }