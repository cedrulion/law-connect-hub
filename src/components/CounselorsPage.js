import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser ,Tie, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const CounselorsPage = () => {
  const [legalCounselors, setLegalCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = 'your-auth-token-here';
  const loggedInUser  = { _id: 'logged-in-user-id' };

  useEffect(() => {
    const fetchLegalCounselors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/legal-counselors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLegalCounselors(response.data);
      } catch (error) {
        console.error('Error fetching legal counselors:', error);
        setError('Failed to load counselors');
      } finally {
        setLoading(false);
      }
    };

    fetchLegalCounselors();
  }, [token]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center text-lg">{error}</div>;

  return (
    <div className="p-6 text-gray-800 bg-gray-100 min-h-screen" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Our Legal Counselors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {legalCounselors.map((counselor) => (
          <div key={counselor._id} className="bg-white shadow-lg rounded-lg p-5 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center space-x-4 mb-4">
              <FaUser Tie className="text-3xl text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{counselor.fullName}</h2>
                <p className="text-sm text-gray-500">{counselor.role}</p>
              </div>
            </div>
            <p className="flex items-center text-gray-700 mb-2">
              <FaEnvelope className="mr-2 text-indigo-600" /> {counselor.email}
            </p>
            <p className="flex items-center text-gray-700 mb-2">
              <FaPhone className="mr-2 text-indigo-600" /> {counselor.phone}
            </p>
            <p className="flex items-center text-gray-700 mb-2">
              <FaMapMarkerAlt className="mr-2 text-indigo-600" /> {counselor.officeAddress}, {counselor.country}
            </p>
            <p className="flex items-center text-gray-700 mb-2">
              <FaBriefcase className="mr-2 text-indigo-600" /> {counselor.lawFirm}
            </p>
            <p className="text-gray-600">Experience: {counselor.yearsOfExperience} years</p>
            <p className="text-gray-600">Fee per hour: ${counselor.feePerHour}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounselorsPage;