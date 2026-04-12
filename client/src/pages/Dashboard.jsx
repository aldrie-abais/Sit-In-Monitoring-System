import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../components/modal/EditProfileModal';
import NotificationDropdown from '../components/NotificationDropdown';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Base static user data
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};

  // Modals & Triggers
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // --- REAL-TIME STATES ---
  const [isActive, setIsActive] = useState(0);
  const [sessionsLeft, setSessionsLeft] = useState(savedUser.remaining_sessions || 30);
  const [announcementsList, setAnnouncementsList] = useState([]); // NEW: Holds the announcements

  // 1. Fetch Announcements on Load
  useEffect(() => {
    fetch('http://localhost:8080/api/get_announcements.php')
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
    if (!savedUser.user_id) return;

    const checkStatus = () => {
      fetch('http://localhost:8080/api/check_session.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: savedUser.user_id })
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
  }, [savedUser.user_id]);

  const user = {
    name: savedUser.user_first_name 
      ? `${savedUser.user_first_name} ${savedUser.user_middle_name || ''} ${savedUser.user_last_name}`
      : 'No Name Found',
    course: savedUser.user_course_name || 'N/A',
    year: savedUser.user_course_level || 'N/A',
    email: savedUser.user_email || 'N/A',
    address: savedUser.user_address || 'N/A',
    session: sessionsLeft 
  };

  const handleLogout = () => {
    if (savedUser && savedUser.user_id) {
      fetch('http://localhost:8080/api/logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: savedUser.user_id })
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
    <div className="h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col overflow-hidden">
      
      {/* TOP NAVIGATION BAR */}
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
          <Link to="/history" className="text-slate-600 hover:text-[#7c1fa0] transition-colors">History</Link>
          <Link to="/reservation" className="text-slate-600 hover:text-[#7c1fa0] transition-colors">Reservation</Link>
          <button onClick={handleLogout} className="bg-[#c89b2a] text-white px-5 py-1.5 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm">
            Log out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-6 flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

          {/* COLUMN 1: STUDENT INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col relative min-h-0">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 font-semibold flex items-center gap-2 text-[#4a0080]">
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Student Information
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <div className="p-6 flex flex-col items-center border-b border-slate-100">
                <div className="w-32 h-32 bg-slate-100 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Student Avatar" className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="font-bold w-20 shrink-0 text-purple-900">Name:</span>
                  <span className="text-slate-700">{user.name}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold w-20 shrink-0 text-purple-900">Course:</span>
                  <span className="text-slate-700">{user.course}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold w-20 shrink-0 text-purple-900">Year:</span>
                  <span className="text-slate-700">{user.year}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold w-20 shrink-0 text-purple-900">Email:</span>
                  <span className="text-slate-700 break-all">{user.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold w-20 shrink-0 text-purple-900">Address:</span>
                  <span className="text-slate-700">{user.address}</span>
                </div>
                <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                  <span className="font-bold w-20 shrink-0 text-purple-900">Session:</span>
                  <span className="text-slate-700">{user.session}</span>
                </div>
                <div className="flex items-start gap-3 pt-1">
                  <span className="font-bold w-20 shrink-0 text-purple-900">Status:</span>
                  {isActive == 1 ? (
                    <span className="text-green-600 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Active (In Lab)
                    </span>
                  ) : (
                    <span className="text-slate-500 font-bold">Offline</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: DYNAMIC ANNOUNCEMENTS */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col relative min-h-0">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 font-semibold flex items-center gap-2 text-[#4a0080]">
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              Announcement
            </div>
            <div className="p-5 text-sm overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              
              {/* DYNAMIC MAPPING */}
              {announcementsList.length > 0 ? (
                announcementsList.map((item) => (
                  <div key={item.id} className="mb-6 pb-4 border-b border-slate-100">
                    <p className="font-bold text-[#4a0080] mb-2">
                      {item.admin_name} | {formatTeacherDate(item.date_posted)}
                    </p>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
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
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col relative min-h-0">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 font-semibold flex items-center gap-2 text-[#4a0080]">
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Rules and Regulation
            </div>
            <div className="p-5 text-sm text-slate-700 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg text-[#4a0080]">University of Cebu</h3>
                <p className="font-semibold text-purple-900/80">COLLEGE OF INFORMATION & COMPUTER STUDIES</p>
                <p className="font-bold mt-2 text-slate-800">LABORATORY RULES AND REGULATIONS</p>
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

      <footer className="bg-white border-t border-slate-200 py-5 text-center text-sm text-slate-500 mt-auto">
        <p>© 2026 CCS Sit-In Monitoring System. All rights reserved.</p>
      </footer>

      {showEditProfile && (
        <EditProfileModal 
          onClose={() => setShowEditProfile(false)} 
          onProfileUpdate={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
    </div>
  );
}