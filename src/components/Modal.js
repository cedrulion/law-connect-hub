import React from 'react';
import { FaTimes, FaUserAlt, FaEnvelope, FaPhone, FaBuilding, FaCertificate, FaLanguage, FaDollarSign, FaBriefcase, FaMapMarkerAlt,FaCalendarAlt } from 'react-icons/fa';

const Modal = ({ show, onClose, counselor, onRequestAppointment }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg relative w-3/4 max-w-3xl">
        <button className="absolute top-2 right-2 text-gray-500 bg-red-800 hover:text-gray-800" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Counselor Details</h2>
        <div className="grid grid-cols-3 space-y-4">
          <div className="flex items-center">
            <FaUserAlt className="text-gray-600 mr-2" />
            <p><strong>Full Name:</strong> {counselor.fullName}</p>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-gray-600 mr-2" />
            <p><strong>Email:</strong> {counselor.email}</p>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-gray-600 mr-2" />
            <p><strong>Phone:</strong> {counselor.phone}</p>
          </div>
          <div className="flex items-center">
            <FaBuilding className="text-gray-600 mr-2" />
            <p><strong>Law Firm:</strong> {counselor.lawFirm}</p>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-600 mr-2" />
            <p><strong>Office Address:</strong> {counselor.officeAddress}</p>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-600 mr-2" />
            <p><strong>Address:</strong> {counselor.address}</p>
          </div>
          <div className="flex items-center">
            <FaBriefcase className="text-gray-600 mr-2" />
            <p><strong>Years of Experience:</strong> {counselor.yearsOfExperience}</p>
          </div>
          <div className="flex items-center">
            <FaCertificate className="text-gray-600 mr-2" />
            <p><strong>Certificate:</strong> {counselor.certificate}</p>
          </div>
          <div className="flex items-center">
            <FaBuilding className="text-gray-600 mr-2" />
            <p><strong>Previous Law Firm:</strong> {counselor.previousLawFirm}</p>
          </div>
          <div className="flex items-center">
            <FaBuilding className="text-gray-600 mr-2" />
            <p><strong>Membership:</strong> {counselor.membership}</p>
          </div>
          <div className="flex items-center">
            <FaBriefcase className="text-gray-600 mr-2" />
            <p><strong>Portfolio:</strong> {counselor.portfolio}</p>
          </div>
          <div className="flex items-center">
            <FaLanguage className="text-gray-600 mr-2" />
            <p><strong>Languages:</strong> {counselor.languages.join(', ')}</p>
          </div>
          <div className="flex items-center">
            <FaDollarSign className="text-gray-600 mr-2" />
            <p><strong>Fee Per Hour:</strong> ${counselor.feePerHour}</p>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-600 mr-2" />
            <p><strong>Availability:</strong> {counselor.availability}</p>
          </div>
        </div>
       <button
          className="mt-4 bg-blue-600 text-white p-2 rounded shadow-md"
          onClick={() => onRequestAppointment(counselor)}
        >
          Request Appointment
        </button>
      </div>
    </div>
  );
};

export default Modal;
