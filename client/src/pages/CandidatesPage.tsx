import React, { useState, useEffect } from "react";
import axios from "axios";
import CandidateForm from "@/candidate/CandidateForm";

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(import.meta.env.VITE_BASE_URL + "candidates", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCandidates(response.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="candidates-page">
      <CandidateForm />
    </div>
  );
};

export default CandidatesPage;
