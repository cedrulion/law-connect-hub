import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaSpinner, FaUser, FaFileAlt, FaExclamationTriangle,
  FaCommentAlt, FaPaperclip, FaDownload, FaArrowLeft,
  FaCheck
} from 'react-icons/fa';
import axios from 'axios';

const CaseDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/cases/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCaseData(response.data.data);
      } catch (err) {
        setError('Failed to load case details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [id]);

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const submitNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    setSubmittingNote(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/cases/note', 
        { caseId: id, text: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new note to the case data
      setCaseData({
        ...caseData,
        notes: [...caseData.notes, response.data.data]
      });
      setNewNote('');
      setSuccessMessage('Your note was added successfully.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to add your note. Please try again.');
      console.error(err);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/case')}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to cases
        </button>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Case not found or you don't have permission to view it.
        </div>
        <button
          onClick={() => navigate('/dashboard/case')}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Case
        </button>
      </div>
    );
  }

  const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'ASSIGNED': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-purple-100 text-purple-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'CLOSED': 'bg-gray-100 text-gray-800'
  };

  const urgencyColors = {
    'HIGH': 'bg-red-100 text-red-800',
    'MEDIUM': 'bg-orange-100 text-orange-800',
    'LOW': 'bg-green-100 text-green-800'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/dashboard/case')}
        className="text-blue-500 hover:text-blue-700 flex items-center mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to case
      </button>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <FaCheck className="mr-2" />
          <span>{successMessage}</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
              {caseData.title}
            </h1>
            <div className="flex items-center space-x-3">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[caseData.status]}`}>
                {caseData.status.replace('_', ' ')}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${urgencyColors[caseData.urgency]}`}>
                {caseData.urgency}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {caseData.description}
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Case Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <p className="font-medium text-gray-700">{caseData.legalCategory}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Created:</span>
                    <p className="font-medium text-gray-700">
                      {new Date(caseData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Last Updated:</span>
                    <p className="font-medium text-gray-700">
                      {new Date(caseData.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {caseData.assignedLawyer ? (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Assigned Lawyer</h2>
              <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                <div className="bg-blue-200 text-blue-700 rounded-full p-3 mr-4">
                  <FaUser className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{caseData.assignedLawyer.fullName}</h3>
                  <p className="text-sm text-gray-600">{caseData.assignedLawyer.email}</p>
                  {caseData.assignedLawyer.phone && (
                    <p className="text-sm text-gray-600">{caseData.assignedLawyer.phone}</p>
                  )}
                  {caseData.assignedLawyer.lawFirm && (
                    <p className="text-sm text-gray-600">{caseData.assignedLawyer.lawFirm}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
                <FaExclamationTriangle className="text-yellow-500 mr-3" />
                <p className="text-yellow-700">
                  Your case is pending assignment to a lawyer. We'll notify you once a lawyer is assigned.
                </p>
              </div>
            </div>
          )}
          
          {caseData.attachments && caseData.attachments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Attachments</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="divide-y divide-gray-200">
                  {caseData.attachments.map((attachment, index) => (
                    <li key={index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <FaFileAlt className="text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 truncate">
                          {attachment.split('/').pop()}
                        </span>
                      </div>
                      <a href={attachment}
                        download
                        className="text-blue-500 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaDownload />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Communication
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <form onSubmit={submitNote} className="mb-6">
                <label htmlFor="new-note" className="block text-gray-700 font-medium mb-2">
                  Add a Note
                </label>
                <textarea
                  id="new-note"
                  value={newNote}
                  onChange={handleNoteChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type your message here..."
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingNote || !newNote.trim()}
                    className={`bg-blue-500 text-white px-4 py-2 rounded-md font-medium flex items-center
                      ${(submittingNote || !newNote.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                  >
                    {submittingNote && <FaSpinner className="animate-spin mr-2" />}
                    Submit
                  </button>
                </div>
              </form>
              
              {caseData.notes && caseData.notes.length > 0 ? (
                <div className="space-y-4">
                  {caseData.notes.map((note, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-start mb-2">
                        <div className={`
                          rounded-full p-2 mr-3 flex-shrink-0
                          ${note.author.role === 'CLIENT' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                        `}>
                          <FaUser />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {note.author.fullName} ({note.author.role})
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line pl-10">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FaCommentAlt className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No messages yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailView;