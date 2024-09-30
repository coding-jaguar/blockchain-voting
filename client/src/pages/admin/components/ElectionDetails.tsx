import { EthereumContext } from "@/blockchain/EthereumContext";
import axios from "axios";
import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
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

interface CandidateResponse {
  candidateAddress: string;
  candidateUsername: string;
  voteCount: BigNumber;
}

const ElectionDetails = () => {
  const location = useLocation();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState([] as CandidateResponse[]); // Added useState hook
  const { contract } = useContext(EthereumContext);

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
    const getCandidates = async () => {
      try {
        if (!contract) {
          return;
        }
        const response = await contract.getAllCandidates();
        console.log("candidates");
        const [candidateAddresses, candidateUsernames, voteCounts] = response;
        const candidateList: CandidateResponse[] = [];
        for (let i = 0; i < candidateAddresses.length; i++) {
          candidateList.push({
            candidateAddress: candidateAddresses[i],
            candidateUsername: candidateUsernames[i],
            voteCount: voteCounts[i],
          });
        }
        setCandidates(candidateList);
      } catch (error) {
        console.error("Error getting candidates:", error);
      }
    };
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
    getCandidates();
    getElection();
  }, [location.pathname]); // Added dependency array

  const handle = (endpoint: string) => {
    try {
      const response: any = axios.post(
        import.meta.env.VITE_BASE_URL + `elections/${endpoint}`,
        {
          electionId: election?.id,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error starting election:", error);
    }
  };

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
      <div className="space-y-4 text-black py-10">
        {candidates.map((candidate: CandidateResponse) => (
          <div
            key={candidate.candidateAddress}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-sm"
          >
            <div className="font-semibold text-lg">
              {candidate.candidateUsername}
            </div>
            <div className="text-sm text-gray-600">
              Votes: {candidate.voteCount.toString()}
            </div>
          </div>
        ))}
      </div>

      <div>
        <button onClick={handleAddCandidate}>Add candidate</button>
        <button onClick={() => handle("start")}>start election</button>
        <button onClick={() => handle("reset")}>reset election</button>
        <button onClick={() => handle("end")}>end election</button>
      </div>
    </div>
  );
};

export default ElectionDetails;
