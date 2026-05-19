import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../components/modal/EditProfileModal';
import NotificationDropdown from '../components/NotificationDropdown';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';
import AnnouncementDropdown from '../components/modal/AnnouncementDropdown';
import LogoutModal from '../components/modal/LogoutModal';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true');

  useEffect(() => {
    localStorage.setItem('isDark', isDark);
  }, [isDark]);

  // Modals & Triggers
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [showReservationSoon, setShowReservationSoon] = useState(false);

  // --- REAL-TIME STATES ---
  const [isActive, setIsActive] = useState(0);
  const [sessionsLeft, setSessionsLeft] = useState(currentUser.remaining_sessions || 30);
  const [announcementsList, setAnnouncementsList] = useState([]); // NEW: Holds the announcements

  // 1. Fetch Announcements on Load
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_announcements.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAnnouncementsList(data.announcements);
        }
      })
      .catch(err => console.error("Failed to fetch announcements:", err));
  }, []);

  // 2. The Live Sync Heartbeat
  useEffect(() => {
    if (!currentUser.user_id) return;

    const checkStatus = () => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/check_session.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.user_id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setIsActive(data.is_active);
          setSessionsLeft(data.remaining_sessions);
        }
      })
      .catch(err => console.error("Heartbeat failed:", err));
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 2000);
    return () => clearInterval(intervalId);
  }, [currentUser.user_id]);

  const user = {
    name: currentUser.user_first_name 
      ? `${currentUser.user_first_name} ${currentUser.user_middle_name || ''} ${currentUser.user_last_name}`
      : 'No Name Found',
    course: currentUser.user_course_name || 'N/A',
    year: currentUser.user_course_level || 'N/A',
    email: currentUser.user_email || 'N/A',
    address: currentUser.user_address || 'N/A',
    session: sessionsLeft 
  };

  const avatarUrl = currentUser.profile_picture 
    ? `${import.meta.env.VITE_API_BASE_URL}/${currentUser.profile_picture}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.user_first_name || 'Felix'}`;

  const handleLogout = (feedback) => {
    if (currentUser && currentUser.user_id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/logout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.user_id, feedback: feedback || '' })
      })
      .catch(error => console.error("Error updating logout status:", error));
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };
  // 3. Helper to match your teacher's exact date format (e.g., 2026-May-08)
  const formatTeacherDate = (dateString) => {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={`h-screen w-full font-sans flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0f0520] text-purple-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* TOP NAVIGATION BAR */}
      <nav className={`w-full sticky top-0 z-50 flex justify-between items-center px-6 py-3 shadow-sm border-b transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-white' : 'bg-white/80 border-slate-200 text-slate-800'}`}>
        <div className={`text-xl font-serif font-bold tracking-wide ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>
          Dashboard
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <NotificationDropdown />
          <AnnouncementDropdown />
          {/* Active Page Indicator */}
          <span className={`${isDark ? 'text-[#c89b2a] border-[#c89b2a]' : 'text-[#4a0080] border-[#4a0080]'} border-b-2 pb-1 cursor-default`}>Home</span>
          <button onClick={() => setShowEditProfile(true)} className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'} transition-colors font-medium text-sm`}>
            Edit Profile
          </button>
          <Link to="/history" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'} transition-colors`}>History</Link>
          <Link to="/reservation" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'} transition-colors`}>Reservation</Link>
          
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

      {/* MAIN CONTENT AREA */}
      <main className="p-6 flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

          {/* COLUMN 1: STUDENT INFORMATION */}
          <div className={`border rounded-xl shadow-sm flex flex-col relative min-h-0 transition-colors duration-300 ${isDark ? 'bg-[#1e0838] border-purple-500/20 text-purple-200' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className={`sticky top-0 z-10 border-b px-4 py-3 font-semibold flex items-center gap-2 transition-colors duration-300 ${isDark ? 'bg-[#1a0830]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Student Information
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <div className="p-6 flex flex-col items-center border-b border-slate-100">
                <div className={`w-32 h-32 rounded-full mb-4 overflow-hidden border-4 shadow-md ${isDark ? 'bg-[#0f0520] border-[#1e0838]' : 'bg-slate-100 border-white'}`}>
                  <img src={avatarUrl} alt="Student Avatar" className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className={`font-bold w-20 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Name:</span>
                  <span className={isDark ? 'text-purple-200' : 'text-slate-700'}>{user.name}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className={`font-bold w-20 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Course:</span>
                  <span className={isDark ? 'text-purple-200' : 'text-slate-700'}>{user.course}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className={`font-bold w-20 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Year:</span>
                  <span className={isDark ? 'text-purple-200' : 'text-slate-700'}>{user.year}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className={`font-bold w-20 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Email:</span>
                  <span className={`break-all ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{user.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className={`font-bold w-20 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Address:</span>
                  <span className={isDark ? 'text-purple-200' : 'text-slate-700'}>{user.address}</span>
                </div>
                <div className={`flex items-start gap-3 border-b pb-4 ${isDark ? 'border-purple-500/10' : 'border-slate-100'}`}>
                  <span className={`font-bold w-20 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Session:</span>
                  <span className={isDark ? 'text-purple-200' : 'text-slate-700'}>{user.session}</span>
                </div>
                <div className="flex items-start gap-3 pt-1">
                  <span className={`font-bold w-20 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Status:</span>
                  {isActive == 1 ? (
                    <span className="text-green-600 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Active (In Lab)
                    </span>
                  ) : (
                    <span className={isDark ? 'text-purple-300/55 font-bold' : 'text-slate-500 font-bold'}>Offline</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: DYNAMIC ANNOUNCEMENTS */}
          <div className={`border rounded-xl shadow-sm flex flex-col relative min-h-0 transition-colors duration-300 ${isDark ? 'bg-[#1e0838] border-purple-500/20 text-purple-200' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className={`sticky top-0 z-10 border-b px-4 py-3 font-semibold flex items-center gap-2 transition-colors duration-300 ${isDark ? 'bg-[#1a0830]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              Announcement
            </div>
            <div className="p-5 text-sm overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              
              {/* DYNAMIC MAPPING */}
              {announcementsList.length > 0 ? (
                announcementsList.map((item) => (
                  <div key={item.id} className={`mb-6 pb-4 border-b ${isDark ? 'border-purple-500/10' : 'border-slate-100'}`}>
                    <p className={`font-bold mb-2 ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>
                      {item.admin_name} | {formatTeacherDate(item.date_posted)}
                    </p>
                    <p className={isDark ? 'text-purple-200/80 leading-relaxed whitespace-pre-wrap' : 'text-slate-600 leading-relaxed whitespace-pre-wrap'}>
                      {item.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <p className="italic">No announcements have been posted yet.</p>
                </div>
              )}

            </div>
          </div>

          {/* COLUMN 3: RULES AND REGULATION */}
          <div className={`border rounded-xl shadow-sm flex flex-col relative min-h-0 transition-colors duration-300 ${isDark ? 'bg-[#1e0838] border-purple-500/20 text-purple-200' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className={`sticky top-0 z-10 border-b px-4 py-3 font-semibold flex items-center gap-2 transition-colors duration-300 ${isDark ? 'bg-[#1a0830]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Rules and Regulation
            </div>
            <div className="p-5 text-sm overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <div className="text-center mb-6">
                <h3 className={`font-bold text-lg ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>University of Cebu</h3>
                <p className={`font-semibold ${isDark ? 'text-purple-300' : 'text-purple-900/80'}`}>COLLEGE OF INFORMATION & COMPUTER STUDIES</p>
                <p className="font-bold mt-2">LABORATORY RULES AND REGULATIONS</p>
              </div>
              <p className="mb-4 text-justify">
                To avoid embarrassment and maintain camaraderie with your friends and superiors at our laboratories, please observe the following:
              </p>
              <ol className="list-decimal pl-5 space-y-4 text-justify pr-2">
                <li>Maintain silence, proper decorum, and discipline inside the laboratory. Mobile phones, walkmans and other personal pieces of equipment must be switched off.</li>
                <li>Games are not allowed inside the lab. This includes computer-related games, card games and other games that may disturb the operation of the lab.</li>
                <li>Surfing the Internet is allowed only with the permission of the instructor. Downloading and installing of software are strictly prohibited.</li>
                <li>Getting access to other websites not related to the course (especially pornographic and illicit sites) is strictly prohibited.</li>
                <li>Deleting computer files and changing the set-up of the computer is a major offense.</li>
                <li>Observe computer time usage carefully. A fifteen-minute allowance is given for each use. Otherwise, the unit will be given to those who wish to "sit-in".</li>
                <li>Food and beverages of any kind are strictly prohibited inside the laboratory. Water bottles must be kept inside your bags.</li>
                <li>Tampering with hardware, including unplugging mice, keyboards, or network cables, is considered vandalism and will face disciplinary action.</li>
              </ol>
            </div>
          </div>

        </div>
      </main>

      <footer className={`py-5 text-center text-sm mt-auto border-t transition-colors duration-300 ${isDark ? 'bg-[#0a0314] border-[#c89b2a]/20 text-purple-200/50' : 'bg-white border-slate-200 text-slate-500'}`}>
        <p>© 2026 CCS Sit-In Monitoring System. All rights reserved.</p>
      </footer>
      {showEditProfile && (
        <EditProfileModal 
          onClose={() => setShowEditProfile(false)} 
          onProfileUpdate={() => setCurrentUser(JSON.parse(localStorage.getItem('user')) || {})} 
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