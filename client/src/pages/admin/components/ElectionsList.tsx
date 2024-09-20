import { useNavigate } from "react-router-dom";

const ElectionList = ({ elections }: any) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Elections</h2>
      {elections.length === 0 ? (
        <p className="text-gray-500">No elections available.</p>
      ) : (
        <ul className="space-y-4">
          {elections.map((election: any) => (
            <li
              onClick={() => navigate(`elections/${election.id}`)}
              key={election.id}
              className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                {election.name}
              </h3>
              <p className="text-gray-600">
                Status:{" "}
                <span
                  className={`font-medium ${
                    election.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {election.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="text-gray-600">
                Candidates: {election.candidates.length}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectionList;
