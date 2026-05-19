import React from 'react';

export default function FeedbackModal({ isOpen, onClose, feedback }) {
  if (!isOpen) return null;
  const isDark = localStorage.getItem('isDark') === 'true';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className={`rounded-xl shadow-xl w-full max-w-md overflow-hidden ${isDark ? 'bg-[#1e0838] border border-purple-500/20' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className={`flex items-center gap-3 mb-4 border-b pb-3 ${isDark ? 'border-purple-500/10' : 'border-slate-100'}`}>
            <div className={`p-2 rounded-full ${isDark ? 'bg-[#c89b2a]/15 text-[#c89b2a]' : 'bg-[#4a0080]/10 text-[#4a0080]'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>Admin Feedback</h3>
          </div>
          
          <div className={`border rounded-lg p-4 mb-6 min-h-[120px] text-sm ${isDark ? 'bg-[#2d114d]/30 border-purple-500/10' : 'bg-slate-50 border-slate-100'}`}>
            {feedback ? (
              <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{feedback}</p>
            ) : (
              <p className={`italic flex items-center justify-center h-full ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>No feedback provided for this session.</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="bg-[#c89b2a] hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
