import axios from "axios";
import { useEffect } from "react";

const Vote = () => {
  useEffect(() => {
    const getCandidates = async () => {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "candidates"
      );
      console.log(response.data);
    };
    getCandidates();
  }, []);

  return <div className="mt-10">Vote</div>;
};
export default Vote;
