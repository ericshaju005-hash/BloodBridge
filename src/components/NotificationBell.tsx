import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink, Activity } from 'lucide-react';
import { notificationService, NotificationItem } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    const list = notificationService.getNotifications(currentUser?.id);
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => loadNotifications();
    window.addEventListener('bloodbridge_storage_update', handleUpdate);
    return () => window.removeEventListener('bloodbridge_storage_update', handleUpdate);
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(currentUser?.id);
    loadNotifications();
  };

  const handleItemClick = (id: string) => {
    notificationService.markAsRead(id);
    loadNotifications();
    setIsOpen(false);
  };

  const simulateNewEmergency = () => {
    notificationService.createNotification({
      userId: currentUser?.id || 'all',
      title: 'Emergency Match Detected',
      message: 'Urgent requirement for O+ blood at Lilavati Hospital, Mumbai. 2 units needed.',
      type: 'request',
      link: '/find-donors'
    });
    loadNotifications();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !item.read ? 'bg-red-50/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-semibold ${!item.read ? 'text-red-900' : 'text-slate-800'}`}>
                      {item.title}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.link && (
                      <Link
                        to={item.link}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-0.5"
                      >
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={simulateNewEmergency}
              className="text-[11px] font-medium text-slate-600 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              Simulate Demo Alert
            </button>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-red-600 hover:text-red-700"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
