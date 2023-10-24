import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function CandidateForm({ mode, recruiters }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let { candidateID } = useParams();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    university : "",
    recruiterName: "",
    skills: "",
    phoneNo: "",
    originalVisaStatus: "",
    marketingVisaStatus: "",
    comments: "",
    candidateStatus: "",
    reference: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { firstName, lastName, emailAddress, recruiterName, skills, phoneNo, university, originalVisaStatus, marketingVisaStatus, comments, candidateStatus, reference} = user;

  useEffect(() => {
    if (mode === "edit" && candidateID) {
      const fetchCandidateData = async () => {
        try {
          const token = localStorage.getItem("token");
          const requestOptions = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await fetch(`${apiUrl}/candidates/${candidateID}`, requestOptions);

          if (response.status === 200) {
            const candidateData = await response.json();
            setUser(candidateData);
          }
        } catch (error) {
          console.error("Error fetching candidate data:", error);
        }
      };
      fetchCandidateData();
    }
  }, [mode, candidateID]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const requestOptions = {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      };

      const response = await fetch(`${apiUrl}/candidates${mode === "edit" ? `/${candidateID}` : ""}`, requestOptions);

      if (response.status === 200 || response.status === 201) {
        showModal();
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "adding"} candidate:`, error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/candidates");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/candidates"); 
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">{isEditMode ? "Edit" : "Add"} Candidate</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
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
              required={mode === "edit"}
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
            <label htmlFor="phone">Phone No</label>
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
            <label htmlFor="clgOfGrad">University</label>
            <input
              type="text"
              className="form-control"
              placeholder="University"
              name="university"
              value={university}
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
            <label htmlFor="marketingVisaStatus">Marketing Visa</label>
            <input
              type={"text"}
              className="form-control"
              name="marketingVisaStatus"
              value={marketingVisaStatus}
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
          <div className="form-group">
            <label htmlFor="reference">Reference</label>
            <input
              type="text"
              className="form-control"
              placeholder="Reference"
              name="reference"
              value={reference}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>

          <button type="submit" className="btn btn-outline-primary">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/candidates">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Candidate {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  );
}