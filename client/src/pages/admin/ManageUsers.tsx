import { Route, Routes, useNavigate } from "react-router-dom";
import CreateUser from "./CreateUser";

const ManageUsers = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="my-10">Manage Users</h1>
      <button
        onClick={() => {
          navigate("add-candidate");
        }}
      >
        add user
      </button>
      <button>delete user</button>

      <Routes>
        <Route path="/add-candidate" element={<CreateUser />} />
      </Routes>
    </div>
  );
};
export default ManageUsers;
