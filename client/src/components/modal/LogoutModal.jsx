import React, { useState, useEffect } from 'react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: '0h 0m',
    sessionsLeft: 0,
    averageDuration: '0h 0m',
    longestDuration: '0h 0m',
    currentSession: null
  });

  const [feedback, setFeedback] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const isDark = localStorage.getItem('isDark') === 'true';

  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    setStats(prev => ({ ...prev, sessionsLeft: user?.remaining_sessions || 0 }));

    if (user && user.user_id) {
      const userRole = (user.role || user.user_role || '').toLowerCase();
      if (userRole === 'admin') {
        setStats({
          totalHours: null,
          sessionsLeft: null,
          averageDuration: null,
          longestDuration: null,
          currentSession: null
        });
        setLoading(false);
      } else {
        Promise.all([
          fetch('http://localhost:8080/api/get_student_history.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.user_id })
          }).then(res => res.json()),
          fetch('http://localhost:8080/api/check_session.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.user_id })
          }).then(res => res.json())
        ])
        .then(([historyData, sessionData]) => {
          let liveRemaining = user?.remaining_sessions || 0;
          if (sessionData.status === 'success') {
            liveRemaining = sessionData.remaining_sessions;
          }

          if (historyData.status === 'success' && historyData.history) {
            computeStats(historyData.history, liveRemaining);
          } else {
            setStats(prev => ({ ...prev, sessionsLeft: liveRemaining }));
            setLoading(false);
          }
        })
        .catch(err => {
          console.error('Failed to fetch data:', err);
          setLoading(false);
        });
      }
    } else {
      setLoading(false);
    }
  }, [isOpen]);

  const computeStats = (history, liveRemaining) => {
    if (!history || history.length === 0) {
      setStats(prev => ({ ...prev, sessionsLeft: liveRemaining }));
      setLoading(false);
      return;
    }

    let totalMinutes = 0;
    let maxMinutes = 0;
    let completedCount = 0;
    let currentSessionMinutes = null;

    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      let d = new Date(timeStr);
      if (!isNaN(d.getTime())) return d;
      d = new Date(`2000/01/01 ${timeStr}`);
      if (!isNaN(d.getTime())) return d;
      return null;
    };

    history.forEach(session => {
      if (!session.time_in) return;

      const inDate = parseTime(session.time_in);
      let outDate;
      let isCurrent = false;

      if (session.time_out) {
        outDate = parseTime(session.time_out);
        completedCount++;
      } else {
        // Active session: use current time to compute ongoing duration
        outDate = new Date();
        isCurrent = true;
      }
      
      if (!inDate || !outDate) return;

      let diffMinutes = Math.floor((outDate - inDate) / 60000);
      
      if (diffMinutes < 0) {
        // Handle midnight crossover if any
        diffMinutes += 24 * 60;
      }

      totalMinutes += diffMinutes;
      if (diffMinutes > maxMinutes) {
        maxMinutes = diffMinutes;
      }
      if (isCurrent) {
        currentSessionMinutes = diffMinutes;
      }
    });

    const avgMinutes = history.length > 0 ? Math.floor(totalMinutes / history.length) : 0;

    setStats({
      totalHours: formatMinutes(totalMinutes),
      sessionsLeft: liveRemaining,
      averageDuration: formatMinutes(avgMinutes),
      longestDuration: formatMinutes(maxMinutes),
      currentSession: currentSessionMinutes !== null ? formatFriendlyDuration(currentSessionMinutes) : null
    });
    setLoading(false);
  };

  const formatFriendlyDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) {
      return `${h} ${h === 1 ? 'hr' : 'hrs'} ${m} ${m === 1 ? 'min' : 'mins'}`;
    } else {
      return `${m} ${m === 1 ? 'min' : 'mins'}`;
    }
  };

  const formatMinutes = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  if (!isOpen) return null;

  const userRole = (user?.role || user?.user_role || '').toLowerCase();
  if (userRole === 'admin') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className={`rounded-xl shadow-xl w-full max-w-sm overflow-hidden ${isDark ? 'bg-[#1e0838] border border-purple-500/20' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
          <div className="p-6 text-center">
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>Ready to leave?</h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all ${isDark ? 'bg-white/10 text-purple-200 hover:bg-white/15 border border-purple-500/20' : 'bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'}`}
              >
                Cancel
              </button>
              <button 
                onClick={() => onConfirm(feedback)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className={`rounded-xl shadow-xl w-full max-w-md overflow-hidden ${isDark ? 'bg-[#1e0838] border border-purple-500/20' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h3 className={`text-2xl font-bold mb-2 text-center ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>Ready to leave?</h3>
          <p className={`text-center mb-6 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Are you sure you want to log out?</p>

          {/* Current Session Display */}
          <div className={`flex justify-between items-center p-4 rounded-xl mb-6 ${isDark ? 'bg-[#c89b2a]/15 border border-[#c89b2a]/25' : 'bg-[#c89b2a]/10 border border-[#c89b2a]/20'}`}>
            <span className="text-sm font-bold text-[#c89b2a]">Current Session</span>
            <span className="text-sm font-bold text-[#c89b2a]">
              {stats.currentSession !== null ? stats.currentSession : '—'}
            </span>
          </div>

          {user?.user_role !== 'Admin' && (
            <div className={`border rounded-lg p-5 mb-6 ${isDark ? 'bg-[#2d114d]/30 border-purple-500/10' : 'bg-slate-50 border-slate-100'}`}>
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 ${isDark ? 'text-purple-200 border-purple-500/10' : 'text-slate-700 border-slate-200'}`}>Your Sit-In Summary</h4>
              
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-6 h-6 border-2 border-[#4a0080] border-t-transparent rounded-full animate-spin"></div>
                  <span className={`ml-3 text-sm ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Calculating...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Total Sit-In Hours</span>
                    <span className={`text-sm font-bold ${isDark ? 'text-purple-100' : 'text-[#4a0080]'}`}>{stats.totalHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Sessions Left</span>
                    <span className={`text-sm font-bold ${isDark ? 'text-purple-100' : 'text-[#4a0080]'}`}>{stats.sessionsLeft}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Average Session</span>
                    <span className={`text-sm font-bold ${isDark ? 'text-purple-100' : 'text-[#4a0080]'}`}>{stats.averageDuration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Longest Session</span>
                    <span className={`text-sm font-bold ${isDark ? 'text-purple-100' : 'text-[#4a0080]'}`}>{stats.longestDuration}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {user?.user_role !== 'Admin' && (
            <div className={`mb-6 ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>
              <label className="block text-sm font-bold mb-2">Session Feedback (Optional)</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your laboratory experience today..."
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#c89b2a] resize-none h-24 ${isDark ? 'bg-[#2d114d]/30 border-purple-500/30 text-white placeholder-purple-300/50' : 'bg-slate-50 border-slate-200'}`}
              ></textarea>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all ${isDark ? 'bg-white/10 text-purple-200 hover:bg-white/15 border border-purple-500/20' : 'bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'}`}
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(feedback)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
