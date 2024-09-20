import React, { useState } from "react";
import axios from "axios";

// Define the Election type based on the schema, omitting automatic fields
type Election = {
  name: string;
  isActive: boolean;
};

const CreateElection: React.FC = () => {
  const [election, setElection] = useState<Election>({
    name: "",
    isActive: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setElection((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "elections",
        election
      );
      console.log("Election created:", response.data);
      // Handle success (e.g., show a success message, reset form, etc.)
    } catch (error) {
      console.error("Error creating election:", error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Election Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={election.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={election.isActive}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <span className="text-sm text-black">Is Active</span>
        </label>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Election
        </button>
      </div>
    </form>
  );
};

export default CreateElection;
