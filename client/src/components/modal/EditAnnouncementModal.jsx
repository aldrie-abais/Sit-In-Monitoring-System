import React, { useEffect, useState } from 'react';

export default function EditAnnouncementModal({ announcement, onClose, onSuccess }) {
  const [content, setContent] = useState('');
  const isDark = localStorage.getItem('isDark') === 'true';

  useEffect(() => {
    setContent(announcement?.content || '');
  }, [announcement]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/edit_announcement.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: announcement.id, content })
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
      .catch(error => console.error('Error updating announcement:', error));
  };

  return (
    <div className={`fixed inset-0 z-110 flex items-center justify-center backdrop-blur-sm p-4 ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`} onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-[#1e0838] border border-purple-500/20' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-purple-500/20' : 'border-slate-200'}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>Edit Announcement</h2>
          <button onClick={onClose} className={`font-bold text-xl ${isDark ? 'text-purple-400 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            className={`w-full min-h-40 border rounded-lg p-3 text-sm outline-none ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40 focus:border-[#c89b2a]' : 'border-slate-300 focus:border-[#4a0080]'}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className={`flex-1 py-2 rounded-lg font-bold ${isDark ? 'bg-white/10 text-purple-200 hover:bg-white/15' : 'bg-slate-200 text-slate-700'}`}>Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#4a0080] hover:bg-purple-900 text-white rounded-lg font-bold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
