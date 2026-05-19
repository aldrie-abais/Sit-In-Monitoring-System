import React, { useState, useEffect, useRef } from 'react';

export default function EditProfileModal({ onClose, isDark = false, onProfileUpdate }) {
  // 1. Load the current user data so we can pre-fill the form
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};
  
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    savedUser.profile_picture 
      ? `http://localhost:8080/api/${savedUser.profile_picture}`
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedUser.user_first_name || 'Felix'}`
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowed.includes(file.type)) {
        alert("Invalid file format. Only JPG, JPEG, and PNG are allowed.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    const saveProfileData = () => {
      fetch('http://localhost:8080/api/edit_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            // Overwrite the old localStorage data with the fresh DB row
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Tell the Dashboard to refresh its data
            onProfileUpdate();
            
            alert('Profile updated successfully!');
            onClose(); 
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch(error => console.error("Error updating profile:", error));
    };

    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('user_id', formData.user_id);
      uploadData.append('profile_picture', selectedFile);

      fetch('http://localhost:8080/api/update_profile_picture.php', {
        method: 'POST',
        body: uploadData
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            // Update the user item in localStorage path before sending other changes
            const currentUser = JSON.parse(localStorage.getItem('user')) || {};
            currentUser.profile_picture = data.profile_picture;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            saveProfileData();
          } else {
            alert('Image upload error: ' + data.message);
          }
        })
        .catch(error => console.error("Error uploading profile picture:", error));
    } else {
      saveProfileData();
    }
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

        <div className={`overflow-y-auto px-9 pt-7 pb-8 transition-colors duration-300 custom-scrollbar ${isDark ? 'bg-[#1a0830]' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Profile Picture Section */}
            <div className="md:col-span-2 flex flex-col items-center mb-6">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 shadow-md ${isDark ? 'bg-[#0f0520] border-[#c89b2a]/30' : 'bg-slate-100 border-slate-200'}`}>
                  <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover object-center" />
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <svg className="w-8 h-8 text-[#e2c97e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className={`mt-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isDark ? 'text-[#c89b2a] hover:text-amber-400' : 'text-[#4a0080] hover:text-purple-700'
                }`}
              >
                Change Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
            </div>

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
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all border ${col === 2 ? 'md:col-span-2' : ''} ${
                    isDark 
                      ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff] focus:border-[#7c1fa0]' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c1fa0] focus:ring-2 focus:ring-[#7c1fa0]/10'
                  }`}
                />
              );
            })}

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