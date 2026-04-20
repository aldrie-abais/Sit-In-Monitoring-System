import React, { useEffect, useState } from 'react';

export default function EditStudentModal({ onClose, onSuccess, student }) {
  const [formData, setFormData] = useState({
    user_id: '',
    user_first_name: '',
    user_middle_name: '',
    user_last_name: '',
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
        user_middle_name: student.user_middle_name || '',
        user_last_name: student.user_last_name || '',
        user_course_level: student.user_course_level || '',
        user_course_name: student.user_course_name || '',
        user_email: student.user_email || '',
        user_address: student.user_address || '',
        remaining_sessions: student.remaining_sessions ?? 30,
        user_password: ''
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/edit_student.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert(data.message);
          onSuccess(data.student);
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => console.error('Error updating student:', error));
  };

  const inputFields = [
    { p: 'ID Number', name: 'user_id', disabled: true },
    { p: 'First Name', name: 'user_first_name' },
    { p: 'Middle Name (Optional)', name: 'user_middle_name' },
    { p: 'Last Name', name: 'user_last_name' },
    { p: 'Year Level (e.g., 3)', name: 'user_course_level', t: 'number' },
    { p: 'Course', name: 'user_course_name', isSelect: true },
    { p: 'Email', name: 'user_email', t: 'email' },
    { p: 'Address', name: 'user_address', col: 2 },
    { p: 'Remaining Sessions', name: 'remaining_sessions', t: 'number' },
    { p: 'New Password (leave blank to keep current)', name: 'user_password', t: 'password', col: 2 }
  ];

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-white" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-20 px-9 py-7 border-b bg-white/80 backdrop-blur-md border-slate-200">
          <p className="font-serif text-3xl font-bold tracking-wide text-[#4a0080]">Edit Student</p>
          <p className="text-sm mt-1 font-medium text-slate-500">Update the student's information.</p>
        </div>

        <div className="px-9 pt-7 pb-8">
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-black/5 text-slate-600 hover:bg-black/10">✕</button>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inputFields.map(({ p, name, col, t: type = 'text', isSelect, disabled }) => {
              const baseClasses = `w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all border ${col === 2 ? 'md:col-span-2' : ''} ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c1fa0] focus:ring-2 focus:ring-[#7c1fa0]/10'}`;

              if (isSelect) {
                return (
                  <select key={name} name={name} value={formData[name]} onChange={handleChange} required className={baseClasses}>
                    <option value="" disabled>Select Course</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSIS">BSIS</option>
                  </select>
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
                  disabled={disabled}
                  required={name !== 'user_middle_name' && name !== 'user_password'}
                  className={baseClasses}
                />
              );
            })}

            <div className="md:col-span-2 flex gap-3 mt-3">
              <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-lg font-serif tracking-wide shadow-sm bg-slate-200 text-slate-700 hover:bg-slate-300">CANCEL</button>
              <button type="submit" className="flex-1 py-3.5 rounded-xl text-white font-bold text-lg font-serif tracking-wide shadow-md bg-[#7c1fa0] hover:bg-purple-800">SAVE CHANGES</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
