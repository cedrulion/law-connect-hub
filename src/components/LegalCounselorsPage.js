import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modall from './Modall';
import './styles.css';
import AppointmentForm from './AppointmentForm';
import { FaEye} from 'react-icons/fa';

const LegalCounselorsPage = () => {
  const [legalCounselors, setLegalCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLegalCounselors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/legal-counselors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLegalCounselors(response.data);
      } catch (error) {
        console.error('Error fetching legal counselors:', error);
      }
    };

    fetchLegalCounselors();
  }, [token]);

  const handleCounselorClick = (counselor) => {
    setSelectedCounselor(counselor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCounselor(null);
  };

  return (
     <div className="p-6 font-sans text-gray-800 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Legal Counselors</h1>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {legalCounselors.map((counselor, index) => (
    <div
      key={index}
      className="relative p-6 bg-white rounded-xl shadow-lg cursor-pointer group hover:bg-gray-50 transition duration-300 transform hover:scale-105"
      onClick={() => handleCounselorClick(counselor)}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-600 text-white text-3xl font-bold rounded-full flex items-center justify-center mb-4">
          {counselor.fullName.charAt(0).toUpperCase()}
        </div>
        <p className="text-xl font-semibold text-gray-800 mb-2">{counselor.fullName}</p>
        <div className="bg-gray-200 text-gray-600 rounded-full px-3 py-1 text-sm font-medium mb-4">
          <FaEye className="inline mr-2" /> View and request
        </div>
      </div>
      <div className="hidden group-hover:grid  grid-cols-2 mt-4 text-sm text-gray-600 bg-gray-100 p-4 rounded-lg shadow-inner">
        <p className="text-sm ">{counselor.fullName}</p>
         <p className="text-sm">{counselor.email}</p>
         <p className="text-sm">{counselor.phone}</p>
         <p className="text-sm ">{counselor.address}</p>
        <p><strong>Country:</strong> {counselor.country}</p>
        <p><strong>Areas of Law:</strong> {counselor.areasOfLaw.join(', ')}</p>
        <p><strong>Law Firm:</strong> {counselor.lawFirm}</p>
        <p><strong>Years of Experience:</strong> {counselor.yearsOfExperience}</p>
        <p><strong>Fee per Hour:</strong> ${counselor.feePerHour}</p>
      </div>
    </div>
  ))}
</div>

      {showModal && (
        <Modall show={showModal} onClose={closeModal}>
          <AppointmentForm counselor={selectedCounselor} onClose={closeModal} />
        </Modall>
      )}
    </div>
  );
};

export default LegalCounselorsPage;
