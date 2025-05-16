// AddNoteModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const AddNoteModal = ({ caseId, isOpen, onClose, onNoteAdded }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/cases/note',
        { caseId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Call the parent callback with the newly added note
      onNoteAdded(response.data.data);

      // Reset and close the modal
      setText('');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to add note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Add Note</h2>
        {error && (
          <div className="mb-4 text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md mb-4"
            placeholder="Enter your note here..."
            rows="4"
            required
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                'Save Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
