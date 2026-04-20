import React, { useEffect, useMemo, useState } from 'react';

export default function SearchStudentModal({ onClose, onStudentFound }) {
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/get_all_students.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setStudents(data.students || []);
        }
      })
      .catch(() => {
        // Keep empty list when suggestions cannot be loaded.
      });
  }, []);

  const suggestions = useMemo(() => {
    const keyword = searchId.trim().toLowerCase();
    if (!keyword) return [];

    return students
      .filter((student) => student.user_id.toString().toLowerCase().includes(keyword))
      .slice(0, 5);
  }, [students, searchId]);

  const runSearch = (idValue) => {
    setError('');
    const targetId = (idValue ?? searchId).toString().trim();

    if (!targetId) {
      setError('Search ID is empty.');
      return;
    }

    fetch('http://localhost:8080/api/search_student.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: targetId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        if (typeof onStudentFound === 'function') {
          onStudentFound(data.student); // Pass the data to the next modal when provided
        } else {
          onClose();
        }
      } else {
        setError(data.message);
      }
    })
    .catch(err => setError("Failed to connect to server."));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch();
  };

  const handleSuggestionSelect = (studentId) => {
    setSearchId(studentId.toString());
    setShowSuggestions(false);
    runSearch(studentId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-100 p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-visible shadow-2xl min-h-80">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Search Student</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
        </div>
        
        <form onSubmit={handleSearch} className="p-6 flex flex-col items-center">
          <div className="w-full relative mb-4">
            <input 
              type="text" 
              placeholder="Search ID..." 
              className="w-full text-center border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#4a0080] focus:ring-1 focus:ring-[#4a0080]"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
              required
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg z-20 overflow-hidden">
                {suggestions.map((student) => (
                  <button
                    key={student.user_id}
                    type="button"
                    onMouseDown={() => handleSuggestionSelect(student.user_id)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <p className="text-sm font-semibold text-slate-800">{student.user_id}</p>
                    <p className="text-xs text-slate-500">
                      {student.user_first_name} {student.user_middle_name ? `${student.user_middle_name[0]}. ` : ''}{student.user_last_name}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
          <button type="submit" className="bg-[#4a0080] text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-purple-900 active:scale-95 transition-all self-end">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}