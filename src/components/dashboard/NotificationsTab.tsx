import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  HeartPulse,
  UserCheck,
  ShieldCheck,
  Calendar,
  Filter,
  Trash2,
  Clock,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'blood' | 'volunteer' | 'security' | 'event' | 'system';
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  priority: 'high' | 'medium' | 'low';
}

export const NotificationsTab: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Emergency Blood Request: B+ Platelets (Orange City Hospital)',
      description: 'Patient admitted in ICU requires 2 units B+ blood within 6 hours. Alert sent to 38 registered donors.',
      category: 'blood',
      timestamp: '15 minutes ago',
      isRead: false,
      actionLabel: 'Coordinate Donors',
      priority: 'high',
    },
    {
      id: 'notif-2',
      title: 'New Volunteer Application Queue',
      description: '12 first-year engineering students submitted NSS Unit 04 & 05 enrollment forms pending review.',
      category: 'volunteer',
      timestamp: '1 hour ago',
      isRead: false,
      actionLabel: 'Review Queue',
      priority: 'medium',
    },
    {
      id: 'notif-3',
      title: 'Administrative 2FA Login Detected',
      description: 'Successful passcode verification for Programme Officer Anand Verma from IP 192.168.1.45.',
      category: 'security',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'low',
    },
    {
      id: 'notif-4',
      title: 'Special Winter Camp 2026 Budget Approved',
      description: 'Directorate cleared the 7-day residential camp budget for adopted village Sonkhamb.',
      category: 'event',
      timestamp: 'Yesterday',
      isRead: true,
      actionLabel: 'View Schedule',
      priority: 'medium',
    },
    {
      id: 'notif-5',
      title: 'Automated Google Sheets Data Backup Completed',
      description: 'Synchronized 450 volunteer service records and attendance logs with Google Drive cloud archive.',
      category: 'system',
      timestamp: '2 days ago',
      isRead: true,
      priority: 'low',
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.category === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-slate-200 shadow-xs rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Bell size={14} />
            <span>Unit Alerts & Communications</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Notifications Center</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 font-bold rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts, emergency blood requests, security events, and volunteer workflow alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck size={14} />
              <span>Mark All as Read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 border border-slate-300 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 border border-slate-200 rounded-lg shadow-2xs text-xs font-semibold">
        <span className="text-slate-400 flex items-center gap-1 mr-1">
          <Filter size={13} />
          <span>Filter:</span>
        </span>
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'blood', label: 'Blood Registry' },
          { id: 'volunteer', label: 'Volunteer Queue' },
          { id: 'security', label: 'Security & 2FA' },
          { id: 'system', label: 'Cloud System' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === btn.id
                ? 'bg-[#0B1528] text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center border border-slate-200 rounded-lg text-slate-400 text-xs">
            No notifications matching this category.
          </div>
        ) : (
          filtered.map((item) => {
            const getCategoryIcon = () => {
              switch (item.category) {
                case 'blood':
                  return <HeartPulse className="text-red-600" size={16} />;
                case 'volunteer':
                  return <UserCheck className="text-blue-600" size={16} />;
                case 'security':
                  return <ShieldCheck className="text-emerald-600" size={16} />;
                case 'event':
                  return <Calendar className="text-purple-600" size={16} />;
                default:
                  return <AlertTriangle className="text-slate-600" size={16} />;
              }
            };

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all flex items-start justify-between gap-4 ${
                  item.isRead
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/40 border-blue-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                      item.category === 'blood'
                        ? 'bg-red-50'
                        : item.category === 'volunteer'
                        ? 'bg-blue-50'
                        : item.category === 'security'
                        ? 'bg-emerald-50'
                        : 'bg-slate-100'
                    }`}
                  >
                    {getCategoryIcon()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs ${
                          item.isRead ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {item.priority === 'high' && (
                        <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-1.5 py-0.2 rounded-xs">
                          Urgent
                        </span>
                      )}
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <Clock size={11} />
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="uppercase font-mono tracking-wider text-[10px]">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleRead(item.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 text-xs"
                    title={item.isRead ? 'Mark as unread' : 'Mark as read'}
                  >
                    <CheckCheck size={14} className={item.isRead ? 'text-slate-400' : 'text-blue-600'} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
