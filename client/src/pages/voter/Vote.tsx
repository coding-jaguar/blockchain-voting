import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { EthereumContext } from "@/blockchain/EthereumContext";

const Vote = ({ voterData: { publicKey } }: any) => {
  const { contract, account } = useContext(EthereumContext);
  console.log("Public key", publicKey);

  const handleVote = async (candidate: {
    candidateId: number;
    electionId: string;
    username: string;
    user: number;
    publicKey: string;
    idOnBc: string;
  }) => {
    if (!contract || !account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      // Convert voterKey to bytes32 format (as required by the smart contract)
      // const voterKeyBytes = ethers.utils.toUtf8Bytes(account);

      // Call the vote function on the contract
      // const ty = await contract.getTotalVotes();
      // console.log("hello");
      console.log("candidate", candidate.publicKey);

      const tx = await contract.vote(candidate.publicKey);

      // Wait for the transaction to be mined
      await tx.wait();

      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "votes",
        {
          candidateId: candidate.candidateId,
          electionId: candidate.electionId,
        }
      );
      alert("Vote submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit vote. Please check the console for details.");
    }
  };

  const handleValidate = async () => {
    if (!contract || !account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "votes/validate",
        {
          voterAddress: publicKey,
        }
      );
      console.log(response.data);

      alert("Vote validated successfully!");
    } catch (error) {
      console.error("Error validating vote:", error);
      alert("Failed to validate vote. Please check the console for details.");
    }
  };

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
          user: { username, publicKey },
          electionId,
          idOnBc,
        } = candidate;
        candidateList.push({
          candidateId: id,
          user: userId,
          username,
          publicKey,
          electionId,
          idOnBc,
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
              onClick={() => {
                handleVote(candidate);
              }}
            >
              Vote
            </button>
            <button onClick={handleValidate}>Validate</button>
          </div>
        );
      })}
    </div>
  );
};
export default Vote;
