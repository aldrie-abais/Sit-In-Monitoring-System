import React from 'react';

export default function FeatureComingSoonModal({ onClose, title = 'Feature Coming Soon', message = 'This feature will be available soon!' }) {
  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#4a0080]">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl" aria-label="Close coming soon modal">
            ×
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-slate-700 text-sm leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="mt-6 bg-[#4a0080] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-purple-900 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}