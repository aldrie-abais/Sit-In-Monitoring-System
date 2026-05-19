import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchStudentModal from '../components/modal/SearchStudentModal';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';
import SitInFormModal from '../components/modal/SitInFormModal';
import LogoutModal from '../components/modal/LogoutModal';


export default function AdminRecords() {
  const [showSearch, setShowSearch] = useState(false);
  const [showReportsSoon, setShowReportsSoon] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true');

  useEffect(() => {
    localStorage.setItem('isDark', isDark);
  }, [isDark]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStudent, setActiveStudent] = useState(null);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'testimonials'
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchActiveStudents();
    fetchTestimonials();
  }, []);

  const fetchTestimonials = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_testimonials.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setTestimonials(data.data);
      })
      .catch(err => console.error(err));
  };

  const fetchActiveStudents = () => {
    // This script correctly filters for role='Student' AND user_is_active=1
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_active_students.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setActiveStudents(data.students);
      })
      .catch(err => console.error(err));
  };

  const handleLogout = () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.user_id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/logout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: savedUser.user_id })
      }).catch(err => console.error(err));
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredStudents = activeStudents.filter(student => 
    student.user_id.toString().includes(searchTerm) ||
    `${student.user_first_name} ${student.user_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

const openFeedbackModal = (studentId) => {
    setSessionToEnd(studentId);
    setFeedbackText('');
    setFeedbackModalOpen(true);
  };

  const confirmEndSession = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/end_session.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: sessionToEnd,
        feedback: feedbackText 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        fetchActiveStudents();
        fetchTestimonials();
        setFeedbackModalOpen(false);
      } else {
        alert("Error: " + data.message);
      }
    });
  };

  return (
    <div className={`min-h-screen w-full font-sans flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f0520] text-purple-100' : 'bg-slate-50 text-slate-800'}`}>
      <nav className={`px-8 py-4 flex items-center justify-between shadow-sm shrink-0 border-b transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4a0080] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-serif text-xl font-bold">UC</span>
          </div>
          <div>
            <h1 className={`font-serif text-xl font-bold tracking-tight ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>CCS Sit-In Monitoring</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#c89b2a] -mt-1">Administrator Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link to="/admin-dashboard" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Home</Link>
            <Link to="/admin-dashboard/reservation" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Reservation</Link>
            <Link to="/admin-dashboard/software" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Software</Link>
            <Link to="/admin-dashboard/students" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Students</Link>
            <span className={`${isDark ? 'text-[#c89b2a] border-[#c89b2a]' : 'text-[#4a0080] border-[#4a0080]'} border-b-2 pb-1 cursor-default`}>Records</span>
          </div>
          
          <button 
            onClick={() => setIsDark(!isDark)} 
            className={`text-xl p-2 rounded-full transition-all duration-200 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-slate-600'}`} 
            title="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button onClick={() => setShowLogoutModal(true)} className="bg-[#4a0080] text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-purple-900 transition-all shadow-md active:scale-95 inline-flex items-center gap-2.5">
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

      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        {/* Tab Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'active'
                ? (isDark ? 'bg-[#c89b2a] text-white shadow-md' : 'bg-[#4a0080] text-white shadow-md')
                : (isDark ? 'bg-white/5 text-purple-200 hover:bg-white/15 border border-purple-500/20' : 'bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700')
            }`}
          >
            Active Sit-In Records
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'testimonials'
                ? (isDark ? 'bg-[#c89b2a] text-white shadow-md' : 'bg-[#4a0080] text-white shadow-md')
                : (isDark ? 'bg-white/5 text-purple-200 hover:bg-white/15 border border-purple-500/20' : 'bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700')
            }`}
          >
            Student Testimonials
          </button>
        </div>

        {activeTab === 'active' ? (
          <>
            <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>Active Sit-In Records</h2>

            <div className={`flex justify-end items-center mb-4 text-sm ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>
              <div className="flex items-center gap-2">
                <label className="font-medium">Search Active:</label>
                <input 
                  type="text" 
                  className={`border rounded px-3 py-1 outline-none ${isDark ? 'bg-[#2d114d]/50 border-purple-500/20 text-purple-100 focus:border-[#c89b2a]' : 'border-slate-300 focus:border-[#4a0080] focus:ring-1 focus:ring-[#4a0080]'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className={`rounded-lg shadow-sm border overflow-hidden ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className={isDark ? 'bg-[#2d114d]/50 text-purple-200' : 'bg-slate-100 text-slate-700'}>
                    <th className={`p-4 border-b font-bold ${isDark ? 'border-purple-500/10' : ''}`}>ID Number</th>
                    <th className={`p-4 border-b font-bold ${isDark ? 'border-purple-500/10' : ''}`}>Name</th>
                    <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>Course</th>
                    <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>Remaining Session</th>
                    <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={student.user_id} className={`border-b ${isDark ? (index % 2 === 0 ? 'bg-[#1e0838]/80' : 'bg-[#2d114d]/20') + ' hover:bg-[#2d114d]/40 border-purple-500/10' : (index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50') + ' hover:bg-slate-50'}`}>
                        <td className={`p-4 ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{student.user_id}</td>
                        <td className={`p-4 font-medium ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>
                          {student.user_first_name} {student.user_middle_name ? student.user_middle_name[0] + '.' : ''} {student.user_last_name}
                        </td>
                        <td className={`p-4 text-center ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{student.user_course_name}</td>
                        <td className="p-4 text-center font-bold text-[#c89b2a]">{student.remaining_sessions}</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => openFeedbackModal(student.user_id)} 
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-sm transition-all"
                          >
                            End Session
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">No students are currently sitting in.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>Student Testimonials</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.length > 0 ? (
                testimonials.map((test) => (
                  <div 
                    key={test.history_id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${
                      isDark 
                        ? 'bg-[#1e0838] border-purple-500/20 text-purple-200 hover:border-[#c89b2a]/30' 
                        : 'bg-white border-slate-200 text-slate-800 hover:border-[#4a0080]/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-4xl leading-none font-serif select-none ${isDark ? 'text-[#c89b2a]/20' : 'text-[#4a0080]/15'}`}>“</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isDark ? 'bg-[#c89b2a]/15 text-[#c89b2a]' : 'bg-[#4a0080]/10 text-[#4a0080]'
                        }`}>
                          {test.lab}
                        </span>
                      </div>
                      
                      <p className={`text-sm italic leading-relaxed mb-6 whitespace-pre-wrap ${isDark ? 'text-purple-100' : 'text-slate-600'}`}>
                        {test.feedback}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-dashed border-slate-100 dark:border-purple-500/10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isDark ? 'bg-purple-900/50 text-[#c89b2a]' : 'bg-purple-100 text-[#4a0080]'
                      }`}>
                        {test.user_first_name[0]}{test.user_last_name[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-bold truncate ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>
                          {test.user_first_name} {test.user_last_name}
                        </h4>
                        <p className={`text-[11px] truncate ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>
                          {test.user_course_name} - Year {test.user_course_level}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-purple-500' : 'text-slate-400'}`}>
                          Ended: {new Date(test.time_out.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {test.admin_feedback && test.admin_feedback.trim() !== '' && test.admin_feedback !== 'No feedback provided.' && (
                      <div className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed ${
                        isDark 
                          ? 'bg-purple-950/40 border-purple-500/10 text-purple-300' 
                          : 'bg-amber-50/50 border-amber-100 text-amber-900'
                      }`}>
                        <span className="font-bold block mb-0.5 text-[10px] uppercase tracking-wider text-slate-400 dark:text-purple-400">Admin Note:</span>
                        “{test.admin_feedback}”
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={`col-span-full p-12 text-center rounded-xl border ${
                  isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-purple-300' : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  <p className="italic">No student feedback or testimonials submitted yet.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {feedbackModalOpen && (
        <div className={`fixed inset-0 flex items-center justify-center z-110 p-4 backdrop-blur-sm ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`}>
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 ${isDark ? 'bg-[#1e0838] border border-purple-500/20' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>End Session & Leave Feedback</h2>
            <p className={`text-sm mb-4 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Leave an optional note about the student's lab usage.</p>
            <textarea 
              className={`w-full border rounded-lg p-3 text-sm outline-none min-h-25 ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40 focus:border-[#c89b2a]' : 'border-slate-300 focus:border-[#4a0080]'}`}
              placeholder="e.g., Left workstation messy, focused well..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setFeedbackModalOpen(false)} className={`flex-1 py-2 rounded-lg font-bold ${isDark ? 'bg-white/10 text-purple-200 hover:bg-white/15' : 'bg-slate-200 text-slate-700'}`}>Cancel</button>
              <button onClick={confirmEndSession} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold">Confirm End</button>
            </div>
          </div>
        </div>
      )}

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
            fetchActiveStudents();
          }}
        />
      )}

      {showReportsSoon && (
        <FeatureComingSoonModal
          onClose={() => setShowReportsSoon(false)}
          title="Reports"
          message="This feature will be available soon!"
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