// NewCaseForm.js
import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaPaperclip, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const NewCaseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    legalCategory: '',
    urgency: 'MEDIUM',
    attachments: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const legalCategories = [
    'Family Law',
    'Criminal Law',
    'Civil Litigation',
    'Corporate Law',
    'Real Estate',
    'Intellectual Property',
    'Immigration',
    'Employment Law',
    'Tax Law',
    'Other'
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Retrieved Token:', storedToken);
    setToken(storedToken);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.legalCategory) newErrors.legalCategory = 'Please select a legal category';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const uploadedFileUrls = files.map(file => URL.createObjectURL(file));

      const caseData = {
        ...formData,
        attachments: uploadedFileUrls
      };

      console.log("Submitting Data:", caseData);

      const response = await axios.post(
        'http://localhost:5000/api/cases',
        caseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        // Show success message
        setSuccessMessage('Your case was submitted successfully!');
        // Clear form and files
        setFormData({
          title: '',
          description: '',
          legalCategory: '',
          urgency: 'MEDIUM',
          attachments: []
        });
        setFiles([]);
      }

    } catch (err) {
      console.error(err);
      setErrors(prevErrors => ({
        ...prevErrors,
        submit: err.response?.data?.message || 'Failed to submit your case. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Request Legal Assistance</h1>

      {/* Success Toast */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaCheck className="mr-2" />
          <span>{successMessage}</span>
          <button
            className="ml-auto text-green-700 hover:text-green-900"
            onClick={() => setSuccessMessage('')}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Submission Error */}
      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{errors.submit}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white flex gap-4 rounded-lg shadow-md p-8 text-gray-800">
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Case Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title describing your legal issue"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Detailed Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Please provide a detailed explanation of your legal issue..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label htmlFor="legalCategory" className="block text-gray-700 font-medium mb-2">
              Legal Category*
            </label>
            <select
              id="legalCategory"
              name="legalCategory"
              value={formData.legalCategory}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.legalCategory ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {legalCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.legalCategory && <p className="mt-1 text-sm text-red-600">{errors.legalCategory}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Urgency Level
            </label>
            <div className="flex space-x-4">
              {['LOW', 'MEDIUM', 'HIGH'].map(level => (
                <label key={level} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2
                    ${formData.urgency === level 
                      ? level === 'HIGH' 
                        ? 'border-red-500 bg-red-500' 
                        : level === 'MEDIUM' 
                          ? 'border-orange-500 bg-orange-500' 
                          : 'border-green-500 bg-green-500'
                      : level === 'HIGH' 
                        ? 'border-red-300' 
                        : level === 'MEDIUM' 
                          ? 'border-orange-300' 
                          : 'border-green-300'
                    }
                  `}>
                    {formData.urgency === level && <FaCheck className="text-white text-sm" />}
                  </div>
                  <span className={`
                    ${level === 'HIGH' 
                      ? 'text-red-600' 
                      : level === 'MEDIUM' 
                        ? 'text-orange-600' 
                        : 'text-green-600'
                    }
                  `}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <FaPaperclip className="text-gray-400 text-3xl mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload documents, images, or other relevant files
                </span>
                <span className="mt-1 text-xs text-gray-400">
                  (PDF, DOC, JPG, PNG files are supported)
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li 
                      key={index} 
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                    >
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  legalCategory: '',
                  urgency: 'MEDIUM',
                  attachments: []
                });
                setFiles([]);
                setErrors({});
                setSuccessMessage('');
              }}
              className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-6 py-2 rounded-md font-medium flex items-center
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
              Submit Case
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCaseForm;
