import axios from "axios";
import React, { useEffect, useState } from "react";

// Define the user type
type UserType = "ADMIN" | "VOTER" | "CANDIDATE";

// Define the user interface
interface User {
  username: string;
  password: string;
  publicKey: string;
  userType: UserType;
  phoneNumber: string;
}

interface CreateUserProps {
  username: string | undefined;
  password: string | undefined;
  publicKey: string | undefined;
  userType: UserType | undefined;
  phoneNumber: string | undefined;
  update: boolean;
  id: string | undefined;
}

const CreateUser: React.FC<CreateUserProps> = ({
  username,
  password,
  publicKey,
  userType,
  phoneNumber,
  update,
  id,
}) => {
  const [user, setUser] = useState<User>({
    username: username || "",
    password: password || "",
    publicKey: publicKey || "",
    userType: userType || "VOTER",
    phoneNumber: phoneNumber || "",
  });

  // Use useEffect to update the state when props change
  useEffect(() => {
    setUser({
      username: username || "",
      password: password || "",
      publicKey: publicKey || "",
      userType: userType || "VOTER",
      phoneNumber: phoneNumber || "",
    });
  }, [username, password, publicKey, userType, phoneNumber]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let response: any;
    if (!update) {
      response = await axios.post(
        import.meta.env.VITE_BASE_URL + `users/create`,
        user
      );
    } else {
      response = await axios.put(
        import.meta.env.VITE_BASE_URL + `users/${id}`,
        user
      );
    }

    console.log(response.data);

    // Reset form after submission
    setUser({
      username: "",
      password: "",
      publicKey: "",
      userType: "VOTER",
      phoneNumber: "",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl text-black">
      <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
        {update ? "Update User" : "Create User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="publicKey"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="publicKey"
            name="publicKey"
            value={user.publicKey}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="userType"
            className="block text-sm font-medium text-gray-700"
          >
            User Type
          </label>
          <select
            id="userType"
            name="userType"
            value={user.userType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="CANDIDATE">CANDIDATE</option>
            <option value="VOTER">VOTER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {update ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
