import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminRecords() {
  const navigate = useNavigate();
  const [activeStudents, setActiveStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // This script correctly filters for role='Student' AND user_is_active=1
    fetch('http://localhost:8080/api/get_active_students.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setActiveStudents(data.students);
      })
      .catch(err => console.error(err));
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

  const filteredStudents = activeStudents.filter(student => 
    student.user_id.toString().includes(searchTerm) ||
    `${student.user_first_name} ${student.user_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const handleEndSession = (studentId) => {
    if (window.confirm("End this student's session? 1 session will be deducted.")) {
      fetch('http://localhost:8080/api/end_session.php', { // Use the new script here
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: studentId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          // Remove from the local state list so they disappear from the table
          setActiveStudents(prev => prev.filter(s => s.user_id !== studentId));
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(err => console.error("Error:", err));
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col">
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
            <button className="text-slate-500 hover:text-[#4a0080] transition-colors">Search</button>
            <Link to="/admin-dashboard/students" className="text-slate-500 hover:text-[#4a0080] transition-colors">Students</Link>
            <span className="text-[#4a0080] border-b-2 border-[#4a0080] pb-1 cursor-default">Records</span>
            <button className="text-slate-500 hover:text-[#4a0080] transition-colors">Reports</button>
          </div>
          <button onClick={handleLogout} className="bg-[#4a0080] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-purple-900 transition-all shadow-md active:scale-95">
            LOG OUT
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Active Sit-In Records</h2>

        <div className="flex justify-end items-center mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <label className="font-medium">Search Active:</label>
            <input 
              type="text" 
              className="border border-slate-300 rounded px-3 py-1 outline-none focus:border-[#4a0080] focus:ring-1 focus:ring-[#4a0080]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-4 border-b font-bold">ID Number</th>
                <th className="p-4 border-b font-bold">Name</th>
                <th className="p-4 border-b font-bold text-center">Course</th>
                <th className="p-4 border-b font-bold text-center">Remaining Session</th>
                <th className="p-4 border-b font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.user_id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-4 text-slate-700">{student.user_id}</td>
                    <td className="p-4 text-slate-800 font-medium">
                      {student.user_first_name} {student.user_middle_name ? student.user_middle_name[0] + '.' : ''} {student.user_last_name}
                    </td>
                    <td className="p-4 text-slate-700 text-center">{student.user_course_name}</td>
                    <td className="p-4 text-slate-700 text-center font-bold text-[#c89b2a]">{student.remaining_sessions}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleEndSession(student.user_id)} className="bg-orange-500 text-white px-4 py-1.5 rounded shadow-sm hover:bg-orange-600 font-medium text-xs transition-colors">
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
      </main>
    </div>
  );
}