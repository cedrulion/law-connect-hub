import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modall = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg relative w-3/4 max-w-md">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modall;
