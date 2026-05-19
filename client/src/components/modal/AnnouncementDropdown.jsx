import React, { useEffect, useMemo, useState } from 'react';

export default function AnnouncementDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [lastSeenAt, setLastSeenAt] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || {};
    return localStorage.getItem(`announcement_last_seen_${savedUser.user_id || 'guest'}`) || '1970-01-01T00:00:00.000Z';
  });
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};

  const storageKey = useMemo(() => `announcement_last_seen_${savedUser.user_id || 'guest'}`, [savedUser.user_id]);

  const fetchAnnouncements = () => {
    fetch('http://localhost:8080/api/get_announcements.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAnnouncements(data.announcements || []);
        }
      })
      .catch(err => console.error('Failed to fetch announcements:', err));
  };

  useEffect(() => {
    fetchAnnouncements();
    const intervalId = setInterval(fetchAnnouncements, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const unreadCount = announcements.filter(item => new Date(item.date_posted).getTime() > new Date(lastSeenAt).getTime()).length;

  const markAllAsSeen = () => {
    if (announcements.length === 0) return;
    const newestAnnouncement = announcements.reduce((latest, item) => {
      return new Date(item.date_posted).getTime() > new Date(latest.date_posted).getTime() ? item : latest;
    }, announcements[0]);

    const nextSeenAt = new Date(newestAnnouncement.date_posted).toISOString();
    setLastSeenAt(nextSeenAt);
    localStorage.setItem(storageKey, nextSeenAt);
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative text-slate-600 hover:text-[#7c1fa0] transition-colors font-medium text-sm flex items-center gap-2"
        title="Announcements"
      >
        <span>Announcement</span>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-5 px-1.5 h-5 text-[11px] font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Announcements</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsSeen();
                    }}
                    className="text-xs text-[#4a0080] hover:text-[#7c1fa0] font-semibold transition-colors"
                  >
                    Mark All as Read
                  </button>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {announcements.length > 0 ? (
              announcements.map((item) => (
                <div key={item.id} className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-[#4a0080]">{item.admin_name}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(item.date_posted)}</p>
                  <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-500">
                <p className="text-sm">No announcements yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
