import React, { useState } from 'react';
import { FaGavel, FaUserTie, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import pic from '../Assets/pic.png';
import attorney from '../Assets/attorney.png';

function LandingPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="antialiased text-xl font-roboto">
      {/* Header and Hero Section */}
      <header className="relative">
        <img
          src={pic}
          alt="Background"
          className="w-full h-96 object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <div className="text-white font-bold text-xl">LawConnect Hub</div>
            <nav className="flex space-x-4">
              <a href="#" className="text-white py-2 px-4 hover:text-gray-300 transition-colors">
                Home
              </a>
              <a href="#" className="text-white py-2 px-4 hover:text-gray-300 transition-colors">
                Services
              </a>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="bg-red-900 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  Sign In
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-red-900 hover:bg-gray-100 transition-colors"
                    >
                      Sign in as a Client
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-red-900 hover:bg-gray-100 transition-colors"
                    >
                      Sign in as a Lawyer
                    </Link>
                    <Link
                      to="/join"
                      className="block px-4 py-2 text-red-900 hover:bg-gray-100 transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
          <div className="container mx-auto flex flex-col justify-center items-center text-white text-center p-4 h-64">
            <h1 className="text-4xl font-bold mb-4">LawConnect Hub</h1>
            <p className="text-lg mb-4 max-w-2xl">
              Your seamless solution to match with the right expertise
            </p>
            <ul className="space-y-2">
              <li>Efficient Lawyer Search</li>
              <li>Enhanced Communication</li>
              <li>Transparency and Trust</li>
            </ul>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto flex justify-around">
          <div className="text-center">
            <FaUserTie className="text-4xl text-red-900 mb-2 mx-auto" />
            <h2 className="text-2xl font-bold">200+</h2>
            <p>Lawyers</p>
          </div>
          <div className="text-center">
            <FaUsers className="text-4xl text-red-900 mb-2 mx-auto" />
            <h2 className="text-2xl font-bold">600+</h2>
            <p>Clients</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-red-900 text-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="max-w-2xl mx-auto mb-8">
            LawConnect Hub is an innovative software solution designed to simplify the process of
            finding and connecting with lawyers based on specific legal needs.
          </p>
          <div className="flex flex-wrap justify-around">
            <div className="text-center max-w-sm mb-8">
              <FaGavel className="text-4xl mb-2 mx-auto" />
              <h3 className="text-xl font-bold">Qualified Lawyers</h3>
              <p className="mt-2">Find experienced and verified legal professionals.</p>
            </div>
            <div className="text-center max-w-sm mb-8">
              <FaGavel className="text-4xl mb-2 mx-auto" />
              <h3 className="text-xl font-bold">Convenient App</h3>
              <p className="mt-2">Access legal services anytime, anywhere.</p>
            </div>
            <div className="text-center max-w-sm mb-8">
              <FaGavel className="text-4xl mb-2 mx-auto" />
              <h3 className="text-xl font-bold">Secure & Reliable</h3>
              <p className="mt-2">Your data and privacy are our top priority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative bg-gray-800 text-white py-12"
        style={{
          backgroundImage: `url(${attorney})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
        <div className="container mx-auto relative flex flex-wrap justify-between p-4">
          <div className="mb-8">
            <h4 className="font-bold mb-2">Contact Us</h4>
            <p>+2057018486</p>
            <p>info@lawconnect.com</p>
          </div>
          <div className="mb-8">
            <h4 className="font-bold mb-2">FAQs & Support</h4>
            <a href="#" className="block hover:underline">
              FAQs
            </a>
            <a href="#" className="block hover:underline">
              Support
            </a>
          </div>
        </div>
        <div className="relative text-center mt-8">
          <p>&copy; 2024 LawConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;