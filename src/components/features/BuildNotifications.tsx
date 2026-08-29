import React, { useState } from "react";
import {
  Bell, CheckCircle, XCircle, Clock, Package,
  Loader2, ChevronDown, ChevronUp, X
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

export interface BuildNotification {
  id: string;
  projectName: string;
  projectId: string;
  status: "building" | "success" | "failed";
  message: string;
  timestamp: string;
  buildType?: string;
  size?: string;
  downloadUrl?: string;
  read: boolean;
}

interface BuildNotificationsProps {
  notifications: BuildNotification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onMarkRead: (id: string) => void;
}

const BuildNotifications: React.FC<BuildNotificationsProps> = ({
  notifications, onDismiss, onDismissAll, onMarkRead
}) => {
  const [expanded, setExpanded] = useState(true);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-16 right-4 z-50 w-80 glass-crystal border border-blue-100/60 rounded-2xl shadow-2xl shadow-blue-200/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100/50 bg-white/80">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-blue-500" />
          <span className="text-sm font-bold text-gray-800">Build Notifications</span>
          {unreadCount > 0 && (
            <span className="badge-crimson">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button onClick={onDismissAll}
            className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors" title="Dismiss all">
            <X size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="max-h-64 overflow-y-auto divide-y divide-blue-50">
          {notifications.map(notif => (
            <div key={notif.id}
              className={cn("p-3 flex items-start gap-3 hover:bg-blue-50/50 transition-colors cursor-pointer",
                !notif.read && "bg-blue-50/30")}
              onClick={() => onMarkRead(notif.id)}>
              <div className="shrink-0 mt-0.5">
                {notif.status === "building" ? (
                  <Loader2 size={16} className="text-amber-500 animate-spin" />
                ) : notif.status === "success" ? (
                  <CheckCircle size={16} className="text-emerald-600" />
                ) : (
                  <XCircle size={16} className="text-rose-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{notif.projectName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                {notif.size && <p className="text-xs text-gray-400 mt-0.5 font-medium">Size: {notif.size}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(notif.timestamp)}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); onDismiss(notif.id); }}
                className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors shrink-0">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Hook for managing build notifications with polling
export function useBuildNotifications() {
  const [notifications, setNotifications] = useState<BuildNotification[]>([]);

  const addNotification = (notif: Omit<BuildNotification, "id" | "timestamp" | "read">) => {
    const n: BuildNotification = {
      ...notif,
      id: Math.random().toString(36).slice(2),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [n, ...prev].slice(0, 20));
    return n.id;
  };

  const updateNotification = (id: string, updates: Partial<BuildNotification>) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAll = () => setNotifications([]);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, addNotification, updateNotification, dismissNotification, dismissAll, markRead };
}

export default BuildNotifications;
