import React from 'react'

export default function RegisterModal({ onClose, isDark }) {
  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`} 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#4a0080] via-[#7c1fa0] to-[#c89b2a] px-9 py-7">
          <p className="font-serif text-3xl font-bold text-white tracking-wide">Create an Account</p>
          <p className="text-white/85 text-sm mt-1 font-medium">Join the CCS Sit-in Monitoring System</p>
        </div>

        <div className={`px-9 pt-7 pb-8 transition-colors duration-300 ${isDark ? 'bg-[#1a0830]' : 'bg-white'}`}>
          {/* Subtle Secondary Button (CANCEL) */}
          <button 
            onClick={onClose} 
            className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
              isDark 
                ? 'bg-white/10 text-[#e2c97e] hover:bg-white/20' 
                : 'bg-black/5 text-slate-600 hover:bg-black/10'
            }`}
          >
            ✕
          </button>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { p: 'ID Number', col: 2 }, { p: 'First Name' }, { p: 'Last Name' }, 
              { p: 'Middle Name' }, { p: 'Course Level' }, { p: 'Course' }, 
              { p: 'Email', t: 'email' }, { p: 'Address', col: 2 }, 
              { p: 'Password', t: 'password' }, { p: 'Repeat Password', t: 'password' }
            ].map(({ p, col, t: type = 'text' }) => (
              <input 
                key={p} type={type} placeholder={p}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all border ${col === 2 ? 'md:col-span-2' : ''} ${
                  isDark 
                    ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff] focus:border-[#7c1fa0]' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c1fa0] focus:ring-2 focus:ring-[#7c1fa0]/10'
                }`}
              />
            ))}

            {/* Solid Confirmation Button (PRIMARY) */}
            <button 
              type="button" 
              className={`md:col-span-2 mt-3 py-3.5 rounded-xl text-white font-bold text-lg font-serif tracking-wide shadow-md active:scale-[0.98] transition-all ${
                isDark 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-[#7c1fa0] hover:bg-purple-800'
              }`}
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}