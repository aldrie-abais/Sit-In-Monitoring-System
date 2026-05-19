import React, { useState, useEffect } from 'react';

export default function SitInFormModal({ student, onClose, onSuccess }) {
  const [purpose, setPurpose] = useState('');
  const [lab, setLab] = useState('');
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const isDark = localStorage.getItem('isDark') === 'true';

  const [softwares, setSoftwares] = useState([]);
  const [labsList, setLabsList] = useState([]);
  const [pcs, setPcs] = useState([]);
  const [selectedPcs, setSelectedPcs] = useState([]); // Array of pc_ids

  const labOptions = ['524', '526', '528', '530', '542', '544'];
  const selectedLabObj = labsList.find(l => l.name === `Lab - ${lab}` || l.name === lab);

  const activeSoftwaresForLab = selectedLabObj
    ? softwares.filter(sw => sw.labs.includes(selectedLabObj.name))
    : [];

  const purposeOptions = selectedLabObj
    ? (activeSoftwaresForLab.length > 0 
        ? activeSoftwaresForLab.map(sw => sw.name) 
        : ['No purposes available'])
    : [];

  const filteredPurposes = purposeOptions
    .filter((item) => item.toLowerCase().includes(purpose.toLowerCase()))
    .slice(0, 5);

  const filteredLabs = labOptions
    .filter((item) => item.toLowerCase().includes(lab.toLowerCase()))
    .slice(0, 5);

  useEffect(() => {
    fetch('http://localhost:8080/api/get_labs.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLabsList(data.data);
        }
      })
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/get_softwares.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSoftwares(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedLabObj) {
      fetch('http://localhost:8080/api/get_pcs_by_lab.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lab_id: selectedLabObj.id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPcs(data.data);
          setSelectedPcs([]); // Reset selection when lab changes
        }
      })
      .catch(err => console.error(err));
      setPurpose(''); // Clear purpose input when lab changes
    } else {
      setPcs([]);
      setSelectedPcs([]);
      setPurpose('');
    }
  }, [selectedLabObj]);

  const togglePcSelection = (pcId) => {
    setSelectedPcs(prev => {
      if (prev.includes(pcId)) {
        return prev.filter(id => id !== pcId);
      } else {
        return [...prev, pcId];
      }
    });
  };

  const handleSitIn = () => {
    if (!purpose || !lab) {
      alert("Please select a Purpose and fill in the Lab field.");
      return;
    }

    if (!labOptions.includes(lab)) {
      alert('Please select a valid lab from the dropdown list.');
      return;
    }

    if (pcs.length > 0 && selectedPcs.length === 0) {
      alert("Please select at least one PC for the student.");
      return;
    }

    fetch('http://localhost:8080/api/sit_in.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: student.user_id,
        purpose: purpose,
        lab: lab,
        pc_ids: selectedPcs
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

  // Determine the CSS grid dimensions for the PC modal
  const maxCol = pcs.length > 0 ? Math.max(...pcs.map(pc => Math.ceil(pc.pc_number / 7)), 7) : 7;
  let gridCols = [];
  for (let c = 1; c <= maxCol; c++) {
      gridCols.push('minmax(0, 1fr)');
      if (c % 2 === 0 && c !== maxCol) {
          gridCols.push('1.5rem'); // Spacing column
      }
  }
  const pcGridTemplate = gridCols.join(' ');
  const getVisualCol = (col) => col + Math.floor((col - 1) / 2);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-100 p-4 backdrop-blur-sm ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`}>
      <div className={`w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${selectedLabObj && pcs.length > 0 ? 'max-w-3xl' : 'max-w-lg'} ${isDark ? 'bg-[#1e0838] border border-purple-500/20' : 'bg-white'}`}>
        <div className={`flex justify-between items-center px-6 py-4 border-b ${isDark ? 'bg-[#1e0838] border-purple-500/20' : 'bg-white border-slate-200'}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-[#c89b2a]' : 'text-slate-800'}`}>Sit In Form</h2>
          <button onClick={onClose} className={`font-bold text-xl ${isDark ? 'text-purple-400 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}>✕</button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center">
            <label className={`w-1/3 text-sm font-semibold text-right pr-4 ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>ID Number:</label>
            <input type="text" value={student.user_id} disabled className={`w-2/3 border rounded px-3 py-2 text-sm ${isDark ? 'bg-white/5 border-purple-500/10 text-purple-300' : 'border-slate-200 bg-slate-50 text-slate-500'}`} />
          </div>
          <div className="flex items-center">
            <label className={`w-1/3 text-sm font-semibold text-right pr-4 ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Student Name:</label>
            <input type="text" value={`${student.user_first_name} ${student.user_last_name}`} disabled className={`w-2/3 border rounded px-3 py-2 text-sm ${isDark ? 'bg-white/5 border-purple-500/10 text-purple-300' : 'border-slate-200 bg-slate-50 text-slate-500'}`} />
          </div>
          
          <div className="flex items-center">
            <label className={`w-1/3 text-sm font-semibold text-right pr-4 ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Purpose:</label>
            <div className="w-2/3 relative">
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                onFocus={() => setShowPurposeDropdown(true)}
                onBlur={() => setTimeout(() => setShowPurposeDropdown(false), 120)}
                placeholder={selectedLabObj ? (activeSoftwaresForLab.length === 0 ? "No purposes available" : "Type or select purpose...") : "Select a lab first..."}
                disabled={!selectedLabObj || activeSoftwaresForLab.length === 0}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40 focus:border-[#c89b2a] disabled:bg-white/3 disabled:text-purple-400' : 'border-slate-300 bg-white focus:border-[#4a0080] disabled:bg-slate-100 disabled:text-slate-400'}`}
              />
              {showPurposeDropdown && filteredPurposes.length > 0 && selectedLabObj && activeSoftwaresForLab.length > 0 && (
                <div className={`absolute left-0 right-0 mt-1 border rounded-md shadow-lg z-30 overflow-hidden ${isDark ? 'bg-[#1e0838] border-purple-500/20' : 'bg-white border-slate-200'}`}>
                  {filteredPurposes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={() => {
                        setPurpose(item);
                        setShowPurposeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${isDark ? 'text-purple-200 hover:bg-white/5' : 'hover:bg-slate-50'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <label className={`w-1/3 text-sm font-semibold text-right pr-4 ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Lab:</label>
            <div className="w-2/3 relative">
              <input
                type="text"
                value={lab}
                onChange={e => setLab(e.target.value)}
                onFocus={() => setShowLabDropdown(true)}
                onBlur={() => setTimeout(() => setShowLabDropdown(false), 120)}
                placeholder="Select lab..."
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40 focus:border-[#c89b2a]' : 'border-slate-300 focus:border-[#4a0080]'}`}
              />
              {showLabDropdown && filteredLabs.length > 0 && (
                <div className={`absolute left-0 right-0 mt-1 border rounded-md shadow-lg z-30 overflow-hidden ${isDark ? 'bg-[#1e0838] border-purple-500/20' : 'bg-white border-slate-200'}`}>
                  {filteredLabs.map((room) => (
                    <button
                      key={room}
                      type="button"
                      onMouseDown={() => {
                        setLab(room);
                        setShowLabDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${isDark ? 'text-purple-200 hover:bg-white/5' : 'hover:bg-slate-50'}`}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <label className={`w-1/3 text-sm font-semibold text-right pr-4 ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Remaining Session:</label>
            <input type="text" value={student.remaining_sessions} disabled className={`w-2/3 border rounded px-3 py-2 text-sm ${isDark ? 'bg-white/5 border-purple-500/10 text-purple-300' : 'border-slate-200 bg-slate-50 text-slate-500'}`} />
          </div>

          {/* PC Selection Grid */}
          {selectedLabObj && pcs.length > 0 && (
            <div className={`flex flex-col mt-4 border-t pt-4 ${isDark ? 'border-purple-500/10' : 'border-slate-100'}`}>
              <label className={`text-sm font-semibold mb-2 ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>Select PC(s) for the student:</label>
              
              <div className={`p-4 border rounded-xl overflow-x-auto custom-scrollbar ${isDark ? 'bg-[#0f0520] border-purple-500/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="grid gap-2" style={{ gridTemplateColumns: pcGridTemplate, minWidth: '600px' }}>
                  {pcs.map(pc => {
                      const virtualCol = Math.ceil(pc.pc_number / 7);
                      const virtualRow = ((pc.pc_number - 1) % 7) + 1;
                      
                      const isSelected = selectedPcs.includes(pc.id);
                      
                      let bgClass = '';
                      let disabled = false;
                      
                      if (pc.status === 'Occupied') {
                          bgClass = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed';
                          disabled = true;
                      } else if (pc.status === 'On-Maintenance') {
                          bgClass = 'bg-red-50 border-red-200 text-red-300 cursor-not-allowed';
                          disabled = true;
                      } else {
                          // Available
                          bgClass = isSelected
                              ? 'bg-purple-100 border-[#4a0080] text-[#4a0080] shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-[#4a0080]/30 hover:bg-slate-50/50';
                      }

                      return (
                          <button 
                              key={pc.id}
                              type="button"
                              disabled={disabled}
                              onClick={() => togglePcSelection(pc.id)}
                              className={`p-2 rounded-lg border-2 flex flex-col items-center justify-center aspect-square transition-all relative overflow-hidden text-[10px] font-bold ${bgClass}`}
                              style={{ gridColumn: getVisualCol(virtualCol), gridRow: virtualRow }}
                          >
                              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                              </svg>
                              <span>PC {pc.pc_number}</span>
                              <span className="text-[7px] uppercase tracking-wider opacity-75 font-semibold mt-0.5">
                                  {isSelected ? 'Selected' : pc.status}
                              </span>
                          </button>
                      );
                  })}
                </div>
              </div>
              
              <div className={`flex gap-4 mt-3 justify-center text-[10px] font-semibold ${isDark ? 'text-purple-400' : 'text-slate-500'}`}>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-white border border-slate-300"></div>Available</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-purple-100 border border-[#4a0080]"></div>Selected</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200"></div>Occupied</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-red-50 border border-red-200"></div>Maintenance</div>
              </div>
            </div>
          )}
        </div>

        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDark ? 'bg-[#0f0520] border-purple-500/20' : 'bg-slate-50 border-slate-100'}`}>
          <button onClick={onClose} className={`px-5 py-2 rounded shadow-sm font-medium transition-colors ${isDark ? 'bg-white/10 text-purple-200 hover:bg-white/15' : 'bg-slate-500 text-white hover:bg-slate-600'}`}>
            Close
          </button>
          <button onClick={handleSitIn} className="bg-[#4a0080] text-white px-5 py-2 rounded shadow-sm hover:bg-purple-900 font-medium transition-colors">
            Sit In
          </button>
        </div>
      </div>
    </div>
  );
}