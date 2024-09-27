import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Candidate {
  id: string;
  username: string;
  partyName: string;
  manifesto: string;
  voteCount: number;
  electionId: string;
  address: string; // Added address field
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
    address: "", // Added address field
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const decodedToken: TokenPayload = jwtDecode(token);
        console.log(decodedToken);

        const userId = decodedToken.id;

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
          address: response.data.candidateInfo.address || "", // Added address field
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

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}candidates/${candidateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Candidate updated successfully");
      setCandidate(response.data);
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Failed to update candidate");
    }
  };

  if (!candidate) {
    return <p>Loading candidate details...</p>;
  }

  return (
    <div className="text-white text-center p-6">
      <h1 className="mb-10 text-2xl font-bold">{candidate.username}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-start">
          <label htmlFor="partyName" className="mb-2">
            Party Name:
          </label>
          <input
            type="text"
            id="partyName"
            name="partyName"
            value={formData.partyName}
            onChange={handleChange}
            className="w-full p-2 text-black"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="manifesto" className="mb-2">
            Manifesto:
          </label>
          <textarea
            id="manifesto"
            name="manifesto"
            value={formData.manifesto}
            onChange={handleChange}
            className="w-full p-2 text-black"
            rows={4}
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="voteCount" className="mb-2">
            Vote Count:
          </label>
          <input
            type="number"
            id="voteCount"
            name="voteCount"
            value={formData.voteCount}
            className="w-full p-2 text-black"
            readOnly
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="electionId" className="mb-2">
            Election ID:
          </label>
          <input
            type="text"
            id="electionId"
            name="electionId"
            value={formData.electionId}
            onChange={handleChange}
            className="w-full p-2 text-black"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="address" className="mb-2">
            Candidate Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Candidate
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
