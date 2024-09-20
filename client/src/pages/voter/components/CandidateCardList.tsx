import { useEffect, useState } from "react";
import CandidateCard from "./CandidateCard";
import axios from "axios";

const CandidateCardList = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const vote = async (id: string) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "candidates",
        {
          candidateId: id,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };
  useEffect(() => {
    const getCandidates = async () => {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "candidates"
      );
      console.log(response.data);
    };
    const clist = [];
    candidates.map((candidate) => {
      const username = candidate.user.username;
      const id = candidate.id;
    });
    getCandidates();
  }, []);
  return <div>Hello</div>;
};
export default CandidateCardList;
