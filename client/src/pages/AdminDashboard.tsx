import React from "react";
import { Routes, useNavigate, Route } from "react-router-dom";
import ManageUsers from "./admin/ManageUsers";
import ManageElections from "./admin/ManageElections";
import CreateElection from "./admin/CreateElection";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className=""
      style={{
        width: "1500px",
        backgroundImage:
          "url('https://rejolut.com/wp-content/uploads/2022/02/voting7.png')",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div>
        <h1 style={{ float: "left" }}>Admin Dashboard</h1>
      </div>
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
