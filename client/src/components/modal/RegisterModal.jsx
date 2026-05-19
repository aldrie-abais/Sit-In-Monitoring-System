import React, { useState } from 'react';

export default function RegisterModal({ onClose, isDark }) {
  // 1. Create state to hold all the form inputs
  const [formData, setFormData] = useState({
    idNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    courseLevel: '',
    course: '',
    email: '',
    address: '',
    password: '',
    repeatPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // 2. Handle input changes and update state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic validation
    if (formData.password !== formData.repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send data to PHP
    fetch(`${import.meta.env.VITE_API_BASE_URL}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Registration successful!');
        onClose(); 
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => console.error("Error connecting to server:", error));
};

  // 4. Update the input map to include the specific "name" keys we used in state
  const inputFields = [
    { p: 'ID Number', name: 'idNumber', col: 2 },
    { p: 'First Name', name: 'firstName' },
    { p: 'Last Name', name: 'lastName' },
    { p: 'Middle Name', name: 'middleName' },
    { p: 'Course Level', name: 'courseLevel' },
    { p: 'Course', name: 'course' },
    { p: 'Email', name: 'email', t: 'email' },
    { p: 'Address', name: 'address', col: 2 },
    { p: 'Password', name: 'password', t: 'password' },
    { p: 'Repeat Password', name: 'repeatPassword', t: 'password' }
  ];

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`} 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className={`sticky top-0 z-20 px-9 py-7 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-[#1a0830]/80 border-[#c89b2a]/20' : 'bg-white/80 border-slate-200'}`}>
          <p className={`font-serif text-3xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-[#4a0080]'}`}>
            Create an Account
          </p>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-purple-200/70' : 'text-slate-500'}`}>
            Join the CCS Sit-in Monitoring System
          </p>
        </div>

        <div className={`px-9 pt-7 pb-8 transition-colors duration-300 ${isDark ? 'bg-[#1a0830]' : 'bg-white'}`}>
          <button 
            onClick={onClose} 
            className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
              isDark ? 'bg-white/10 text-[#e2c97e] hover:bg-white/20' : 'bg-black/5 text-slate-600 hover:bg-black/10'
            }`}
          >
            ✕
          </button>

          {/* ADDED onSubmit HERE */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inputFields.map(({ p, name, col, t: type = 'text' }) => {
              const isPasswordField = name === 'password' || name === 'repeatPassword';
              const showCurrent = name === 'password' ? showPassword : showRepeatPassword;
              const setShowCurrent = name === 'password' ? setShowPassword : setShowRepeatPassword;
              
              if (isPasswordField) {
                return (
                  <div key={name} className={`relative w-full ${col === 2 ? 'md:col-span-2' : ''}`}>
                    <input 
                      name={name}
                      type={showCurrent ? "text" : "password"} 
                      placeholder={p}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-xl pl-4 pr-11 py-3 text-sm font-medium outline-none transition-all border ${
                        isDark 
                          ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff] focus:border-[#7c1fa0]' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c1fa0] focus:ring-2 focus:ring-[#7c1fa0]/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-amber-500 ${isDark ? 'text-purple-200/50' : 'text-slate-400'}`}
                    >
                      {showCurrent ? (
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
                );
              }

              return (
                <input 
                  key={name} 
                  name={name}
                  type={type} 
                  placeholder={p}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all border ${col === 2 ? 'md:col-span-2' : ''} ${
                    isDark 
                      ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff] focus:border-[#7c1fa0]' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c1fa0] focus:ring-2 focus:ring-[#7c1fa0]/10'
                  }`}
                />
              );
            })}

            <button 
              type="submit" // Changed to type="submit"
              className={`md:col-span-2 mt-3 py-3.5 rounded-xl text-white font-bold text-lg font-serif tracking-wide shadow-md active:scale-[0.98] transition-all ${
                isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'
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