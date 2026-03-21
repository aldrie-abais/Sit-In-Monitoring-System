import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState('');
  
  // Data for the stats
  const stats = {
    registered: 38,
    currentlySitIn: 0,
    totalSitIn: 15
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col overflow-hidden">
      
      {/* MATCHING NAVIGATION BAR */}
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
            <button className="text-[#4a0080] border-b-2 border-[#4a0080] pb-1">Home</button>
            <button className="text-slate-500 hover:text-[#4a0080] transition-colors">Search</button>
            <button className="text-slate-500 hover:text-[#4a0080] transition-colors">Students</button>
            <button className="text-slate-500 hover:text-[#4a0080] transition-colors">Records</button>
            <button className="text-slate-500 hover:text-[#4a0080] transition-colors">Reports</button>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-[#4a0080] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-purple-900 transition-all shadow-md active:scale-95"
          >
            LOG OUT
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

          {/* LEFT COLUMN: STATISTICS */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            {/* Matching Card Header */}
            <div className="shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 font-semibold flex items-center gap-2 text-[#4a0080]">
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Statistics
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase">Registered Students</p>
                  <p className="text-3xl font-black text-[#4a0080]">{stats.registered}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase">Active Sessions</p>
                  <p className="text-3xl font-black text-[#4a0080]">{stats.currentlySitIn}</p>
                </div>
              </div>

              {/* PIE CHART PLACEHOLDER */}
              <div className="relative aspect-square max-w-xs mx-auto mt-4">
                <div className="w-full h-full rounded-full border-[50px] border-[#4a0080] border-t-[#c89b2a] border-r-purple-300 border-l-slate-200 opacity-90 shadow-inner"></div>
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#4a0080]"></div>C#</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#c89b2a]"></div>Java</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-300"></div>PHP</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANNOUNCEMENT */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            {/* Matching Card Header */}
            <div className="shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 font-semibold flex items-center gap-2 text-[#4a0080]">
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
              </svg>
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
                <button className="mt-4 w-full bg-[#4a0080] text-white py-3 rounded-xl shadow-lg hover:bg-purple-900 transition-all font-bold text-sm tracking-wide active:scale-95">
                  POST TO DASHBOARD
                </button>
              </div>

              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Recently Posted</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <p className="font-bold text-[#4a0080] text-xs">CCS Admin • May 08, 2026</p>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    The laboratories will be closed this coming Friday for faculty development.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}