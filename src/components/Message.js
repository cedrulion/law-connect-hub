import React, { useState, useEffect } from 'react';
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const Message = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchMessages(selectedClient);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/messages',
        {
          sender: currentUser._id,
          receiver: selectedClient,
          content: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages([...messages, response.data.newMessage]);
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 font-sans text-gray-800 bg-gray-100 min-h-screen flex">
      <div className="w-1/4 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Messages Center</h2>
        <button className="w-full bg-black text-white p-2 rounded shadow-md flex items-center justify-center mb-4">
          <FaPlus className="mr-2" />
          New Message
        </button>
        <div>
          <p className="font-bold mb-2">Direct Messages</p>
          {clients.map(client => (
            <div
              key={client._id}
              className={`flex items-center p-2 rounded mb-2 cursor-pointer ${selectedClient === client._id ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setSelectedClient(client._id)}
            >
              <FaUserCircle className="text-2xl" />
              <p className="ml-2">{client.fullName}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white p-6 rounded shadow-md ml-6 flex flex-col">
        {selectedClient ? (
          <div className="flex flex-col h-full">
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((msg) => (
      <div key={msg._id} className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs p-3 rounded-lg shadow-md ${msg.sender === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'}`}>
          <p>{msg.content}</p>
        </div>
      </div>
    ))}
  </div>
  <div className="p-4 flex items-center border-t border-gray-200">
    <input
      type="text"
      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Type a message..."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
    />
    <button className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center" onClick={handleSendMessage}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-9.193 3.32a1 1 0 01-1.252-1.252l3.32-9.193A9.995 9.995 0 1121.74 21.74a9.996 9.996 0 01-7.988-10.572z" />
      </svg>
      <span className="ml-1">Send</span>
    </button>
  </div>
</div>

        ) : (
          <div className="text-center">
            <p className="text-xl">Select a client to open your messages with them</p>
            <p className="text-4xl mt-4">⬅️</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
