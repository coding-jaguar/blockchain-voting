import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // To decode the JWT token

interface Candidate {
  id: string;
  username: string;
  partyName: string;
  manifesto: string;
  voteCount: number;
  electionId: string;
}

interface TokenPayload {
  id: string;
  userType: string;
  iat: number;
  exp: number;
}

const CandidateForm: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidateId, setCandidateId] = useState<string>("");
  const [formData, setFormData] = useState({
    partyName: "",
    manifesto: "",
    voteCount: 0,
    electionId: "",
  });

  // Fetch candidate details on component mount
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        // Decode the token to extract the payload
        const decodedToken: TokenPayload = jwtDecode(token);
        console.log(decodedToken);

        const userId = decodedToken.id; // Extract candidate ID from the payload

        // Fetch candidate details using the candidate ID from the token
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/${userId}`
        );
        console.log(response.data);

        setCandidate({
          username: response.data.username,
          ...response.data.candidateInfo,
        });
        setCandidateId(response.data.candidateInfo.id);

        setFormData({
          partyName: response.data.candidateInfo.partyName || "",
          manifesto: response.data.candidateInfo.manifesto || "",
          voteCount: response.data.candidateInfo.voteCount || 0,
          electionId: response.data.candidateInfo.electionId || "",
        });
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
    };

    fetchCandidate();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      // Update candidate details using the extracted candidate ID
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}candidates/${candidateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      alert("Candidate updated successfully");
      setCandidate(response.data); // Optionally update the candidate in the state
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Failed to update candidate");
    }
  };

  if (!candidate) {
    return <p>Loading candidate details...</p>;
  }

  return (
    <div className="text-white text-center">
      <h1 className="mb-10">{candidate.username}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="partyName">Party Name:</label>
          <input
            type="text"
            id="partyName"
            name="partyName"
            value={formData.partyName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="manifesto">Manifesto:</label>
          <textarea
            id="manifesto"
            name="manifesto"
            value={formData.manifesto}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="voteCount">Vote Count:</label>
          <input
            type="number"
            id="voteCount"
            name="voteCount"
            value={formData.voteCount}
          />
        </div>
        <div>
          <label htmlFor="electionId">Election ID:</label>
          <input
            type="text"
            id="electionId"
            name="electionId"
            value={formData.electionId}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Candidate</button>
      </form>
    </div>
  );
};

export default CandidateForm;
