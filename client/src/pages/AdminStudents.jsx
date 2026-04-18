import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddStudentModal from '../components/modal/AddStudentModal';
import SearchStudentModal from '../components/modal/SearchStudentModal';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showReportsSoon, setShowReportsSoon] = useState(false);

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
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col">
      
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
            <Link to="/admin-dashboard" className="text-slate-500 hover:text-[#4a0080] transition-colors">Home</Link>
            <button onClick={() => setShowSearch(true)} className="text-slate-500 hover:text-[#4a0080] transition-colors">Search</button>
            <span className="text-[#4a0080] border-b-2 border-[#4a0080] pb-1 cursor-default">Students</span>
            <Link to="/admin-dashboard/records" className="text-slate-500 hover:text-[#4a0080] transition-colors">Records</Link>
            <button onClick={() => setShowReportsSoon(true)} className="text-slate-500 hover:text-[#4a0080] transition-colors">Reports</button>
          </div>
          
          <button onClick={handleLogout} className="bg-[#4a0080] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-purple-900 transition-all shadow-md active:scale-95">
            LOG OUT
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Students Information</h2>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
            <button 
            onClick={() => setShowAddModal(true)}
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
        <div className="flex justify-between items-center mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <select 
              className="border border-slate-300 rounded px-2 py-1 outline-none focus:border-[#4a0080]"
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
              className="border border-slate-300 rounded px-3 py-1 outline-none focus:border-[#4a0080] focus:ring-1 focus:ring-[#4a0080]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-4 border-b font-bold cursor-pointer hover:bg-slate-200">ID Number ↕</th>
                <th className="p-4 border-b font-bold cursor-pointer hover:bg-slate-200">Name ↕</th>
                <th className="p-4 border-b font-bold cursor-pointer hover:bg-slate-200 text-center">Year Level ↕</th>
                <th className="p-4 border-b font-bold cursor-pointer hover:bg-slate-200 text-center">Course ↕</th>
                <th className="p-4 border-b font-bold cursor-pointer hover:bg-slate-200 text-center">Remaining Session ↕</th>
                <th className="p-4 border-b font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.length > 0 ? (
                displayedStudents.map((student, index) => (
                  <tr key={student.user_id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-4 text-slate-700">{student.user_id}</td>
                    <td className="p-4 text-slate-800 font-medium">
                      {student.user_first_name} {student.user_middle_name ? student.user_middle_name[0] + '.' : ''} {student.user_last_name}
                    </td>
                    <td className="p-4 text-slate-700 text-center">{student.user_course_level}</td>
                    <td className="p-4 text-slate-700 text-center">{student.user_course_name}</td>
                    <td className="p-4 text-slate-700 text-center">{student.user_remaining_sessions ?? student.remaining_sessions}</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => alert("Edit feature coming soon!")} className="bg-[#007bff] text-white px-4 py-1.5 rounded shadow-sm hover:bg-blue-700 font-medium text-xs transition-colors">
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
        <div className="mt-4 text-sm text-slate-500">
          Showing {displayedStudents.length} of {filteredStudents.length} entries
        </div>

      </main>

      {/* 3. ADD THE MODAL COMPONENT DOWN HERE */}
      {showAddModal && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            fetchStudents(); // Instantly re-fetches the table data so the new student appears!
          }} 
        />
      )}

      {showSearch && (
        <SearchStudentModal 
          onClose={() => setShowSearch(false)}
          onStudentFound={() => setShowSearch(false)}
        />
      )}

      {showReportsSoon && (
        <FeatureComingSoonModal
          onClose={() => setShowReportsSoon(false)}
          title="Reports"
          message="This feature will be available soon!"
        />
      )}
    </div>
  );
}