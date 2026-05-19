import React, { useState, useEffect, useRef } from 'react';

export default function NotificationDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};

  // Fetch notifications
  const fetchNotifications = () => {
    if (!savedUser.user_id) return;

    fetch('http://localhost:8080/api/get_notifications.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: savedUser.user_id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    })
    .catch(err => console.error("Failed to fetch notifications:", err));
  };

  // Fetch notifications on component mount and set up auto-refresh
  useEffect(() => {
    fetchNotifications();
    // Refresh every 5 seconds
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, [savedUser.user_id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark notification as read
  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation();
    
    fetch('http://localhost:8080/api/mark_notification_read.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification_id: notificationId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        fetchNotifications(); // Refresh to update unread count
      }
    })
    .catch(err => console.error("Failed to mark notification as read:", err));
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    if (!savedUser.user_id) return;

    fetch('http://localhost:8080/api/mark_all_notifications_read.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: savedUser.user_id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        fetchNotifications();
      }
    })
    .catch(err => console.error("Failed to mark all as read:", err));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'admitted':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case 'session_started':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'session_ended':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        );
    }
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
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-slate-600 hover:text-[#7c1fa0] transition-colors font-medium text-sm flex items-center gap-2"
        title="Notifications"
      >
        <span>Notification</span>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <>
                  <button
                    onClick={handleMarkAllAsRead}
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

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={(e) => handleMarkAsRead(notif.id, e)}
                  className={`px-4 py-3 border-b border-slate-100 cursor-pointer transition-colors ${
                    notif.is_read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-1">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notif.is_read ? 'text-slate-600' : 'text-slate-800 font-semibold'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(notif.created_at)}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-500">
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 text-center border-t border-slate-200">
              <button
                onClick={() => fetchNotifications()}
                className="text-xs text-[#4a0080] hover:text-[#7c1fa0] font-semibold transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
