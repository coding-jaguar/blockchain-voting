import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ElectionList from "./components/ElectionsList";
import ElectionDetails from "./components/ElectionDetails";
import jwtDecode from "jwt-decode";

const ManageElections = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
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

  const navigate = useNavigate();
  return (
    <div>
      <div>
        <h1 className=" text-red-500 my-10">Manage Elections</h1>
        <div className="flex justify-between gap-2">
          <button onClick={() => navigate("../create-election")}>
            Create Election
          </button>
        </div>
      </div>
      <div className="mt-10">
        <Routes>
          <Route path="/" element={<ElectionList elections={elections} />} />
          <Route path="/elections/*" element={<ElectionDetails />} />
        </Routes>
      </div>
    </div>
  );
};
export default ManageElections;
