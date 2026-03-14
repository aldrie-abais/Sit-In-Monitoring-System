import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [isDark, setIsDark] = useState(true); // Default to dark based on your theme
  const navigate = useNavigate();

  // Mock data - eventually this will come from your PHP session
  const user = {
    name: "Juan Dela Cruz",
    id: "2210345",
    remainingHours: 15,
    course: "BSIT - 3"
  };

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${isDark ? 'bg-[#0f0520]' : 'bg-slate-50'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* SIDEBAR */}
      <aside className={`w-64 border-r hidden md:flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#140528] border-[#c89b2a]/20' : 'bg-white border-slate-200'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isDark ? 'bg-amber-600' : 'bg-[#7c1fa0]'}`}>CCS</div>
            <span className={`font-serif text-lg font-extrabold ${isDark ? 'text-[#e2c97e]' : 'text-[#7c1fa0]'}`}>SIT-SIT</span>
          </div>

          <nav className="space-y-4">
            {['Dashboard', 'Profile', 'History', 'Rules'].map((item) => (
              <a key={item} className={`block font-semibold text-sm py-2 px-4 rounded-xl transition-all ${isDark ? 'text-purple-200/50 hover:bg-white/5 hover:text-[#c89b2a]' : 'text-slate-500 hover:bg-slate-100 hover:text-[#7c1fa0]'}`}>
                {item}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <button 
            onClick={() => navigate('/')} 
            className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${isDark ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className={`px-8 py-4 flex justify-between items-center backdrop-blur-md border-b ${isDark ? 'border-[#c89b2a]/20 text-white' : 'border-slate-200 text-slate-800'}`}>
          <h2 className="font-serif text-xl font-bold">Student Overview</h2>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsDark(!isDark)} className="text-xl p-2 rounded-full bg-black/5">
                {isDark ? '☀️' : '🌙'}
             </button>
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.name}</p>
                <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-purple-300/50' : 'text-slate-400'}`}>{user.id}</p>
             </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-8 overflow-y-auto relative">
          {/* Decorative Background Blob */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-[#7c1fa0]/20' : 'bg-[#7c1fa0]/5'}`} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            
            {/* REMAINING HOURS CARD */}
            <div className={`p-8 rounded-3xl shadow-xl lg:col-span-1 flex flex-col justify-center items-center text-center border transition-all ${isDark ? 'bg-[#1e0838] border-[#c89b2a]/30' : 'bg-white border-slate-100'}`}>
               <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-purple-300/60' : 'text-slate-400'}`}>Remaining Hours</p>
               <h3 className={`font-serif text-7xl font-black ${isDark ? 'text-[#e2c97e]' : 'text-[#7c1fa0]'}`}>{user.remainingHours}</h3>
               <div className={`mt-6 px-4 py-1 rounded-full text-[10px] font-bold ${isDark ? 'bg-amber-600/10 text-amber-500' : 'bg-purple-100 text-purple-700'}`}>
                 VALID FOR SEMESTER 2
               </div>
            </div>

            {/* ANNOUNCEMENTS */}
            <div className={`p-8 rounded-3xl shadow-xl lg:col-span-2 border transition-all ${isDark ? 'bg-[#1e0838] border-[#c89b2a]/30' : 'bg-white border-slate-100'}`}>
              <h3 className={`font-serif text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Announcements</h3>
              <div className="space-y-4">
                {[
                  { title: "Lab Maintenance", msg: "Room 401 will be closed on Friday for system updates.", date: "March 15" },
                  { title: "New Guidelines", msg: "Please remember to bring your physical ID for QR scanning.", date: "March 12" }
                ].map((ann, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold text-sm ${isDark ? 'text-[#e2c97e]' : 'text-[#7c1fa0]'}`}>{ann.title}</h4>
                      <span className="text-[10px] opacity-50 font-bold">{ann.date}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-purple-100/70' : 'text-slate-500'}`}>{ann.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Reservation', 'View Grades', 'Lab Rules', 'Contact Lab Admin'].map((action) => (
                  <button key={action} className={`py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border hover:scale-[1.02] active:scale-95 ${isDark ? 'bg-[#0f0520] border-[#c89b2a]/20 text-[#e2c97e] hover:border-[#c89b2a]' : 'bg-white border-slate-200 text-slate-600 hover:border-[#7c1fa0]'}`}>
                    {action}
                  </button>
                ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}