import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddStudentModal from '../components/modal/AddStudentModal';
import SearchStudentModal from '../components/modal/SearchStudentModal';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';
import SitInFormModal from '../components/modal/SitInFormModal';
import LogoutModal from '../components/modal/LogoutModal';

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showReportsSoon, setShowReportsSoon] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true');

  useEffect(() => {
    localStorage.setItem('isDark', isDark);
  }, [isDark]);

  // 2. EXTRACT FETCH LOGIC SO WE CAN REUSE IT
  const fetchStudents = () => {
    fetch('http://localhost:8080/api/get_all_students.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStudents(data.students);
        }
      })
      .catch(err => console.error("Error fetching students:", err));
  };

  // Fetch the students when the page loads
  useEffect(() => {
    fetchStudents();
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

  // Frontend Search & Pagination Logic
  const filteredStudents = students.filter(student => 
    student.user_id.toString().includes(searchTerm) ||
    `${student.user_first_name} ${student.user_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayedStudents = filteredStudents.slice(0, entriesPerPage);

  const handleResetAll = () => {
    if (window.confirm("ARE YOU SURE? This will reset EVERY student to 30 sessions!")) {
      fetch('http://localhost:8080/api/reset_all_sessions.php', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            alert(data.message);
            // Re-fetch the list to see the 30s in the table
            fetchStudents(); 
          }
        });
    }
  };

  return (
    <div className={`min-h-screen w-full font-sans flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f0520] text-purple-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* NAVIGATION BAR */}
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
            <span className={`${isDark ? 'text-[#c89b2a] border-[#c89b2a]' : 'text-[#4a0080] border-[#4a0080]'} border-b-2 pb-1 cursor-default`}>Students</span>
            <Link to="/admin-dashboard/records" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Records</Link>
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

      {/* MAIN CONTENT AREA */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>Students Information</h2>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
            <button 
            onClick={() => {
              setEditingStudent(null);
              setShowAddModal(true);
            }}
            className="bg-[#4a0080] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-900 transition-all flex items-center gap-2"
            >
            <span>+</span> Add Student
            </button>

            {/* Reset All Session Button */}
            <button 
            onClick={handleResetAll}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-all shadow-md active:scale-95"
            >
            Reset All Session
            </button>
        </div>

        {/* Table Controls (Entries & Search) */}
        <div className={`flex justify-between items-center mb-4 text-sm ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>
          <div className="flex items-center gap-2">
            <select 
              className={`border rounded px-2 py-1 outline-none ${isDark ? 'bg-[#2d114d]/50 border-purple-500/20 text-purple-100 focus:border-[#c89b2a]' : 'border-slate-300 focus:border-[#4a0080]'}`}
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-medium">Search:</label>
            <input 
              type="text" 
              className={`border rounded px-3 py-1 outline-none ${isDark ? 'bg-[#2d114d]/50 border-purple-500/20 text-purple-100 focus:border-[#c89b2a]' : 'border-slate-300 focus:border-[#4a0080] focus:ring-1 focus:ring-[#4a0080]'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className={`rounded-lg shadow-sm border overflow-hidden ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className={isDark ? 'bg-[#2d114d]/50 text-purple-200' : 'bg-slate-100 text-slate-700'}>
                <th className={`p-4 border-b font-bold cursor-pointer ${isDark ? 'border-purple-500/10 hover:bg-[#2d114d]' : 'hover:bg-slate-200'}`}>ID Number ↕</th>
                <th className={`p-4 border-b font-bold cursor-pointer ${isDark ? 'border-purple-500/10 hover:bg-[#2d114d]' : 'hover:bg-slate-200'}`}>Name ↕</th>
                <th className={`p-4 border-b font-bold cursor-pointer text-center ${isDark ? 'border-purple-500/10 hover:bg-[#2d114d]' : 'hover:bg-slate-200'}`}>Year Level ↕</th>
                <th className={`p-4 border-b font-bold cursor-pointer text-center ${isDark ? 'border-purple-500/10 hover:bg-[#2d114d]' : 'hover:bg-slate-200'}`}>Course ↕</th>
                <th className={`p-4 border-b font-bold cursor-pointer text-center ${isDark ? 'border-purple-500/10 hover:bg-[#2d114d]' : 'hover:bg-slate-200'}`}>Remaining Session ↕</th>
                <th className={`p-4 border-b font-bold text-center ${isDark ? 'border-purple-500/10' : ''}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.length > 0 ? (
                displayedStudents.map((student, index) => (
                  <tr key={student.user_id} className={`border-b ${isDark ? (index % 2 === 0 ? 'bg-[#1e0838]/80' : 'bg-[#2d114d]/20') + ' hover:bg-[#2d114d]/40 border-purple-500/10' : (index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50') + ' hover:bg-slate-50'}`}>
                    <td className={`p-4 ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{student.user_id}</td>
                    <td className={`p-4 font-medium ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>
                      {student.user_first_name} {student.user_middle_name ? student.user_middle_name[0] + '.' : ''} {student.user_last_name}
                    </td>
                    <td className={`p-4 text-center ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{student.user_course_level}</td>
                    <td className={`p-4 text-center ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{student.user_course_name}</td>
                    <td className={`p-4 text-center ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{student.user_remaining_sessions ?? student.remaining_sessions}</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => { setEditingStudent(student); setShowAddModal(true); }} className="bg-[#007bff] text-white px-4 py-1.5 rounded shadow-sm hover:bg-blue-700 font-medium text-xs transition-colors">
                        Edit
                      </button>
                      <button onClick={() => alert("Delete feature coming soon!")} className="bg-[#dc3545] text-white px-4 py-1.5 rounded shadow-sm hover:bg-red-700 font-medium text-xs transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No active students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Footer info */}
        <div className={`mt-4 text-sm ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>
          Showing {displayedStudents.length} of {filteredStudents.length} entries
        </div>

      </main>

      {/* 3. ADD THE MODAL COMPONENT DOWN HERE */}
      {showAddModal && (
        <AddStudentModal 
          mode={editingStudent ? 'edit' : 'add'}
          student={editingStudent}
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            setEditingStudent(null);
            fetchStudents(); // Instantly re-fetches the table data so the new student appears!
          }} 
        />
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
            fetchStudents();
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