// MapSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapSearch = () => {
  const [legalCounselors, setLegalCounselors] = useState([]);
  const [filteredCounselors, setFilteredCounselors] = useState([]);
  const [country, setCountry] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  useEffect(() => {
    // Fetch legal counselors data
    const fetchLegalCounselors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/legal-counselors');
        setLegalCounselors(response.data);
        setFilteredCounselors(response.data); // Initially show all counselors
      } catch (error) {
        console.error('Error fetching legal counselors:', error);
      }
    };

    fetchLegalCounselors();
  }, []);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    filterCounselors(e.target.value, officeAddress);
  };

  const handleOfficeAddressChange = (e) => {
    setOfficeAddress(e.target.value);
    filterCounselors(country, e.target.value);
  };

  const filterCounselors = (countryFilter, officeAddressFilter) => {
    const filtered = legalCounselors.filter(counselor => {
      return (
        (countryFilter ? counselor.country.toLowerCase().includes(countryFilter.toLowerCase()) : true) &&
        (officeAddressFilter ? counselor.officeAddress.toLowerCase().includes(officeAddressFilter.toLowerCase()) : true)
      );
    });
    setFilteredCounselors(filtered);
  };

  const districts = [
    'Gasabo', 'Kicukiro', 'Nyarugenge',
    'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
    'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
    'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango',
    'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'
  ];

  return (
    <div className="p-6 font-sans text-gray-800 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Map Search</h1>

      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">Country</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter country"
            value={country}
            onChange={handleCountryChange}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">Office Address</label>
          <select
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={officeAddress}
            onChange={handleOfficeAddressChange}
          >
            <option value="" disabled>Select a district</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Results</h2>
        <div className="flex flex-col space-y-4">
          {filteredCounselors.length > 0 ? (
            filteredCounselors.map((counselor) => (
              <div key={counselor._id} className="flex items-center">
                <FaMapMarkerAlt className="text-xl text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-bold">{counselor.fullName}</p>
                  <p className="text-xs text-gray-500">Country: {counselor.country}</p>
                  <p className="text-xs text-gray-500">Office Address: {counselor.officeAddress}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
