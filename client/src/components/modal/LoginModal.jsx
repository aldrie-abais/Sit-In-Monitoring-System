import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, isDark }) {
  const [credentials, setCredentials] = useState({
    idNumber: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

const handleLogin = (e) => {
  e.preventDefault();

  fetch('http://localhost:8080/api/login.php', {
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
        <div className="bg-gradient-to-br from-[#4a0080] via-[#7c1fa0] to-[#c89b2a] px-9 py-7">
          <p className="font-serif text-3xl font-bold text-white tracking-wide">Welcome Back</p>
          <p className="text-white/85 text-sm mt-1 font-medium">Log in to your CCS Sit-in account</p>
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
            <input 
              name="password"
              type="password" 
              placeholder="Password"
              onChange={handleChange}
              required
              className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none border ${isDark ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff]' : 'bg-slate-50 border-slate-300'}`}
            />

            <div className="flex justify-end -mt-1 mb-1">
              <button type="button" className="text-xs font-bold hover:underline">Forgot Password?</button>
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