import React, { useState } from 'react';

export default function SitInFormModal({ student, onClose, onSuccess }) {
  // Initialize purpose as an empty string so the "Select Purpose..." placeholder shows first
  const [purpose, setPurpose] = useState('');
  const [lab, setLab] = useState('');

  const handleSitIn = () => {
    if (!purpose || !lab) {
      alert("Please select a Purpose and fill in the Lab field.");
      return;
    }

    fetch('http://localhost:8080/api/sit_in.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: student.user_id,
        purpose: purpose,
        lab: lab 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert(data.message);
        onSuccess(); // Close modal and refresh dashboard
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Sit In Form</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-semibold text-slate-600 text-right pr-4">ID Number:</label>
            <input type="text" value={student.user_id} disabled className="w-2/3 border border-slate-200 bg-slate-50 rounded px-3 py-2 text-sm text-slate-500" />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-semibold text-slate-600 text-right pr-4">Student Name:</label>
            <input type="text" value={`${student.user_first_name} ${student.user_last_name}`} disabled className="w-2/3 border border-slate-200 bg-slate-50 rounded px-3 py-2 text-sm text-slate-500" />
          </div>
          
          {/* UPDATED PURPOSE DROPDOWN */}
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-semibold text-slate-600 text-right pr-4">Purpose:</label>
            <select 
              value={purpose} 
              onChange={e => setPurpose(e.target.value)} 
              className="w-2/3 border border-slate-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a0080]"
            >
              <option value="" disabled>Select Purpose...</option>
              <option value="C Programming">C Programming</option>
              <option value="Java Programming">Java Programming</option>
              <option value="Project Making">Project Making</option>
              <option value="JavaScript Programming">JavaScript Programming</option>
              <option value="C# Programming">C# Programming</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-semibold text-slate-600 text-right pr-4">Lab:</label>
            <input type="text" value={lab} onChange={e => setLab(e.target.value)} placeholder="e.g., 524" className="w-2/3 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a0080]" />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-semibold text-slate-600 text-right pr-4">Remaining Session:</label>
            <input type="text" value={student.remaining_sessions} disabled className="w-2/3 border border-slate-200 bg-slate-50 rounded px-3 py-2 text-sm text-slate-500" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="bg-slate-500 text-white px-5 py-2 rounded shadow-sm hover:bg-slate-600 font-medium transition-colors">
            Close
          </button>
          <button onClick={handleSitIn} className="bg-[#007bff] text-white px-5 py-2 rounded shadow-sm hover:bg-blue-700 font-medium transition-colors">
            Sit In
          </button>
        </div>
      </div>
    </div>
  );
}