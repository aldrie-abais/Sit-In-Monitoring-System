import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../components/modal/EditProfileModal';
import NotificationDropdown from '../components/NotificationDropdown';
import AnnouncementDropdown from '../components/modal/AnnouncementDropdown';
import LogoutModal from '../components/modal/LogoutModal';

export default function Reservation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true');

  useEffect(() => {
    localStorage.setItem('isDark', isDark);
  }, [isDark]);

  // Labs & PCs states
  const [labs, setLabs] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showPcModal, setShowPcModal] = useState(false);
  const [labPcs, setLabPcs] = useState([]);
  const [selectedPcIds, setSelectedPcIds] = useState([]);
  const [confirmedPcIds, setConfirmedPcIds] = useState([]);

  // Form states
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  // Requests states
  const [requests, setRequests] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchLabs = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_labs.php`)
      .then(res => res.json())
      .then(data => { if (data.success) setLabs(data.data); })
      .catch(err => console.error(err));
  };

  const fetchSoftwares = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_softwares.php`)
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setSoftwares(data.data); })
      .catch(err => console.error(err));
  };

  const fetchReservations = () => {
    if (user && user.user_id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/get_reservations.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id })
      })
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setRequests(data.reservations); })
      .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchLabs();
    fetchSoftwares();
    fetchReservations();
  }, []);

  const handleLogout = (feedback) => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.user_id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/logout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: savedUser.user_id, feedback: feedback || '' })
      }).catch(err => console.error(err));
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  const openPcModal = (lab) => {
    if (!lab.is_available) return; // double check

    if (selectedLab?.id !== lab.id) {
        setSelectedPcIds([]);
        setConfirmedPcIds([]);
        setPurpose('');
        setDate('');
        setTime('');
    }
    setSelectedLab(lab);
    
    // Fetch PCs for this lab
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_pcs_by_lab.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lab_id: lab.id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setLabPcs(data.data);
            // Pre-select already confirmed PCs if returning to the same lab modal
            if (selectedLab?.id === lab.id) {
                setSelectedPcIds(confirmedPcIds);
            }
            setShowPcModal(true);
        }
    })
    .catch(err => console.error(err));
  };

  const togglePc = (pc_id) => {
    if (selectedPcIds.includes(pc_id)) {
        setSelectedPcIds(prev => prev.filter(id => id !== pc_id));
    } else {
        setSelectedPcIds(prev => [...prev, pc_id]);
    }
  };

  const confirmPcs = () => {
    setConfirmedPcIds(selectedPcIds);
    setShowPcModal(false);
  };

  const handleReservation = (e) => {
    e.preventDefault();
    if (!user || !user.user_id || !selectedLab || confirmedPcIds.length === 0) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/create_reservation.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.user_id,
            lab: selectedLab.name.replace('Lab - ', ''),
            purpose: purpose,
            date: date,
            time: time,
            pc_ids: confirmedPcIds
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            setMessage('Your reservation request has been submitted successfully!');
            setPurpose('');
            setDate('');
            setTime('');
            setConfirmedPcIds([]);
            setSelectedPcIds([]);
            setSelectedLab(null);
            fetchReservations();
        } else {
            setMessage('Error: ' + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        setMessage('Failed to submit reservation.');
    });
    
    setTimeout(() => setMessage(''), 5000);
  };

  const openDetailModal = (req) => {
    setSelectedRequest(req);
    setShowDetailModal(true);
  };

  // Determine the CSS grid dimensions for the PC modal (frontend overriding to 7 rows per col)
  const maxCol = Math.max(...labPcs.map(pc => Math.ceil(pc.pc_number / 7)), 7);
  const labNumber = selectedLab ? selectedLab.name.replace('Lab - ', '') : '';

  // Generate grid template columns with gaps after every 2nd column
  let gridCols = [];
  for (let c = 1; c <= maxCol; c++) {
      gridCols.push('minmax(0, 1fr)');
      if (c % 2 === 0 && c !== maxCol) {
          gridCols.push('2.5rem'); // Add a wide spacer column between major groups
      }
  }
  const pcGridTemplate = gridCols.join(' ');

  const getVisualCol = (col) => col + Math.floor((col - 1) / 2);

  return (
    <div className={`min-h-screen w-full font-sans flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f0520] text-purple-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* NAVIGATION BAR */}
      <nav className={`w-full sticky top-0 z-50 flex justify-between items-center px-6 py-3 shadow-sm border-b transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-white' : 'bg-white/80 border-slate-200 text-slate-800'}`}>
        <div className={`text-xl font-serif font-bold tracking-wide ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>
          Dashboard
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <NotificationDropdown />
          <AnnouncementDropdown />
          <Link to="/dashboard" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'} transition-colors`}>Home</Link>
          
          <button onClick={() => setShowEditProfile(true)} className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'} transition-colors font-medium text-sm`}>
            Edit Profile
          </button>

          <Link to="/history" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'} transition-colors`}>History</Link>
          
          <span className={`${isDark ? 'text-[#c89b2a] border-[#c89b2a]' : 'text-[#4a0080] border-[#4a0080]'} border-b-2 pb-1 cursor-default`}>Reservation</span>
          
          <button 
            onClick={() => setIsDark(!isDark)} 
            className={`text-xl p-2 rounded-full transition-all duration-200 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-slate-600'}`} 
            title="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button onClick={() => setShowLogoutModal(true)} className="bg-[#c89b2a] text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-amber-600 transition-all shadow-md active:scale-95 inline-flex items-center gap-2.5">        
           <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
          </svg>  
            Log out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Lab Reservation</h2>
          <p className={isDark ? 'text-purple-300' : 'text-slate-500'}>Select an available laboratory to reserve your PCs.</p>
        </div>
        
        {message && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-fade-in-down w-full">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="font-medium text-sm">{message}</span>
            </div>
        )}

        {/* STEP 1: Lab Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {labs.map(lab => {
              const isSelected = selectedLab?.id === lab.id;
              // lab.is_available could be string "1" or true, convert to boolean safely
              const isAvail = lab.is_available == true; 
              
              return (
                <div 
                  key={lab.id} 
                  onClick={() => isAvail ? openPcModal(lab) : null}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isAvail 
                      ? (isSelected 
                          ? (isDark ? 'border-[#c89b2a] bg-[#c89b2a]/10 shadow-md cursor-pointer' : 'border-[#4a0080] bg-[#4a0080]/5 shadow-md cursor-pointer')
                          : (isDark ? 'border-purple-500/20 bg-[#1e0838]/80 hover:border-[#c89b2a]/50 hover:shadow-md cursor-pointer' : 'border-slate-200 bg-white hover:border-[#4a0080]/50 hover:shadow-md cursor-pointer')
                        ) 
                      : (isDark ? 'border-purple-500/10 bg-[#1e0838]/40 opacity-60 cursor-not-allowed' : 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed')
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-lg ${isSelected ? (isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]') : (isDark ? 'text-purple-100' : 'text-slate-800')}`}>{lab.name}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isAvail ? 'bg-green-100 text-green-700' : (isDark ? 'bg-white/10 text-purple-300' : 'bg-slate-200 text-slate-500')}`}>
                      {isAvail ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Total PCs: {lab.total_pcs}</p>
                  
                  {/* Part 1: Display Available Softwares */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex-1 flex flex-col justify-end">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Available Software:</span>
                    <div className="flex flex-wrap gap-1">
                      {softwares.filter(sw => sw.labs.includes(lab.name)).length > 0 ? (
                        softwares.filter(sw => sw.labs.includes(lab.name)).map(sw => (
                          <span key={sw.id} className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-[#4a0080] border border-purple-100 rounded-md">
                            {sw.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 italic">No softwares listed</span>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && confirmedPcIds.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#4a0080]/20">
                          <p className="text-sm font-semibold text-[#4a0080]">{confirmedPcIds.length} PC(s) Selected</p>
                      </div>
                  )}
                </div>
              );
          })}
        </div>

        {/* STEP 3: Reservation Details Form */}
        {selectedLab && confirmedPcIds.length > 0 && (
            <div className={`rounded-xl shadow-sm border mb-10 overflow-hidden animate-fade-in-down w-full ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
              <div className={`p-6 border-b ${isDark ? 'bg-[#2d114d]/30 border-purple-500/10' : 'bg-slate-50/50 border-slate-100'}`}>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>Complete Your Reservation</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Provide the final details for your {confirmedPcIds.length} selected PC(s) in {selectedLab.name}.</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleReservation} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-sm font-semibold block ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>Purpose</label>
                            <select 
                                required
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                disabled={softwares.filter(sw => sw.labs.includes(selectedLab?.name)).length === 0}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7c1fa0]/20 focus:border-[#7c1fa0] transition-colors ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 disabled:bg-white/3 disabled:text-purple-400' : 'border-slate-200 text-slate-600 bg-slate-50 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400'}`}
                            >
                                {softwares.filter(sw => sw.labs.includes(selectedLab?.name)).length > 0 ? (
                                    <>
                                        <option value="" disabled>Select a purpose...</option>
                                        {softwares.filter(sw => sw.labs.includes(selectedLab?.name)).map(sw => (
                                            <option key={sw.id} value={sw.name}>{sw.name}</option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="" disabled>No purposes available</option>
                                )}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-sm font-semibold block ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>Reservation Date</label>
                            <input 
                                type="date"
                                required
                                value={date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7c1fa0]/20 focus:border-[#7c1fa0] transition-colors ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100' : 'border-slate-200 text-slate-600 bg-slate-50 focus:bg-white'}`}
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className={`text-sm font-semibold block ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>Reservation Time</label>
                            <input 
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7c1fa0]/20 focus:border-[#7c1fa0] transition-colors ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100' : 'border-slate-200 text-slate-600 bg-slate-50 focus:bg-white'}`}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit"
                            className="w-full bg-[#c89b2a] hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            <span>Confirm Reservation</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                    </div>
                </form>
              </div>
            </div>
        )}

        {/* STEP 4: My Reservation Requests (Cards) */}
        <div className="mb-10">
          <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>My Reservation Requests</h3>
          
          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map(req => (
                <div 
                  key={req.id} 
                  onClick={() => openDetailModal(req)} 
                  className={`p-5 rounded-xl shadow-sm border cursor-pointer transition-all flex flex-col h-full group ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 hover:shadow-md hover:border-[#c89b2a]/30' : 'bg-white border-slate-200 hover:shadow-md hover:border-[#4a0080]/30'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className={`font-bold text-lg transition-colors ${isDark ? 'text-purple-100 group-hover:text-[#c89b2a]' : 'text-slate-800 group-hover:text-[#4a0080]'}`}>Lab {req.lab}</h4>
                        <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-purple-400' : 'text-slate-500'}`}>{req.date} at {req.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'Disapproved' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className={`mt-auto pt-4 border-t flex justify-between items-center text-sm ${isDark ? 'border-purple-500/10' : 'border-slate-100'}`}>
                      <span className={isDark ? 'text-purple-300' : 'text-slate-500'}>PCs Reserved:</span>
                      <span className={`font-bold ${isDark ? 'text-purple-100' : 'text-slate-700'}`}>{req.pc_numbers ? req.pc_numbers.length : 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-8 rounded-xl border text-center ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-purple-300' : 'bg-white border-slate-200 text-slate-500'}`}>
                You have no reservation requests yet.
            </div>
          )}
        </div>
      </main>

      {/* STEP 2: PC Grid Modal */}
      {showPcModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className={`rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ${isDark ? 'bg-[#1e0838]' : 'bg-white'}`}>
                  <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'bg-[#1e0838] border-purple-500/20' : 'bg-white border-slate-100'}`}>
                      <div>
                          <h3 className={`text-xl font-bold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>{selectedLab?.name} - PC Selection</h3>
                          <p className={`text-sm mt-1 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Select the computers you wish to reserve.</p>
                      </div>
                      <button onClick={() => setShowPcModal(false)} className={`transition-colors p-2 rounded-full ${isDark ? 'text-purple-300 hover:text-white bg-white/5 hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                  </div>
                  
                  <div className={`p-8 overflow-y-auto flex-1 custom-scrollbar ${isDark ? 'bg-[#0f0520]' : 'bg-slate-50'}`}>
                      <div className="grid gap-3" style={{ gridTemplateColumns: pcGridTemplate }}>
                          {labPcs.map(pc => {
                              const isSelected = selectedPcIds.includes(pc.id);
                              const isAvailable = pc.status === 'Available';
                              
                              // Frontend override: distribute PCs into 7 rows instead of 8
                              const virtualCol = Math.ceil(pc.pc_number / 7);
                              const virtualRow = ((pc.pc_number - 1) % 7) + 1;
                              
                              return (
                                  <button 
                                      key={pc.id}
                                      disabled={!isAvailable}
                                      onClick={() => togglePc(pc.id)}
                                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center aspect-square transition-all relative overflow-hidden ${
                                          isSelected ? 'border-[#4a0080] bg-[#4a0080]/10 text-[#4a0080] shadow-sm' :
                                          !isAvailable ? 'border-slate-200 bg-slate-200/50 text-slate-400 cursor-not-allowed opacity-70' :
                                          'border-slate-200 bg-white hover:border-[#4a0080]/30 hover:bg-[#4a0080]/5 text-slate-700 hover:shadow-sm'
                                      }`}
                                      style={{ gridColumn: getVisualCol(virtualCol), gridRow: virtualRow }}
                                  >
                                      {isSelected && (
                                          <div className="absolute top-1 right-1 bg-[#4a0080] text-white rounded-full p-0.5">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                          </div>
                                      )}
                                      <svg className={`w-8 h-8 mb-1 ${!isAvailable && !isSelected ? 'text-slate-300' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                      </svg>
                                      <span className="text-xs font-bold">PC {pc.pc_number}</span>
                                      
                                      {!isAvailable && (
                                          <span className="text-[9px] uppercase tracking-wider font-bold mt-1 text-slate-400">
                                              {pc.status}
                                          </span>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
                  
                  <div className={`p-6 border-t flex justify-between items-center ${isDark ? 'bg-[#1e0838] border-purple-500/20' : 'bg-white border-slate-100'}`}>
                      <div className={`text-sm font-medium ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>
                          Selected: <span className={`font-bold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>{selectedPcIds.length}</span> PC(s)
                      </div>
                      <button 
                          onClick={confirmPcs}
                          disabled={selectedPcIds.length === 0}
                          className={`font-bold py-2.5 px-6 rounded-xl transition-all ${
                              selectedPcIds.length > 0 
                                ? 'bg-[#c89b2a] hover:bg-amber-600 text-white shadow-md active:scale-95' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                          Confirm Selection
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* STEP 4: Request Detail Modal */}
      {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowDetailModal(false)}>
              <div className={`rounded-2xl shadow-xl w-full max-w-md overflow-hidden ${isDark ? 'bg-[#1e0838] border border-purple-500/20' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                  <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-purple-500/20' : 'border-slate-100'}`}>
                      <h3 className={`text-xl font-bold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>Reservation Details</h3>
                      <button onClick={() => setShowDetailModal(false)} className={isDark ? 'text-purple-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className={`flex justify-between pb-4 border-b ${isDark ? 'border-purple-500/10' : 'border-slate-50'}`}>
                          <span className={isDark ? 'text-purple-300 font-medium' : 'text-slate-500 font-medium'}>Laboratory</span>
                          <span className={`font-bold ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>Lab {selectedRequest.lab}</span>
                      </div>
                      <div className={`flex justify-between pb-4 border-b ${isDark ? 'border-purple-500/10' : 'border-slate-50'}`}>
                          <span className={isDark ? 'text-purple-300 font-medium' : 'text-slate-500 font-medium'}>Purpose</span>
                          <span className={`font-bold text-right max-w-[200px] ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>{selectedRequest.purpose}</span>
                      </div>
                      <div className={`flex justify-between pb-4 border-b ${isDark ? 'border-purple-500/10' : 'border-slate-50'}`}>
                          <span className={isDark ? 'text-purple-300 font-medium' : 'text-slate-500 font-medium'}>Date & Time</span>
                          <span className={`font-bold ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>{selectedRequest.date} at {selectedRequest.time}</span>
                      </div>
                      <div className={`flex justify-between pb-4 border-b ${isDark ? 'border-purple-500/10' : 'border-slate-50'}`}>
                          <span className={isDark ? 'text-purple-300 font-medium' : 'text-slate-500 font-medium'}>Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              selectedRequest.status === 'Disapproved' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                          }`}>
                              {selectedRequest.status}
                          </span>
                      </div>
                      <div className="pt-2">
                          <span className={`font-medium block mb-2 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Reserved PCs ({selectedRequest.pc_numbers ? selectedRequest.pc_numbers.length : 0})</span>
                          <div className="flex flex-wrap gap-2">
                              {selectedRequest.pc_numbers && selectedRequest.pc_numbers.length > 0 ? (
                                  selectedRequest.pc_numbers.map(num => (
                                      <span key={num} className={`font-bold px-3 py-1.5 rounded-lg text-sm ${isDark ? 'bg-[#c89b2a]/10 text-[#c89b2a]' : 'bg-[#4a0080]/10 text-[#4a0080]'}`}>
                                          PC {num}
                                      </span>
                                  ))
                              ) : (
                                  <span className={`text-sm italic ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>No specific PCs selected</span>
                              )}
                          </div>
                      </div>
                  </div>
                  <div className={`p-6 border-t flex justify-end ${isDark ? 'bg-[#0f0520] border-purple-500/20' : 'bg-slate-50 border-slate-100'}`}>
                      <button 
                          onClick={() => setShowDetailModal(false)}
                          className={`font-bold py-2 px-6 rounded-xl transition-colors shadow-sm ${isDark ? 'bg-white/10 text-purple-200 hover:bg-white/15 border border-purple-500/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}

      {showEditProfile && (
        <EditProfileModal 
          onClose={() => setShowEditProfile(false)} 
          onProfileUpdate={() => window.location.reload()} 
        />
      )}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );
}
