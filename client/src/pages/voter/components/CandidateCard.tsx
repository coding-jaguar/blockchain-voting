import React from "react";

interface CandidateCardProps {
  id: string;
  username: string;
  onVote: (id: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  id,
  username,
  onVote,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{username}</h2>
        <p className="text-gray-700">Candidate ID: {id}</p>
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onVote(id)}
        >
          Vote
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
