import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaSearch, FaSpinner } from 'react-icons/fa';

const DISTRICTS = [
  'Gasabo', 'Kicukiro', 'Nyarugenge',
  'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
  'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango',
  'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'
].sort();

const CounselorCard = ({ counselor }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start">
      <div className="p-2 bg-indigo-50 rounded-full">
        <FaMapMarkerAlt className="text-xl text-indigo-600" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{counselor.fullName}</h3>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Country:</span> {counselor.country}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Office:</span> {counselor.officeAddress}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const MapSearch = () => {
  const [legalCounselors, setLegalCounselors] = useState([]);
  const [filteredCounselors, setFilteredCounselors] = useState([]);
  const [country, setCountry] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    fetchLegalCounselors();
  }, []);

  const fetchLegalCounselors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/auth/legal-counselors');
      setLegalCounselors(response.data);
      setFilteredCounselors(response.data);
    } catch (error) {
      setError('Failed to fetch legal counselors. Please try again later.');
      console.error('Error fetching legal counselors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setCountry(value);
    filterCounselors(value, officeAddress);
    setSearchPerformed(true);
  };

  const handleOfficeAddressChange = (e) => {
    const value = e.target.value;
    setOfficeAddress(value);
    filterCounselors(country, value);
    setSearchPerformed(true);
  };

  const filterCounselors = (countryFilter, officeAddressFilter) => {
    const filtered = legalCounselors.filter(counselor => {
      const matchCountry = !countryFilter || 
        counselor.country.toLowerCase().includes(countryFilter.toLowerCase());
      const matchOffice = !officeAddressFilter || 
        counselor.officeAddress === officeAddressFilter;
      return matchCountry && matchOffice;
    });
    setFilteredCounselors(filtered);
  };

  const handleReset = () => {
    setCountry('');
    setOfficeAddress('');
    setFilteredCounselors(legalCounselors);
    setSearchPerformed(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow">
          <p className="font-medium">{error}</p>
          <button 
            onClick={fetchLegalCounselors}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Legal Counselors</h1>
          <p className="mt-2 text-gray-600">Search for legal counselors by location</p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter country name"
                value={country}
                onChange={handleCountryChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={officeAddress}
                onChange={handleOfficeAddressChange}
              >
                <option value="">All Districts</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Results {searchPerformed && `(${filteredCounselors.length})`}
            </h2>
            {isLoading && (
              <div className="flex items-center text-gray-500">
                <FaSpinner className="animate-spin mr-2" />
                Loading...
              </div>
            )}
          </div>

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCounselors.length > 0 ? (
                filteredCounselors.map((counselor) => (
                  <CounselorCard key={counselor._id} counselor={counselor} />
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <FaSearch className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-500">
                    {searchPerformed 
                      ? "No counselors found matching your search criteria." 
                      : "Start searching to find legal counselors."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSearch;