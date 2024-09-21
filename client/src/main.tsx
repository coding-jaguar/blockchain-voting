import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { EthereumProvider } from "./blockchain/EthereumContext.tsx";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <EthereumProvider>
        <App />
      </EthereumProvider>
    </Router>
  </StrictMode>
);
