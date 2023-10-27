import React, { useEffect, useState } from "react";
import CandidateForm from "./CandidateForm";
import fetchRecruiters from "./fetchRecruiters";

export default function EditCandidate() {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    const fetchRecruitersData = async () => {
      const recruiterData = await fetchRecruiters();
      setRecruiters(recruiterData);
    };

    fetchRecruitersData();
  }, []);

  return (
    <div>
      <CandidateForm mode="edit" recruiters={recruiters} />
    </div>
  );
}
