import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../components/modal/EditProfileModal';
import NotificationDropdown from '../components/NotificationDropdown';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';

export default function StudentHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showReservationSoon, setShowReservationSoon] = useState(false);

  useEffect(() => {
    if (user && user.user_id) {
      fetch('http://localhost:8080/api/get_student_history.php', {
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

  const handleLogout = () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.user_id) {
      fetch('http://localhost:8080/api/logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: savedUser.user_id })
      }).catch(err => console.error(err));
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* NAVIGATION BAR */}
      <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md text-slate-800 flex justify-between items-center px-6 py-3 shadow-sm border-b border-slate-200">
        <div className="text-xl font-serif font-bold tracking-wide text-[#4a0080]">
          Dashboard
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <NotificationDropdown />
          <Link to="/dashboard" className="text-slate-600 hover:text-[#7c1fa0] transition-colors">Home</Link>
          
          <button onClick={() => setShowEditProfile(true)} className="text-slate-600 hover:text-[#7c1fa0] transition-colors font-medium text-sm">
            Edit Profile
          </button>

          {/* Active Page Indicator */}
          <span className="text-[#4a0080] border-b-2 border-[#4a0080] pb-1 cursor-default">History</span>
          
          <button onClick={() => setShowReservationSoon(true)} className="text-slate-600 hover:text-[#7c1fa0] transition-colors">
            Reservation
          </button>
          
          <button 
            onClick={handleLogout}
            className="bg-[#c89b2a] text-white px-5 py-1.5 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">My Sit-In History</h2>
        <p className="text-slate-500 mb-8">View your past laboratory sessions and admin feedback.</p>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-4 border-b font-bold">Purpose & Lab</th>
                <th className="p-4 border-b font-bold">Time In</th>
                <th className="p-4 border-b font-bold">Time Out</th>
                <th className="p-4 border-b font-bold text-center">Sessions Left</th>
                <th className="p-4 border-b font-bold">Admin Feedback</th>
                <th className="p-4 border-b font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedHistory.length > 0 ? (
                displayedHistory.map((record, index) => (
                  <tr key={record.history_id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{record.purpose}</p>
                      <p className="text-xs text-slate-500">Room {record.lab}</p>
                    </td>
                    <td className="p-4 text-slate-600">{formatDate(record.time_in)}</td>
                    <td className="p-4 text-slate-600">{formatDate(record.time_out)}</td>
                    <td className="p-4 text-center font-bold text-slate-700">{record.sessions_left ?? '-'}</td>
                    <td className="p-4 text-slate-600 italic max-w-xs truncate">{record.feedback ?? "Pending..."}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {record.status}
                      </span>
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
      {showReservationSoon && (
        <FeatureComingSoonModal
          onClose={() => setShowReservationSoon(false)}
          title="Reservation"
          message="This feature will be available soon!"
        />
      )}
    </div>
  );
}