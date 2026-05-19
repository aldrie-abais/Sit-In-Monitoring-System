import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, isDark }) {
  const [credentials, setCredentials] = useState({
    idNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

const handleLogin = (e) => {
  e.preventDefault();

  fetch(`${import.meta.env.VITE_API_BASE_URL}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
    .then(response => response.json())
    .then(data => {
      // 1. First, check the status from PHP
      if (data.status === 'success') {
    localStorage.setItem('isLoggedIn', 'true'); // Must be a string
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Use a small timeout if the redirect is too fast for your machine
    setTimeout(() => {
        navigate('/dashboard', { replace: true });
        onClose();
    }, 100); 
} else {
        // 3. If PHP sent an error (like "Invalid password"), show that message instead
        alert('Login Failed: ' + data.message);
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      alert("Could not connect to the server.");
    });
};

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`} 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className={`sticky top-0 z-20 px-9 py-7 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-[#1a0830]/80 border-[#c89b2a]/20' : 'bg-white/80 border-slate-200'}`}>
          <p className={`font-serif text-3xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-[#4a0080]'}`}>
            Welcome Back
          </p>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-purple-200/70' : 'text-slate-500'}`}>
            Log in to your CCS Sit-in account
          </p>
        </div>

        <div className={`px-9 pt-7 pb-8 transition-colors duration-300 ${isDark ? 'bg-[#1a0830]' : 'bg-white'}`}>
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors">✕</button>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input 
              name="idNumber"
              type="text" 
              placeholder="ID Number"
              onChange={handleChange}
              required
              className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none border ${isDark ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff]' : 'bg-slate-50 border-slate-300'}`}
            />
            <div className="relative">
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                onChange={handleChange}
                required
                className={`w-full rounded-xl pl-4 pr-11 py-3 text-sm font-medium outline-none border ${isDark ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff]' : 'bg-slate-50 border-slate-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-amber-500 ${isDark ? 'text-purple-200/50' : 'text-slate-400'}`}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex justify-end -mt-1 mb-1">
              <button type="button" className={`text-xs font-bold hover:underline ${isDark ? 'text-purple-200/70' : 'text-slate-500'}`}>Forgot Password?</button>
            </div>

            <button 
              type="submit" 
              className={`mt-1 py-3.5 rounded-xl text-white font-bold text-lg font-serif tracking-wide shadow-md active:scale-[0.98] transition-all ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'}`}
            >
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}