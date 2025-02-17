import React, { useState, useEffect } from 'react';
import { FaPlus, FaFolder, FaFolderOpen, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/cases', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCases(response.data.data);
      } catch (err) {
        setError('Failed to load your cases. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 ml-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Legal Cases</h1>
        <Link 
          to="/dashboard/new-case" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> New Case
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {cases.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FaFolder className="text-5xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No cases yet</h2>
          <p className="text-gray-500 mb-4">You haven't submitted any legal assistance requests.</p>
          <Link 
            to="/dashboard/new-case" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Submit Your First Case
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map(caseItem => (
            <div 
              key={caseItem._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                      {caseItem.title}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                      ${caseItem.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        caseItem.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                        caseItem.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                        caseItem.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {caseItem.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                    ${caseItem.urgency === 'HIGH' ? 'bg-red-100 text-red-800' : 
                      caseItem.urgency === 'MEDIUM' ? 'bg-orange-100 text-orange-800' : 
                      'bg-green-100 text-green-800'}`}
                  >
                    {caseItem.urgency}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-3 mb-4 text-sm line-clamp-2">
                  {caseItem.description}
                </p>
                
                <div className="text-sm text-gray-500 mb-4">
                  <div>Legal Category: <span className="font-medium">{caseItem.legalCategory}</span></div>
                  <div>Created: <span className="font-medium">
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </span></div>
                </div>
                
                <Link 
                  to={`/dashboard/caseview/${caseItem._id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  <FaFolderOpen className="mr-1" /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;