import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createCandidate, fetchCandidateById, fetchRecruiters, updateCandidates } from "../SharedComponents/services/CandidateService";
import { fetchCompanies } from "../SharedComponents/services/CompaniesServies";


export default function CandidateForm({ mode }) {
  const navigate = useNavigate();
  let { candidateID } = useParams();
  const [recruiters, setRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    recruiterName: "",
    company: "",
    skills: "",
    phoneNo: "",
    university: "",
    originalVisaStatus: "",
    marketingVisaStatus: "",
    comments: "",
    candidateStatus: "",
    reference: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { firstName, lastName, emailAddress, recruiterName, company, skills, phoneNo, university, originalVisaStatus, marketingVisaStatus, comments, candidateStatus, reference} = user;

  useEffect(() => {
    const fetchData = async () => {
      const recruiterData = await fetchRecruiters();
      setRecruiters(recruiterData);
      const companyData = await fetchCompanies();
      setCompanies(companyData);
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    if (mode === "edit" && candidateID) {
      const fetchData = async () => {
        const data = await fetchCandidateById(candidateID);
        if (data) {
          setUser(data);
        }
      };
      fetchData();
    }
  }, [mode, candidateID]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const success = mode === "edit"
        ? await updateCandidates(candidateID, user)
        : await createCandidate(user);
  
      if (success) {
        showModal();
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "adding"} employee:`,
        error
      );
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
    <div className="col-md-10" style={{ overflow: "auto" }}>
      <div className="form-container">
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} Candidate
        </h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
            <div className="form-group col-md-6">
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
            <div className="form-group col-md-6">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={lastName}
                required
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>
          <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="emailAddress">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              name="emailAddress"
              value={emailAddress}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="recruiterName">Recruiter Name</label>
            <select
              className="form-control"
              name="recruiterName"
              value={recruiterName}
              onChange={(e) => onInputChange(e)}
            >
              <option value="">-- Select --</option>
              {Array.isArray(recruiters) &&
                recruiters.map((recruiter) => (
                  <option
                    key={recruiter.employeeID}
                    value={recruiter.firstName && recruiter.lastName}
                  >
                    {recruiter.firstName} {recruiter.lastName}
                  </option>
                ))}
            </select>
          </div>
          </div>
          <div className="form-row">
          <div className="form-group col-md-6">
              <label htmlFor="company">Company</label>
              <select
                className="form-control"
                name="company"
                value={company}
                onChange={(e) => onInputChange(e)}
              >
                <option value="">-- Select --</option>
                {Array.isArray(companies) &&
                  companies.map((companyData) => (
                    <option
                      key={companyData.employeeID}
                      value={companyData.companyName}
                    >
                      {companyData.companyName}
                    </option>
                  ))}
              </select>
            </div>
          <div className="form-group col-md-6">
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
          </div>
          <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="phone">Phone No</label>
            <input
              type="number"
              className="form-control"
              placeholder="Phone no"
              name="phoneNo"
              value={phoneNo}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="clgOfGrad">University</label>
            <input
              type="text"
              className="form-control"
              placeholder="University"
              name="university"
              value={university}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          </div>
          <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="originalVisaStatus">Visa Status</label>
            <input
              type={"text"}
              className="form-control"
              name="originalVisaStatus"
              value={originalVisaStatus}
              required
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="marketingVisaStatus">Marketing Visa</label>
            <input
              type={"text"}
              className="form-control"
              name="marketingVisaStatus"
              value={marketingVisaStatus}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          </div>
          <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="comments">Comments</label>
            <input
              type={"text"}
              className="form-control"
              name="comments"
              value={comments}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group col-md-6">
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
