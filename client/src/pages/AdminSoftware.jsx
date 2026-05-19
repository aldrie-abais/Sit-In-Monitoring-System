import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';
import LogoutModal from '../components/modal/LogoutModal';
import AddSoftwareModal from '../components/modal/AddSoftwareModal';

export default function AdminSoftware() {
  const navigate = useNavigate();
  const [showReportsSoon, setShowReportsSoon] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddSoftware, setShowAddSoftware] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true');

  useEffect(() => {
    localStorage.setItem('isDark', isDark);
  }, [isDark]);
  const [softwares, setSoftwares] = useState([]);
  const [loading, setLoading] = useState(true);

  // SVG Icon Mapper
  const iconMap = {
    'Cisco': (
      <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
    ),
    'VSCode': (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
      </svg>
    ),
    'VisualStudio': (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    ),
    'JGrasp': (
      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>
    ),
    'IntelliJ': (
      <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
    ),
    'Office': (
      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    )
  };

  // Gradient Color Mapper
  const colorMap = {
    'Cisco': 'from-cyan-500 to-blue-600',
    'VSCode': 'from-blue-500 to-indigo-600',
    'VisualStudio': 'from-purple-500 to-fuchsia-600',
    'JGrasp': 'from-green-500 to-emerald-600',
    'IntelliJ': 'from-rose-500 to-red-600',
    'Office': 'from-orange-500 to-amber-600'
  };

  // Fetch Software Data
  const fetchSoftwares = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/get_softwares.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSoftwares(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching software:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSoftwares();
  }, []);

  const handleDelete = (id, name) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!isConfirmed) return;

    fetch('http://localhost:8080/api/delete_software.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchSoftwares();
      } else {
        alert("Error deleting software: " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Failed to delete software due to connection error.");
    });
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
    <div className={`h-screen w-full font-sans flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0f0520] text-purple-100' : 'bg-slate-50 text-slate-800'}`}>
      
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
            <span className={`${isDark ? 'text-[#c89b2a] border-[#c89b2a]' : 'text-[#4a0080] border-[#4a0080]'} border-b-2 pb-1 cursor-default`}>Software</span>
            <Link to="/admin-dashboard/students" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Students</Link>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            Log out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <div className="flex justify-between items-center mb-2 shrink-0">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Laboratory Software</h2>
          
          <button 
              onClick={() => setShowAddSoftware(true)} 
              className="bg-[#4a0080] hover:bg-purple-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 inline-flex items-center gap-2.5"
          >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Software
          </button>
        </div>
        <p className={`text-sm font-medium mb-8 shrink-0 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Manage and monitor laboratory software installations and dynamic classroom assignments.</p>

        {loading ? (
          /* Loading Indicator */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#4a0080]/20 border-t-[#4a0080] rounded-full animate-spin"></div>
            <p className="text-slate-500 font-semibold text-sm mt-4">Loading laboratory software catalogs...</p>
          </div>
        ) : (
          /* Software Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
            {softwares.map(software => {
              const iconKey = software.icon || 'VSCode';
              const gradientClass = colorMap[iconKey] || 'from-[#4a0080] to-purple-600';
              const renderedIcon = iconMap[iconKey] || (
                <svg className="w-8 h-8 text-[#4a0080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              );

              return (
                <div key={software.id} className={`border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 hover:border-[#c89b2a]/30' : 'bg-white border-slate-200 hover:border-[#4a0080]/30'}`}>
                  
                  {/* Header block with gradient strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${gradientClass} shrink-0`}></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner border group-hover:scale-105 transition-transform ${isDark ? 'bg-[#2d114d]/50 border-purple-500/10' : 'bg-slate-50 border-slate-100'}`}>
                          {renderedIcon}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg transition-colors ${isDark ? 'text-purple-100 group-hover:text-[#c89b2a]' : 'text-slate-800 group-hover:text-[#4a0080]'}`}>{software.name}</h3>
                          <p className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>Application Suite</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(software.id, software.name)}
                        className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 ${isDark ? 'text-purple-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                        title="Delete Software"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <p className={`text-sm leading-relaxed mb-6 flex-1 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>{software.description}</p>

                    {/* Laboratory Tags */}
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>Installed Rooms</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {software.labs.length > 0 ? (
                          software.labs.map(lab => (
                            <span key={lab} className={`text-[11px] font-bold px-2.5 py-1 border rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-200 border-purple-500/20' : 'bg-purple-50 text-[#4a0080] border-purple-100/50'}`}>
                              {lab}
                            </span>
                          ))
                        ) : (
                          <span className={`text-[11px] font-bold px-2.5 py-1 border rounded-lg italic ${isDark ? 'bg-white/5 text-purple-400 border-purple-500/10' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                            Not Installed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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

      {showAddSoftware && (
        <AddSoftwareModal 
          onClose={() => setShowAddSoftware(false)}
          onSuccess={() => {
            fetchSoftwares();
          }}
        />
      )}

    </div>
  );
}
