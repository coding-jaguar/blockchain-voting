import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface User {
  id: string;

  username: string;
}

interface Candidate {
  id: string;
  userId: string;
  partyName: string | null;
  manifesto: string | null;
  voteCount: number;
  user: User;
}

interface Election {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  candidates: Candidate[];
}

const ElectionDetails = () => {
  const location = useLocation();
  const [election, setElection] = useState<Election | null>(null);

  const handleAddCandidate = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "candidates"
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  useEffect(() => {
    const getElection = async () => {
      const locationArray = location.pathname.split("/");
      try {
        const response = await axios.get(
          import.meta.env.VITE_BASE_URL +
            "elections/" +
            locationArray[locationArray.length - 1]
        );
        setElection(response.data);
      } catch (error) {
        console.error("Error getting election:", error);
      }
    };

    getElection();
  }, [location.pathname]); // Added dependency array

  if (!election) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Election Details</h1>
      <p>
        <strong>ID:</strong> {election.id}
      </p>
      <p>
        <strong>Name:</strong> {election.name}
      </p>
      <p>
        <strong>Active Status:</strong>{" "}
        {election.isActive ? "Active" : "Inactive"}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(election.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong>{" "}
        {new Date(election.updatedAt).toLocaleString()}
      </p>

      <h2>Candidates</h2>
      <div>
        {election.candidates.length > 0 ? (
          election.candidates.map((candidate) => (
            <div
              key={candidate.id}
              style={{ marginBottom: "20px" }}
              className=" border-white border-4"
            >
              <p>
                <strong>Candidate ID:</strong> {candidate.user.id}
              </p>
              <p>
                <strong>User ID:</strong> {candidate.userId}
              </p>
              <p>
                <strong>username</strong> {candidate.user.username}
              </p>

              <p>
                <strong>Vote Count:</strong> {candidate.voteCount}
              </p>
            </div>
          ))
        ) : (
          <p>No candidates available.</p>
        )}
      </div>
    </div>
  );
};

export default ElectionDetails;
