import React, { useEffect, useState } from 'react';

export default function EditAnnouncementModal({ announcement, onClose, onSuccess }) {
  const [content, setContent] = useState('');

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
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4a0080]">Edit Announcement</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            className="w-full min-h-40 border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-[#4a0080]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-200 rounded-lg font-bold text-slate-700">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#4a0080] hover:bg-purple-900 text-white rounded-lg font-bold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
