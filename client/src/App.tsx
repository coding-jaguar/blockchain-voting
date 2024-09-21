import "./App.css";

import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import VoterProfile from "./pages/VoterProfile";
import CandidatesPage from "./pages/CandidatesPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import { useContext, useEffect } from "react";
import { EthereumContext } from "./blockchain/EthereumContext";

function App() {
  const { connectWallet } = useContext(EthereumContext);
  useEffect(() => {
    connectWallet();
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/*"
        element={<ProtectedRoute component={AdminDashboard} role="ADMIN" />}
      />
      <Route
        path="/voter/*"
        element={<ProtectedRoute component={VoterProfile} role="VOTER" />}
      />
      <Route
        path="/candidates/*"
        element={<ProtectedRoute component={CandidatesPage} role="CANDIDATE" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
