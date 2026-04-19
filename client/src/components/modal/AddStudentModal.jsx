import React, { useEffect, useState } from 'react';

export default function AddStudentModal({ onClose, onSuccess, isDark = false, mode = 'add', student = null }) {
  const [formData, setFormData] = useState({
    user_id: '',
    user_first_name: '',
    user_last_name: '',
    user_middle_name: '',
    user_course_level: '',
    user_course_name: '',
    user_email: '',
    user_address: '',
    remaining_sessions: 30,
    user_password: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        user_id: student.user_id || '',
        user_first_name: student.user_first_name || '',
        user_last_name: student.user_last_name || '',
        user_middle_name: student.user_middle_name || '',
        user_course_level: student.user_course_level || '',
        user_course_name: student.user_course_name || '',
        user_email: student.user_email || '',
        user_address: student.user_address || '',
        remaining_sessions: student.remaining_sessions ?? 30,
        user_password: ''
      });
    }
  }, [student]);

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); 

    const endpoint = mode === 'edit' ? 'http://localhost:8080/api/edit_student.php' : 'http://localhost:8080/api/admin_register.php';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert(data.message);
        onSuccess(); 
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => console.error("Error connecting to server:", error));
  };

  // 4. Input map for the grid layout (matching your sleek design)
  const inputFields = [
    { p: 'ID Number', name: 'user_id', col: 2, disabled: mode === 'edit' },
    { p: 'First Name', name: 'user_first_name' },
    { p: 'Last Name', name: 'user_last_name' },
    { p: 'Middle Name (Optional)', name: 'user_middle_name' },
    { p: 'Year Level (e.g., 3)', name: 'user_course_level', t: 'number' },
    { p: 'Course', name: 'user_course_name', isSelect: true },
    { p: 'Email', name: 'user_email', t: 'email' },
    { p: 'Address', name: 'user_address', col: 2 },
    { p: 'Remaining Sessions', name: 'remaining_sessions', t: 'number' },
    { p: mode === 'edit' ? 'New Password (Leave blank to keep current)' : 'Assign Password', name: 'user_password', t: 'password', col: 2 }
  ];

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-[110] p-4 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`} 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={`sticky top-0 z-20 px-9 py-7 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-[#1a0830]/80 border-[#c89b2a]/20' : 'bg-white/80 border-slate-200'}`}>
          <p className={`font-serif text-3xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-[#4a0080]'}`}>
            {mode === 'edit' ? 'Edit Student' : 'Add New Student'}
          </p>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-purple-200/70' : 'text-slate-500'}`}>
            {mode === 'edit' ? 'Update the selected student information.' : 'Register a new student account to the database.'}
          </p>
        </div>

        {/* BODY */}
        <div className={`px-9 pt-7 pb-8 transition-colors duration-300 ${isDark ? 'bg-[#1a0830]' : 'bg-white'}`}>
          <button 
            onClick={onClose} 
            className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
              isDark ? 'bg-white/10 text-[#e2c97e] hover:bg-white/20' : 'bg-black/5 text-slate-600 hover:bg-black/10'
            }`}
          >
            ✕
          </button>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inputFields.map(({ p, name, col, t: type = 'text', isSelect }) => {
              
              // Base classes for both inputs and selects
              const baseClasses = `w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all border ${col === 2 ? 'md:col-span-2' : ''} ${
                isDark 
                  ? 'bg-white/5 border-[#c89b2a]/30 text-[#f3e8ff] focus:border-[#7c1fa0]' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c1fa0] focus:ring-2 focus:ring-[#7c1fa0]/10'
              }`;

              // Render a Dropdown for the Course field
              if (isSelect) {
                return (
                  <select
                    key={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className={baseClasses}
                  >
                    <option value="" disabled>Select Course</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSIS">BSIS</option>
                  </select>
                );
              }

              // Render standard inputs for everything else
              return (
                <input 
                  key={name} 
                  name={name}
                  type={type} 
                  placeholder={p}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== 'user_middle_name' && !(mode === 'edit' && name === 'user_password')}
                  className={baseClasses}
                />
              );
            })}

            {/* ACTION BUTTONS */}
            <div className="md:col-span-2 flex gap-3 mt-3">
              <button 
                type="button" 
                onClick={onClose}
                className={`flex-1 py-3.5 rounded-xl font-bold text-lg font-serif tracking-wide shadow-sm active:scale-[0.98] transition-all ${
                  isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                CANCEL
              </button>
              <button 
                type="submit"
                className={`flex-1 py-3.5 rounded-xl text-white font-bold text-lg font-serif tracking-wide shadow-md active:scale-[0.98] transition-all ${
                  isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'
                }`}
              >
                ADD STUDENT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}