import React, { useState } from 'react';

export default function SitInFormModal({ student, onClose, onSuccess }) {
  const [purpose, setPurpose] = useState('');
  const [lab, setLab] = useState('');
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [showLabDropdown, setShowLabDropdown] = useState(false);

  const purposeOptions = [
    'C Programming',
    'Java Programming',
    'Project Making',
    'JavaScript Programming',
    'C# Programming'
  ];

  const labOptions = ['524', '526', '528', '530', '542', '544'];

  const filteredPurposes = purposeOptions
    .filter((item) => item.toLowerCase().includes(purpose.toLowerCase()))
    .slice(0, 5);

  const filteredLabs = labOptions
    .filter((item) => item.toLowerCase().includes(lab.toLowerCase()))
    .slice(0, 5);

  const handleSitIn = () => {
    if (!purpose || !lab) {
      alert("Please select a Purpose and fill in the Lab field.");
      return;
    }

    if (!labOptions.includes(lab)) {
      alert('Please select a valid lab from the dropdown list.');
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
    <div className="fixed inset-0 flex items-center justify-center z-100 p-4 bg-slate-900/60 backdrop-blur-sm">
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
          
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-semibold text-slate-600 text-right pr-4">Purpose:</label>
            <div className="w-2/3 relative">
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                onFocus={() => setShowPurposeDropdown(true)}
                onBlur={() => setTimeout(() => setShowPurposeDropdown(false), 120)}
                placeholder="Type or select purpose..."
                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a0080]"
              />
              {showPurposeDropdown && filteredPurposes.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 border border-slate-200 bg-white rounded-md shadow-lg z-30 overflow-hidden">
                  {filteredPurposes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={() => {
                        setPurpose(item);
                        setShowPurposeDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-semibold text-slate-600 text-right pr-4">Lab:</label>
            <div className="w-2/3 relative">
              <input
                type="text"
                value={lab}
                onChange={e => setLab(e.target.value)}
                onFocus={() => setShowLabDropdown(true)}
                onBlur={() => setTimeout(() => setShowLabDropdown(false), 120)}
                placeholder="Select lab..."
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a0080]"
              />
              {showLabDropdown && filteredLabs.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 border border-slate-200 bg-white rounded-md shadow-lg z-30 overflow-hidden">
                  {filteredLabs.map((room) => (
                    <button
                      key={room}
                      type="button"
                      onMouseDown={() => {
                        setLab(room);
                        setShowLabDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      {room}
                    </button>
                  ))}
                </div>
              )}
            </div>
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