// AdminAssignCase.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const AdminAssignCase = () => {
  const [cases, setCases] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [assignments, setAssignments] = useState({}); // { caseId: selectedLawyerId }
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch unassigned cases and lawyers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all cases (admin can see all cases)
        const caseRes = await axios.get("http://localhost:5000/api/cases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter for cases that are unassigned
        const unassignedCases = caseRes.data.data.filter(
          (c) => !c.assignedLawyer
        );
        setCases(unassignedCases);

        // Fetch all users then filter for LAWYER role
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const lawyerList = userRes.data.filter((user) => user.role === "LAWYER");
        setLawyers(lawyerList);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch cases or lawyers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle change in dropdown selection for a specific case
  const handleSelectChange = (caseId, lawyerId) => {
    setAssignments((prev) => ({ ...prev, [caseId]: lawyerId }));
  };

  // Handle assigning a lawyer to a case
  const handleAssign = async (caseId) => {
    const selectedLawyerId = assignments[caseId];
    if (!selectedLawyerId) {
      setError("Please select a lawyer before assigning.");
      return;
    }
    setError("");
    setMessage("");
    setAssigning((prev) => ({ ...prev, [caseId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/cases/assign",
        { caseId, lawyerId: selectedLawyerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMessage(`Case ${caseId} assigned successfully.`);
        // Remove the case from the list (or refresh your list)
        setCases((prev) => prev.filter((c) => c._id !== caseId));
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to assign lawyer. Please try again."
      );
    } finally {
      setAssigning((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Assign Cases to Lawyers
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2" /> <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaCheck className="mr-2" /> <span>{message}</span>
        </div>
      )}

      {cases.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow text-center">
          <p className="text-gray-700">No unassigned cases available.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Legal Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assign Lawyer
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <tr key={caseItem._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{caseItem.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {caseItem.clientId?.fullName || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {caseItem.clientId?.email || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {caseItem.legalCategory}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="border border-gray-300 rounded-md p-2"
                      onChange={(e) =>
                        handleSelectChange(caseItem._id, e.target.value)
                      }
                      value={assignments[caseItem._id] || ""}
                    >
                      <option value="">Select Lawyer</option>
                      {lawyers.map((lawyer) => (
                        <option key={lawyer._id} value={lawyer._id}>
                          {lawyer.fullName} ({lawyer.email})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleAssign(caseItem._id)}
                      disabled={assigning[caseItem._id]}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      {assigning[caseItem._id] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        "Assign"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAssignCase;
