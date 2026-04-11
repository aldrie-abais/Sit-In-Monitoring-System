import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SitInFormModal from '../components/modal/SitInFormModal';
import SearchStudentModal from '../components/modal/SearchStudentModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState('');
  const [announcementsList, setAnnouncementsList] = useState([]);
  
  // Modal States
  const [showSearch, setShowSearch] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // Dynamic Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    registered: 0,
    active: 0,
    courses: []
  });

  // Theme colors for the pie chart
  const pieColors = ['#4a0080', '#c89b2a', '#d8b4fe', '#fde047', '#94a3b8'];

  const fetchAnnouncements = () => {
    fetch('http://localhost:8080/api/get_announcements.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAnnouncementsList(data.announcements);
        }
      })
      .catch(err => console.error("Failed to fetch announcements:", err));
  };

  const handlePostAnnouncement = () => {
    if (!announcement.trim()) {
      alert("Please type an announcement.");
      return;
    }
    
    fetch('http://localhost:8080/api/post_announcement.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: announcement })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setAnnouncement(''); // Clear the text box
        fetchAnnouncements(); // Instantly refresh the list
      } else {
        alert(data.message);
      }
    });
  };

  const fetchDashboardData = () => {
    fetch('http://localhost:8080/api/get_dashboard_stats.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setDashboardData(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  };

  // Fetch data on load
  useEffect(() => {
    fetchDashboardData();
    fetchAnnouncements();
  }, []);

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

  // --- PIE CHART MATH ---
  const totalCourses = dashboardData.courses.reduce((sum, c) => sum + c.count, 0);
  let cumulativePercent = 0;
  
  // Creates a CSS string like: "#4a0080 0% 50%, #c89b2a 50% 100%"
  const conicString = dashboardData.courses.map((course, index) => {
    const percent = (course.count / totalCourses) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return `${pieColors[index % pieColors.length]} ${start}% ${cumulativePercent}%`;
  }).join(', ');

  const pieStyle = totalCourses > 0 
    ? { background: `conic-gradient(${conicString})` }
    : { background: '#e2e8f0' }; // Empty gray circle if no students exist

  return (
    <div className="h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col overflow-hidden">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4a0080] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-serif text-xl font-bold">UC</span>
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-[#4a0080]">CCS Sit-In Monitoring</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#c89b2a] -mt-1">Administrator Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <span className="text-[#4a0080] border-b-2 border-[#4a0080] pb-1 cursor-default">Home</span>
            <button onClick={() => setShowSearch(true)} className="text-slate-500 hover:text-[#4a0080] transition-colors cursor-pointer">Search</button>
            <Link to="/admin-dashboard/students" className="text-slate-500 hover:text-[#4a0080] transition-colors">Students</Link>
            <Link to="/admin-dashboard/records" className="text-slate-500 hover:text-[#4a0080] transition-colors">Records</Link>
            <button className="text-slate-500 hover:text-[#4a0080] transition-colors">Reports</button>
          </div>
          
          <button onClick={handleLogout} className="bg-[#4a0080] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-purple-900 transition-all shadow-md active:scale-95">
            LOG OUT
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

          {/* LEFT COLUMN: STATISTICS */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 font-semibold flex items-center gap-2 text-[#4a0080]">
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Statistics
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-500 uppercase">Registered Students</p>
                  <p className="text-3xl font-black text-[#4a0080]">{dashboardData.registered}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-500 uppercase">Active Sessions</p>
                  <p className="text-3xl font-black text-[#c89b2a]">{dashboardData.active}</p>
                </div>
              </div>

              {/* DYNAMIC PIE CHART */}
              <div className="text-center mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Students by Course</div>
              <div className="relative aspect-square max-w-[200px] mx-auto mt-2">
                {/* The colored circle */}
                <div className="w-full h-full rounded-full shadow-md" style={pieStyle}></div>
                {/* The white inner circle to make it a "Donut" chart */}
                <div className="absolute inset-0 m-auto w-3/5 h-3/5 bg-white rounded-full shadow-inner flex items-center justify-center">
                   <span className="text-2xl font-black text-slate-800">{dashboardData.registered}</span>
                </div>
              </div>

              {/* DYNAMIC LEGEND */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-600 uppercase">
                 {dashboardData.courses.map((course, index) => (
                   <div key={course.user_course_name} className="flex items-center gap-1.5">
                     <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: pieColors[index % pieColors.length] }}></div>
                     {course.user_course_name} ({course.count})
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANNOUNCEMENT */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 font-semibold flex items-center gap-2 text-[#4a0080]">
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              Post Announcement
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <textarea 
                  className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4a0080]/10 focus:border-[#4a0080] outline-none transition-all text-sm"
                  placeholder="Type an announcement for all students..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                ></textarea>
                <button 
                  onClick={handlePostAnnouncement} 
                  className="mt-4 w-full bg-[#4a0080] text-white py-3 rounded-xl shadow-lg hover:bg-purple-900 transition-all font-bold text-sm tracking-wide active:scale-95"
                >
                  POST TO DASHBOARD
                </button>
              </div>

              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Recently Posted</h2>
              <div className="space-y-4">
                {announcementsList.length > 0 ? (
                  announcementsList.map((item) => (
                    <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <p className="font-bold text-[#4a0080] text-xs">
                        {item.admin_name} • {new Date(item.date_posted).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </p>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic px-2">No announcements posted yet.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* MODALS */}
      {showSearch && (
        <SearchStudentModal 
          onClose={() => setShowSearch(false)} 
          onStudentFound={(student) => {
            setShowSearch(false);
            setActiveStudent(student);
          }} 
        />
      )}

      {activeStudent && (
        <SitInFormModal 
          student={activeStudent}
          onClose={() => setActiveStudent(null)}
          onSuccess={() => {
            setActiveStudent(null);
            fetchDashboardData(); // <--- This refreshes the Active Sessions stat instantly when a student sits in!
          }}
        />
      )}

    </div>
  );
}