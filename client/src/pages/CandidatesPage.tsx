import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateUser from "./admin/CreateUser";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  id: string;
}

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState<any>({
    username: "",
    publicKey: "",
    userType: "",
    phoneNumber: "",
    id: "",
    update: false,
    password: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const { id } = jwtDecode<DecodedToken>(token as string);

    axios
      .get(import.meta.env.VITE_BASE_URL + "users/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setuser(response.data);
        console.log(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="user-page">
      <CreateUser
        // username={user.username}
        // publicKey={user.publicKey}
        // userType={user.userType}
        // phoneNumber={user.phoneNumber}
        // id={user.id}
        // update={true}
        // password={user.password}
        {...user}
        update={true}
        id={user.id}
      />
    </div>
  );
};

export default CandidatesPage;
