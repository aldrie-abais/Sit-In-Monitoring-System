import React, { useState } from 'react'
import RegisterModal from '../components/modal/RegisterModal'
import LoginModal from '../components/modal/LoginModal'
import ccsLogo from '../uploads/download.png'

export default function Landing() {
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f0520]' : 'bg-white'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* HEADER */}
      <header className={`sticky top-0 z-40 flex justify-between items-center px-8 lg:px-16 py-4 backdrop-blur-md border-b transition-colors duration-300 ${isDark ? 'bg-[#140528]/85 border-[#c89b2a]/20' : 'bg-white/85 border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${isDark ? 'bg-amber-600' : 'bg-[#7c1fa0]'}`}>CCS</div>
          <span className={`font-serif text-lg font-extrabold ${isDark ? 'text-[#e2c97e]' : 'text-[#7c1fa0]'}`}>Sit-in System</span>
        </div>

        <nav className="flex items-center gap-6 lg:gap-8">
          <a className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>Home</a>

          {/* DROPDOWN (Fixed using Tailwind group-hover) */}
          <div className="group relative py-4 -my-4">
            <a className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>Community ▾</a>
            <div className={`absolute top-full left-0 w-40 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border ${isDark ? 'bg-[#1e0838] border-[#c89b2a]/20' : 'bg-white border-slate-200'}`}>
              {['Forums', 'Events', 'Members'].map(item => (
                <div key={item} className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#7c1fa0] hover:bg-[#2d0f4d]' : 'text-slate-600 hover:text-[#7c1fa0] hover:bg-slate-50'}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <a className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>About</a>
          <a onClick={() => setShowLogin(true)} className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>Log in</a>
          
          {/* Subtle Secondary Button (CANCEL/THEME) */}
          <button onClick={() => setIsDark(!isDark)} className={`text-xl p-2 rounded-full transition-all duration-200 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`} title="Toggle Theme">
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Solid Confirmation Button (PRIMARY) */}
          <button onClick={() => setShowRegister(true)} className={`text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-md hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'}`}>
            Register
          </button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-12 lg:px-20 gap-12 lg:gap-20 relative overflow-hidden">
        
        {/* Background Blobs */}
        <div className={`absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-[#7c1fa0]/30' : 'bg-[#7c1fa0]/10'}`} />
        <div className={`absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-[#c89b2a]/20' : 'bg-[#c89b2a]/10'}`} />

        {/* Left Content */}
        <div className="flex-1 z-10" style={{ animation: 'fadeUp 0.8s ease forwards' }}>
          <div className={`inline-block border rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6 ${isDark ? 'bg-[#c89b2a]/10 border-[#c89b2a]/30 text-[#c89b2a]' : 'bg-[#f3e8ff] border-[#e9d5ff] text-[#7c1fa0]'}`}>
            UC · College of Computer Studies
          </div>

          <h1 className="font-serif text-[clamp(5rem,10vw,9rem)] font-black leading-none bg-[length:200%_auto] bg-clip-text text-transparent mb-7" style={{ animation: 'shimmer 4s linear infinite', backgroundImage: isDark ? 'linear-gradient(to right, #c89b2a, #e2c97e, #c89b2a)' : 'linear-gradient(to right, #7c1fa0, #c89b2a, #7c1fa0)' }}>
            SITSIT
          </h1>

          <p className={`text-lg leading-relaxed max-w-md mb-9 font-medium ${isDark ? 'text-purple-200/70' : 'text-slate-600'}`}>
            A modern, streamlined sit-in management system designed to make tracking computer lab sessions effortless. Log in, claim your seat, and get to work.
          </p>

          <div className="flex gap-4">
            {/* Solid Confirmation Button (PRIMARY) */}
            <button onClick={() => setShowRegister(true)} className={`text-white font-bold font-serif px-8 py-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'}`}>
              Get Started
            </button>
            {/* Subtle Secondary Button (CANCEL) */}
            <button className={`p-0.5 rounded-full font-serif font-bold group transition-all duration-200 ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'}`}>
                <div className={`px-7 py-3 rounded-full text-slate-600 ${isDark ? 'bg-[#1a0830] text-[#e2c97e]' : 'bg-white text-[#7c1fa0]'}`}>
                    Learn More
                </div>
            </button>
          </div>
        </div>

        {/* Right Content (Logo) */}
        <div className="flex-1 flex justify-center items-center z-10" style={{ animation: 'float 5s ease-in-out infinite' }}>
          <div className="relative w-72 h-72 lg:w-80 lg:h-80">
            <div className={`absolute -inset-6 rounded-full blur-2xl transition-opacity duration-300 ${isDark ? 'bg-gradient-to-tr from-[#7c1fa0] to-[#c89b2a] opacity-50' : 'bg-gradient-to-tr from-[#7c1fa0] to-[#c89b2a] opacity-20'}`} />
            <div className={`absolute -inset-1 rounded-full p-1 ${isDark ? 'bg-amber-600' : 'bg-[#7c1fa0]'}`}>
              <div className={`w-full h-full rounded-full transition-colors duration-300 ${isDark ? 'bg-[#0f0520]' : 'bg-white'}`} />
            </div>
            <img src={ccsLogo} alt="CCS Logo" className="relative w-full h-full object-contain rounded-full z-10" />
          </div>
        </div>
      </main>

      {/* MODALS */}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} isDark={isDark} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} isDark={isDark} />}
    </div>
  )
}