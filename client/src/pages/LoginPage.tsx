import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const baseurl = import.meta.env.VITE_BASE_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(baseurl + "users/login", {
        username,
        password,
      });
      const {
        token,
        user: { userType },
      } = response.data;
      console.log(response.data);

      // Store the token in localStorage
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect based on userType
      if (userType === "ADMIN") {
        navigate("/admin");
      } else if (userType === "VOTER") {
        navigate("/voter");
      } else if (userType === "CANDIDATE") {
        navigate("/candidates");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
