import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const JoinClient = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    role:"",
    areasOfLaw: [], // Assuming this will be an array of strings
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let formErrors = {};
    if (step === 1) {
      if (!formData.fullName) formErrors.fullName = 'Full Name is required';
      if (!formData.email) formErrors.email = 'Email is required';
      if (!formData.phone) formErrors.phone = 'Phone is required';
      if (!formData.country) formErrors.country = 'Country is required';
      if (!formData.password) formErrors.password = 'Password is required';
      if (!formData.confirmPassword) formErrors.confirmPassword = 'Confirm Password is required';
      if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = 'Passwords do not match';
      if (!formData.areasOfLaw) formErrors.areasOfLaw = 'At least one Area of Law is required';
      if (!formData.role) formErrors.role = 'role is required';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
        console.log('Signup successful', response.data);
      } catch (error) {
        console.error('There was an error signing up!', error);
      }
    }
  };

  return (
    <div className="">
      <header className="p-4 flex justify-between items-center bg-white shadow-md">
        <div className="text-red-800 font-bold text-xl">LawConnect</div>
        <nav className="flex space-x-4 font-semibold">
          <Link to="/services" className="text-red-900 hover:text-red-600">Services</Link>
          <Link to="/help" className="text-red-900 hover:text-red-600">Help</Link>
        </nav>
      </header>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className=" p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-8 col-span-1">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center">
                  <FaCheckCircle className={`mr-2 ${step >= 1 ? 'text-blue-500' : 'text-gray-300'}`} />
                  <span className={`font-semibold ${step === 1 ? 'text-blue-500' : 'text-gray-500'}`}>Personal Details</span>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.country && <p className="text-red-500">{errors.country}</p>}
                  </div>
              
                      <div>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                      </div>
                      <div>
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                      </div>
                      <div>
                        <input type="text" name="areasOfLaw" placeholder="Areas of Law (comma-separated)" value={formData.areasOfLaw} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                        {errors.areasOfLaw && <p className="text-red-500">{errors.areasOfLaw}</p>}
                      </div>
                    <div>
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400"
  >
    <option value="" disabled>Select Role</option>
    <option value="CLIENT">Client</option>
    <option value="LAWYER">Lawyer</option>
  </select>
  {errors.role && <p className="text-red-500">{errors.role}</p>}
</div>

                </div>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-blue-400">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClient;
