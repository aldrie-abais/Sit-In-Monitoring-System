import React, { useState } from 'react';

export default function SearchStudentModal({ onClose, onStudentFound }) {
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    fetch('http://localhost:8080/api/search_student.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: searchId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        onStudentFound(data.student); // Pass the data to the next modal
      } else {
        setError(data.message);
      }
    })
    .catch(err => setError("Failed to connect to server."));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Search Student</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
        </div>
        
        <form onSubmit={handleSearch} className="p-6 flex flex-col items-center">
          <input 
            type="text" 
            placeholder="Search ID..." 
            className="w-full text-center border border-slate-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#4a0080] focus:ring-1 focus:ring-[#4a0080]"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
          <button type="submit" className="bg-[#4a0080] text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-purple-900 active:scale-95 transition-all self-end">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}