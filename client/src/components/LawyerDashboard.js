import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSpinner, FaBriefcase, FaUserCheck, FaExclamationTriangle,
  FaFilter, FaSearch, FaSortAmountDown, FaSortAmountUp
} from 'react-icons/fa';
import axios from 'axios';
import AddNoteModal from './AddNoteModal';

const LawyerDashboard = () => {
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [caseItem, setCaseItem] = useState(null); // (Optional: used when viewing case details)
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingCase, setAcceptingCase] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    status: '',
    category: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.category) params.append('category', filter.category);
      if (filter.search) params.append('search', filter.search);
      
      const response = await axios.get(`http://localhost:5000/api/cases?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let sortedCases = [...response.data.data];
      if (sortConfig.key) {
        sortedCases.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setCases(sortedCases);
    } catch (err) {
      setError('Failed to load cases. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserId = () => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return null;
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser._id; // Assuming the user object has an _id property
    } catch (error) {
      console.error('Error parsing loggedInUser:', error);
      return null;
    }
  };

  const handleAcceptCase = async (caseId) => {
    try {
      setAcceptingCase(caseId);
      const token = localStorage.getItem('token');
      const userId = getUserId();
  
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }
  
      await axios.post(
        'http://localhost:5000/api/cases/assign',
        {
          caseId,
          lawyerId: userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      await fetchCases();
    } catch (err) {
      setError('Failed to accept case. Please try again later.');
      console.error(err);
    } finally {
      setAcceptingCase(null);
    }
  };

  const handleNoteAdded = (newNote) => {
    // Update the local state with the new note (if needed)
    // If you have a case details view on the dashboard, you might update it here.
    setCaseItem(prevCase => ({
      ...prevCase,
      notes: [...(prevCase.notes || []), newNote]
    }));
  };

  useEffect(() => {
    fetchCases();
  }, [filter, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setFilter(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilter({
      status: '',
      category: '',
      search: ''
    });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const userId = getUserId();
  const assignedCases = cases.filter(c => c.assignedLawyer && c.assignedLawyer._id === userId);
  const pendingCases = cases.filter(c => !c.assignedLawyer);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }
  
  const legalCategories = [
    'Family Law',
    'Criminal Law',
    'Civil Litigation',
    'Corporate Law',
    'Real Estate',
    'Intellectual Property',
    'Immigration',
    'Employment Law',
    'Tax Law',
    'Other'
  ];
  
  const statusOptions = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  
  return (
    <div className="mx-4 container mx-auto px-4 py-8 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lawyer Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Legal Category
            </label>
            <select
              id="category"
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {legalCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={filter.search}
                onChange={handleSearchChange}
                placeholder="Search by title or description..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={clearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
          >
            <FaFilter className="mr-2" /> Clear Filters
          </button>
        </div>
      </div>
      
      {assignedCases.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Assigned Cases ({assignedCases.length})
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Case Title
                        {sortConfig.key === 'title' && (
                          sortConfig.direction === 'asc' ? 
                            <FaSortAmountUp className="ml-1" /> : 
                            <FaSortAmountDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === 'createdAt' && (
                          sortConfig.direction === 'asc' ? 
                            <FaSortAmountUp className="ml-1" /> : 
                            <FaSortAmountDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedCases.map(caseItem => (
                    <tr key={caseItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{caseItem.clientId.fullName}</div>
                        <div className="text-sm text-gray-500">{caseItem.clientId.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${caseItem.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            caseItem.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                            caseItem.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                            caseItem.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {caseItem.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.legalCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/dashboard/caseview/${caseItem._id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                      <button
                      onClick={() => {
                        setSelectedCaseId(caseItem._id);
                        setIsNoteModalOpen(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded flex items-center mt-2"
                    >
                      Add Note
                    </button>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {pendingCases.length > 0 && (
        <div>
          <h2 className=" text-xl font-semibold text-gray-800 mb-4">
            Available Cases ({pendingCases.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCases.map(caseItem => (
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
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        PENDING
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
                    <div>Client: <span className="font-medium">{caseItem.clientId.fullName}</span></div>
                    <div>Submitted: <span className="font-medium">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </span></div>
                  </div>
                  
                  <div className="flex space-x-2 flex-wrap">
                    <Link 
                      to={`/dashboard/caseview/${caseItem._id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAcceptCase(caseItem._id)}
                      disabled={acceptingCase === caseItem._id}
                      className={`${
                        acceptingCase === caseItem._id
                          ? 'bg-gray-400'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white text-sm py-1 px-2 rounded flex items-center`}
                    >
                      {acceptingCase === caseItem._id ? (
                        <>
                          <FaSpinner className="animate-spin mr-1" /> Accepting...
                        </>
                      ) : (
                        <>
                          <FaUserCheck className="mr-1" /> Accept Case
                        </>
                      )}
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {cases.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <FaBriefcase className="text-5xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No cases available</h2>
          <p className="text-gray-500">
            There are currently no cases matching your filter criteria.
          </p>
        </div>
      )}
      
      <AddNoteModal
        caseId={selectedCaseId}
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onNoteAdded={handleNoteAdded}
      />
    
    </div>
  );
};

export default LawyerDashboard;
