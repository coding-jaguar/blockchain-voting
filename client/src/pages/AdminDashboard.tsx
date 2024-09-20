import React from "react";
import { Routes, useNavigate, Route } from "react-router-dom";
import ManageUsers from "./admin/ManageUsers";
import ManageElections from "./admin/ManageElections";
import CreateElection from "./admin/CreateElection";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button
        onClick={() => {
          navigate("manage-elections");
        }}
      >
        Manage Elections
      </button>
      <button onClick={() => navigate("manage-users")}>Manage Users</button>
      <Routes>
        <Route path="/manage-elections/*" element={<ManageElections />} />
        <Route path="/manage-users/*" element={<ManageUsers />} />
        <Route path="/create-election" element={<CreateElection />} />
      </Routes>
      <div></div>
    </div>
  );
};

export default AdminDashboard;
