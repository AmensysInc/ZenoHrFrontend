import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Modal } from "antd";

export default function EditCandidate() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let { candidateID } = useParams();

  const [candidateDetails, setCandidateDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    recruiterName: "",
    skills: "",
    phoneNo: "",
    originalVisaStatus: "",
    comments: "",
    candidateStatus: "",
  });

  const [recruiters, setRecruiters] = useState([]);

  const {
    firstName,
    lastName,
    emailAddress,
    recruiterName,
    skills,
    phoneNo,
    originalVisaStatus,
    comments,
    candidateStatus,
  } = candidateDetails;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecruiters();
    fetchDetails();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const recruitersResponse = await axios.get(
        `${apiUrl}/employees/role?securityGroup=RECRUITER`,
        requestOptions
      );
      const recruiterData = recruitersResponse.data || [];
      setRecruiters(recruiterData);
      console.log(recruiterData);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const candidateResponse = await axios.get(
        `${apiUrl}/candidates/${candidateID}`,
        requestOptions
      );
      setCandidateDetails(candidateResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onSubmit = async (event) => {
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
        `${apiUrl}/candidates/${candidateID}`,
        candidateDetails,
        requestOptions
      );

      if (response.status === 200) {
        showModal();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleNavigate = () => {
    navigate("/candidates");
  };

  const showModal = () => {
    setIsModalOpen(true);
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
    setCandidateDetails({
      ...candidateDetails,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">Edit Candidate</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="FirstName">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="emailAddress">Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Email Address"
              name="emailAddress"
              value={emailAddress}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="recruiterName">Recruiter Name</label>
            <select
              className="form-control"
              name="recruiterName"
              value={recruiterName}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option value="">-- Select --</option>
              {Array.isArray(recruiters) &&
                recruiters.map((recruiter) => (
                  <option
                    key={recruiter.employeeID}
                    value={recruiter.firstName}
                  >
                    {recruiter.firstName} {recruiter.lastName}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              className="form-control"
              placeholder="Skills"
              name="skills"
              value={skills}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clgOfGrad">Phone No</label>
            <input
              type="text"
              className="form-control"
              placeholder="Phone no"
              name="phoneNo"
              value={phoneNo}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalVisaStatus">Visa Status</label>
            <input
              type={"text"}
              className="form-control"
              name="originalVisaStatus"
              value={originalVisaStatus}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="comments">Comments</label>
            <input
              type={"text"}
              className="form-control"
              name="comments"
              value={comments}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="candidateStatus">Candidate Status</label>
            <select
              id="candidateStatus"
              name="candidateStatus"
              value={candidateStatus}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option value="">-- Select --</option>
              <option value="In Training">In Training</option>
              <option value="InMarketing">In Marketing</option>
              <option value="Needs Training">Needs Training</option>
              <option value="Start Marketing">Start Marketing</option>
              <option value="Stop Marketing">Stop Marketing</option>
              <option value="Placed">Placed</option>
              <option value="Resigned from company">
                Resigned from company
              </option>
            </select>
          </div>

          <button type="submit" className="btn btn-outline-primary">
            Update
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/candidates">
            Cancel
          </Link>
        </form>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Candidate Updated succesfully</p>
        </Modal>
      </div>
    </div>
  );
}
