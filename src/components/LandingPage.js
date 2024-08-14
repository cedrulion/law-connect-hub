import React, { useState } from 'react';
import { FaGavel, FaUserTie, FaUsers } from 'react-icons/fa';
import pic from '../Assets/pic.png';
import attorney from '../Assets/attorney.png';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="font-sans antialiased">
      {/* Header and Hero Section */}
      <header className="relative">
        <img src={pic} alt="Background" className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70">
          <div className="p-4 flex justify-between items-center">
            <div className="text-white font-bold text-xl">LawConnect Hub</div>
            <nav className="flex space-x-4">
              <a href="#" className="text-white py-2 px-4 hover:text-gray-300">Services</a>
              <a href="#" className="text-white py-2 px-4 hover:text-gray-300">Home</a>
              <div className="relative">
                <button 
                  onClick={toggleDropdown} 
                  className="bg-red-900 text-white py-2 px-4 rounded hover:bg-red-700">
                  Sign In
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                    <Link to="/login" className="block px-4 py-2 text-red-900 hover:bg-gray-100">
                      Sign in as a Client
                    </Link>
                    <Link to="/login" className="block px-4 py-2 text-red-900 hover:bg-gray-100">
                      Sign in as a Lawyer
                    </Link>
                    <Link to="/join" className="block px-4 py-2 text-red-900 hover:bg-gray-100">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
          <div className="flex flex-col justify-center items-center text-white text-center p-4 h-64 ">
            <h1 className="text-4xl font-bold mb-4">LawConnect Hub</h1>
            <p className="text-lg mb-4">Your seamless solution to match with the right expertise</p>
            <ul className="space-y-2">
              <li>Efficient Lawyer Search</li>
              <li>Enhanced Communication</li>
              <li>Transparency and Trust</li>
            </ul>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="flex justify-around p-8 bg-gray-100">
        <div className="text-center">
          <FaUserTie className="text-4xl text-red-900 mb-2" />
          <h2 className="text-2xl font-bold">200+</h2>
          <p>Lawyers</p>
        </div>
        <div className="text-center">
          <FaUsers className="text-4xl text-red-900 mb-2" />
          <h2 className="text-2xl font-bold">600+</h2>
          <p>Clients</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-red-900 text-white p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Our Services</h2>
          <p className="max-w-xl mx-auto">LawConnect Hub is an innovative software solution designed to simplify the process of finding and connecting with lawyers based on specific legal needs.</p>
        </div>
        <div className="flex justify-around">
          <div className="text-center">
            <FaGavel className="text-4xl mb-2" />
            <h3 className="text-xl font-bold">Qualified Lawyers</h3>
          </div>
          <div className="text-center">
            <FaGavel className="text-4xl mb-2" />
            <h3 className="text-xl font-bold">Convenient App</h3>
          </div>
          <div className="text-center">
            <FaGavel className="text-4xl mb-2" />
            <h3 className="text-xl font-bold">Secure & Reliable</h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-800 text-white p-8" style={{ backgroundImage: `url(${attorney})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
        <div className="relative flex justify-between">
          <div>
            <h4 className="font-bold mb-2">Contact Us</h4>
            <p>+2057018486</p>
            <p>info@lawconnect.com</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">FAQs & Support</h4>
            <a href="#" className="block hover:underline">FAQs</a>
            <a href="#" className="block hover:underline">Support</a>
          </div>
        </div>
        <div className="relative text-center mt-8">
          <p>&copy; 2024 LawConnect</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
