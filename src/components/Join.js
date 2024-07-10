import React from 'react';
import { FaUserTie, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Join() {
  return (
    <div className="font-sans antialiased bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white shadow-md">
        <div className="text-red-800 font-bold text-xl">LawConnect</div>
        <nav className="flex space-x-4 font-semibold">
          <Link to="/services" className="text-red-900 hover:text-red-600">Services</Link>
          <Link to="/help" className="text-red-900 hover:text-red-600">Help</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-red-900 text-white p-8 rounded-lg shadow-lg text-center">
          <div className="flex justify-between gap-9 mb-4 p-8">
            <div className="bg-red-900 text-white py-2 px-4 rounded hover:bg-gray-200 flex flex-col items-center border border-white">
              <FaUserTie className="text-4xl mb-2" />
              <Link to="/join-lawyer" className="">
                Join as a lawyer
              </Link>
            </div>
            <div className="bg-red-900 text-white py-2 px-4 rounded hover:bg-gray-200 flex flex-col items-center border border-white">
              <FaMoneyBillWave className="text-4xl mb-2" />
              <Link to="/join-client" className="">
                Join as a client
              </Link>
            </div>
          </div>
          <p className="mt-4">
            Or <Link to="/signin" className="text-blue-500 hover:underline">Sign In?</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Join;
