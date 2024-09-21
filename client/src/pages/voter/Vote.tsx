import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import abiJson from "../../blockchain/Voting.json";
import { EthereumContext } from "@/blockchain/EthereumContext";

const Vote = () => {
  const { contract } = useContext(EthereumContext);
  useEffect(() => {});
  const [candidates, setCandidates] = useState<any[]>([]);
  useEffect(() => {
    const getCandidates = async () => {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "candidates"
      );
      const candidates = response.data;
      const candidateList: any = [];
      candidates.map((candidate: any) => {
        const {
          id,
          userId,
          user: { username },
          electionId,
        } = candidate;
        candidateList.push({
          candidateId: id,
          user: userId,
          username,
          electionId,
        });
      });
      setCandidates(candidateList);
    };
    getCandidates();
  }, []);

  return (
    <div className="mt-10">
      {candidates.map((candidate: any) => {
        return (
          <div
            key={candidate.candidateId}
            className="flex justify-between gap-2"
          >
            <div>{candidate.username}</div>
            <button
              onClick={async () => {
                const response = await axios.post(
                  import.meta.env.VITE_BASE_URL + "votes",
                  {
                    candidateId: candidate.candidateId,
                    electionId: candidate.electionId,
                  }
                );
                if (!contract) {
                  alert("Contract not found");
                  return;
                }
                contract.vote(candidate.candidateId);
                console.log(response.data);
              }}
            >
              Vote
            </button>
          </div>
        );
      })}
    </div>
  );
};
export default Vote;
