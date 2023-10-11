import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";

export default function AddCandidate() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
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
  } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
        body: JSON.stringify(user),
      };

      const response = await fetch(`${apiUrl}/candidates`, requestOptions);
      console.log(response);
      if (response.status === 201) {
        showModal();
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
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
  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add Candidate</h2>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type={"text"}
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
              type={"text"}
              className="form-control"
              name="lastName"
              value={lastName}
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="emailAddress">Email Address</label>
          <input
            type={"text"}
            className="form-control"
            name="emailAddress"
            value={emailAddress}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="recruiterName">Recruiter Name</label>
          <input
            type={"text"}
            className="form-control"
            name="recruiterName"
            value={recruiterName}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div> */}
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <input
            type={"text"}
            className="form-control"
            name="skills"
            value={skills}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNo">Phone No</label>
          <input
            type={"number"}
            className="form-control"
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
            required
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="candidateStatus">Working or Bench</label>
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
            <option value="Resigned from company">Resigned from company</option>
          </select>
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Candidate added succesfully</p>
        </Modal>
      </form>
    </div>
  );
}
