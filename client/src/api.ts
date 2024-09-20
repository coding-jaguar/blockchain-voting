import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export default api;
