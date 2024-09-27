import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateUser from "./admin/CreateUser";
import ElectionList from "./admin/components/ElectionsList";
import Vote from "./voter/Vote";
import ElectionDetails from "./admin/components/ElectionDetails";

interface DecodedToken {
  id: string;
}

const VoterProfile: React.FC = () => {
  const [voterData, setVoterData] = useState<any>(null);
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const { id } = jwtDecode<DecodedToken>(token as string);

    axios
      .get(import.meta.env.VITE_BASE_URL + "users/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setVoterData(response.data))
      .catch((err) => console.error(err));

    const getElections = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BASE_URL + "elections"
        );
        setElections(response.data);
      } catch (error) {
        console.error("Error getting elections:", error);
      }
    };

    getElections();
  }, []);

  if (!voterData) return <p>Loading...</p>;

  return (
    <div className="voter-profile">
      <h1>Voter Profile</h1>
      <p>Username: {voterData.username}</p>
      <p>Has Voted: {voterData.hasVoted ? "Yes" : "No"}</p>

      <div>
        <button onClick={() => navigate("")}>view profile</button>
        <button onClick={() => navigate("elections")}>elections</button>
        <button onClick={() => navigate("vote")}>vote</button>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <CreateUser {...voterData} update={true} id={voterData.id} />
          }
        />
        <Route
          path="/elections"
          element={<ElectionList elections={elections} />}
        />

        <Route
          path="/vote"
          element={
            // <CandidateCard id={"ad"} username="some" onVote={() => {}} />
            <Vote voterData={voterData} />
          }
        />
        <Route path="/elections/elections/:id" element={<ElectionDetails />} />
      </Routes>
    </div>
  );
};

export default VoterProfile;
