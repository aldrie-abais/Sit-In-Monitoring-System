import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../components/modal/EditProfileModal';
import NotificationDropdown from '../components/NotificationDropdown';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';
import AnnouncementDropdown from '../components/modal/AnnouncementDropdown';
import LogoutModal from '../components/modal/LogoutModal';
import FeedbackModal from '../components/modal/FeedbackModal';

export default function StudentHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showReservationSoon, setShowReservationSoon] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true');

  useEffect(() => {
    localStorage.setItem('isDark', isDark);
  }, [isDark]);

  const openFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setShowFeedbackModal(true);
  };

  useEffect(() => {
    if (user && user.user_id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/get_student_history.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setHistory(data.history);
      });
    }
  }, []);

  const displayedHistory = history.slice(0, entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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

          {/* Active Page Indicator */}
          <span className={`${isDark ? 'text-[#c89b2a] border-[#c89b2a]' : 'text-[#4a0080] border-[#4a0080]'} border-b-2 pb-1 cursor-default`}>History</span>
          
          <Link to="/reservation" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'} transition-colors`}>
            Reservation
          </Link>
          
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
            aria-hidden="true"
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
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>My Sit-In History</h2>
        <p className={`mb-8 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>View your past laboratory sessions and admin feedback.</p>

        <div className={`rounded-lg shadow-sm border overflow-hidden ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className={isDark ? 'bg-[#2d114d]/50 text-purple-200' : 'bg-slate-100 text-slate-700'}>
                <th className={`p-4 border-b font-bold ${isDark ? 'border-purple-500/10' : ''}`}>Purpose & Lab</th>
                <th className={`p-4 border-b font-bold ${isDark ? 'border-purple-500/10' : ''}`}>Time In</th>
                <th className={`p-4 border-b font-bold ${isDark ? 'border-purple-500/10' : ''}`}>Time Out</th>
                <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>Duration</th>
                <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>PC Number</th>
                <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>Sessions Left</th>
                <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>Status</th>
                <th className={`p-4 border-b font-bold text-center w-16 ${isDark ? 'border-purple-500/10' : ''}`}> </th>
              </tr>
            </thead>
            <tbody>
              {displayedHistory.length > 0 ? (
                displayedHistory.map((record, index) => (
                  <tr key={record.history_id} className={`border-b ${isDark ? (index % 2 === 0 ? 'bg-[#1e0838]/80' : 'bg-[#2d114d]/20') + ' hover:bg-[#2d114d]/40 border-purple-500/10' : (index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50') + ' hover:bg-slate-50'}`}>
                    <td className="p-4">
                      <p className={`font-bold ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>{record.purpose}</p>
                      <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-slate-500'}`}>Room {record.lab}</p>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>{formatDate(record.time_in)}</td>
                    <td className={`p-4 ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>{formatDate(record.time_out)}</td>
                    <td className={`p-4 text-center ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>{record.duration}</td>
                    <td className={`p-4 text-center ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>{record.pc_numbers}</td>
                    <td className={`p-4 text-center font-bold ${isDark ? 'text-purple-100' : 'text-slate-700'}`}>{record.sessions_left ?? '-'}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => openFeedback(record.feedback)}
                        className="text-[#4a0080] hover:text-[#7c1fa0] hover:bg-[#4a0080]/10 p-2 rounded-full transition-colors inline-flex items-center justify-center"
                        title="View Feedback"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">You have no sit-in history yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
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
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
        feedback={selectedFeedback} 
      />
    </div>
  );
}