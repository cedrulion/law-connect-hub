import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    barRegNo: '',
    lawFirm: '',
    officeAddress: '',
    address: '',
    yearsOfExperience: '',
    legalSpecialization: ''
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
    } else if (step === 2) {
      if (!formData.barRegNo) formErrors.barRegNo = 'Bar Registration Number is required';
      if (!formData.lawFirm) formErrors.lawFirm = 'Law Firm is required';
      if (!formData.officeAddress) formErrors.officeAddress = 'Office Address is required';
      if (!formData.address) formErrors.address = 'Address is required';
    } else if (step === 3) {
      if (!formData.yearsOfExperience) formErrors.yearsOfExperience = 'Years of Experience is required';
      if (!formData.legalSpecialization) formErrors.legalSpecialization = 'Legal Specialization is required';
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
        const response = await axios.post('/api/signup', formData);
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
              <div className="flex items-center">
                <FaCheckCircle className={`mr-2 ${step >= 2 ? 'text-blue-500' : 'text-gray-300'}`} />
                <span className={`font-semibold ${step === 2 ? 'text-blue-500' : 'text-gray-500'}`}>Expertise & Specialization</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className={`mr-2 ${step >= 3 ? 'text-blue-500' : 'text-gray-300'}`} />
                <span className={`font-semibold ${step === 3 ? 'text-blue-500' : 'text-gray-500'}`}>More Details</span>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
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
                </div>
              )}
              {step === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="barRegNo" placeholder="Bar Reg no" value={formData.barRegNo} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.barRegNo && <p className="text-red-500">{errors.barRegNo}</p>}
                  </div>
                  <div>
                    <input type="text" name="lawFirm" placeholder="Law firm" value={formData.lawFirm} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.lawFirm && <p className="text-red-500">{errors.lawFirm}</p>}
                  </div>
                  <div>
                    <input type="text" name="officeAddress" placeholder="Office address" value={formData.officeAddress} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.officeAddress && <p className="text-red-500">{errors.officeAddress}</p>}
                  </div>
                  <div>
                    <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400" />
                    {errors.address && <p className="text-red-500">{errors.address}</p>}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="yearsOfExperience" placeholder="Years of experience" value={formData.yearsOfExperience} onChange={handleChange} className="input-style" />
                    {errors.yearsOfExperience && <p className="text-red-500">{errors.yearsOfExperience}</p>}
                  </div>
                  <div>
                    <input type="text" name="legalSpecialization" placeholder="Legal specialization" value={formData.legalSpecialization} onChange={handleChange} className="input-style" />
                    {errors.legalSpecialization && <p className="text-red-500">{errors.legalSpecialization}</p>}
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button type="button" onClick={handlePrev} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-gray-400">
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-blue-400">
                    Next
                  </button>
                ) : (
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-blue-400">
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Signup;

// Tailwind CSS classes used
const inputStyle = `block w-full p-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400`;
const btnPrimary = `px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-blue-400`;
const btnSecondary = `px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-gray-400`;
