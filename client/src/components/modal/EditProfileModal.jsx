import React, { useState, useEffect } from 'react';

export default function EditProfileModal({ onClose, isDark = false, onProfileUpdate }) {
  // 1. Load the current user data so we can pre-fill the form
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};
  
  const [formData, setFormData] = useState({
    user_id: savedUser.user_id || '',
    firstName: savedUser.user_first_name || '',
    lastName: savedUser.user_last_name || '',
    middleName: savedUser.user_middle_name || '',
    courseLevel: savedUser.user_course_level || '',
    course: savedUser.user_course_name || '',
    email: savedUser.user_email || '',
    address: savedUser.user_address || '',
    password: '', // Leave blank so we don't expose the old one
    repeatPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send the updated data to our new PHP endpoint
    fetch('http://localhost:8080/api/edit_profile.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          // 1. Overwrite the old localStorage data with the fresh DB row
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // 2. Tell the Dashboard to refresh its data
          onProfileUpdate();
          
          alert('Profile updated successfully!');
          onClose(); 
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => console.error("Error updating profile:", error));
  };

  const inputFields = [
    { p: 'First Name', name: 'firstName' },
    { p: 'Last Name', name: 'lastName' },
    { p: 'Middle Name', name: 'middleName' },
    { p: 'Course Level', name: 'courseLevel' },
    { p: 'Course', name: 'course' },
    { p: 'Email', name: 'email', t: 'email' },
    { p: 'Address', name: 'address', col: 2 },
    { p: 'New Password (Leave blank to keep current)', name: 'password', t: 'password' },
    { p: 'Repeat New Password', name: 'repeatPassword', t: 'password' }
  ];

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`} 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        {/* Glassmorphism Header */}
        <div className={`sticky top-0 z-20 px-9 py-7 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-[#1a0830]/80 border-[#c89b2a]/20' : 'bg-white/80 border-slate-200'}`}>
          <button 
            onClick={onClose} 
            className={`absolute top-7 right-7 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${isDark ? 'bg-white/10 text-[#e2c97e] hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >✕</button>
          <p className={`font-serif text-3xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-[#4a0080]'}`}>
            Edit Profile
          </p>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-purple-200/70' : 'text-slate-500'}`}>
            Update your personal details in the database
          </p>
        </div>

        {/* Scrollable Form Area */}
        <div className={`overflow-y-auto px-9 pt-7 pb-8 transition-colors duration-300 custom-scrollbar ${isDark ? 'bg-[#1a0830]' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* ID Number is disabled so they can't change their primary key! */}
            <div className="md:col-span-2">
              <label className={`text-xs font-bold mb-1 block ${isDark ? 'text-purple-300/50' : 'text-slate-400'}`}>ID Number (Cannot be changed)</label>
              <input 
                type="text" 
                value={savedUser.user_id || ''} 
                disabled 
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none border cursor-not-allowed ${isDark ? 'bg-black/20 border-white/5 text-white/40' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
              />
            </div>

            {inputFields.map(({ p, name, col, t: type = 'text' }) => (
              <input 
                key={name} 
                name={name} 
                type={type} 
                placeholder={p}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all border ${col === 2 ? 'md:col-span-2' : ''} ${
                  isDark 
                    ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff] focus:border-[#7c1fa0]' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c1fa0] focus:ring-2 focus:ring-[#7c1fa0]/10'
                }`}
              />
            ))}

            <button 
              type="submit" 
              className={`md:col-span-2 mt-3 py-3.5 rounded-xl text-white font-bold text-lg font-serif tracking-wide shadow-md active:scale-[0.98] transition-all bg-[#7c1fa0] hover:bg-purple-800`}
            >
              SAVE CHANGES
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}