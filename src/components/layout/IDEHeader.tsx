import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell, ChevronDown, LogOut, Settings, Shield,
  CheckCircle, XCircle, Loader2, Download, X, Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

interface IDEHeaderProps {
  projectName?: string;
}

interface Notification {
  id: number;
  text: string;
  time: string;
  type: "success" | "info" | "error" | "building";
  downloadUrl?: string;
  read: boolean;
}

const IDEHeader: React.FC<IDEHeaderProps> = ({ projectName }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "Build #a3f2 complete — APK ready (4.7 MB)", time: "2m ago", type: "success", downloadUrl: "#", read: false },
    { id: 2, text: "eSmart Commerce: release build started", time: "8m ago", type: "building", read: false },
    { id: 3, text: "AI Assistant upgraded to Gemini 3 Flash", time: "1h ago", type: "info", read: true },
    { id: 4, text: "Team member joined your workspace", time: "3h ago", type: "info", read: true },
  ]);

  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await signOut();
    logout();
    navigate("/");
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  const notifIcon = (type: Notification["type"]) => {
    if (type === "success") return <CheckCircle size={14} className="text-emerald-600 shrink-0 mt-0.5" />;
    if (type === "error") return <XCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />;
    if (type === "building") return <Loader2 size={14} className="text-amber-600 animate-spin shrink-0 mt-0.5" />;
    return <Bell size={14} className="text-blue-600 shrink-0 mt-0.5" />;
  };

  return (
    <header className="h-14 glass-crystal border-b border-blue-100/60 flex items-center px-4 gap-3 z-50 relative shadow-sm">
      <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
        <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-xl object-cover shadow-md shadow-blue-200/40" />
        <span className="font-black text-sm hidden sm:block">
          <span className="gradient-text-cb">eSmart</span>
          <span className="text-gray-800"> Builder</span>
        </span>
      </Link>

      {projectName && (
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-semibold truncate max-w-36">{projectName}</span>
        </div>
      )}

      <div className="flex-1" />

      <nav className="hidden md:flex items-center gap-0.5">
        <Link to="/dashboard" className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium">
          Projects
        </Link>
        {(user?.role === "admin" || user?.email === "admin@esmartworld.com") && (
          <Link to="/admin" className="px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50 rounded-xl transition-colors flex items-center gap-1 font-medium">
            <Shield size={13} /> Admin
          </Link>
        )}
        <Link to="/about" className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium">
          About
        </Link>
      </nav>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
          className="p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors relative">
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 glass-crystal border border-blue-100/50 rounded-2xl shadow-2xl shadow-blue-100/40 z-50 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-blue-100/50">
              <span className="text-sm font-bold text-gray-800">
                Notifications {unread > 0 && <span className="ml-1.5 badge-crimson">{unread}</span>}
              </span>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all read</button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-blue-50">
              {notifications.map(n => (
                <div key={n.id} className={cn("p-3 flex items-start gap-2.5 hover:bg-blue-50/50 transition-colors", !n.read && "bg-blue-50/30")}>
                  {notifIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {n.downloadUrl && (
                      <a href={n.downloadUrl} className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors" title="Download">
                        <Download size={11} />
                      </a>
                    )}
                    <button onClick={() => dismiss(n.id)} className="p-1 text-gray-400 hover:text-rose-600 transition-colors">
                      <X size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-blue-50">
              <button onClick={() => setNotifOpen(false)}
                className="w-full text-xs text-gray-500 hover:text-gray-700 py-1.5 text-center transition-colors rounded-xl hover:bg-blue-50">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Menu */}
      {user && (
        <div className="relative">
          <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-blue-50 transition-colors">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full object-cover border-2 border-blue-100" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-sm">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span className="text-sm text-gray-700 hidden sm:block max-w-20 truncate font-medium">{user.username?.split(" ")[0]}</span>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-crystal border border-blue-100/50 rounded-2xl shadow-2xl shadow-blue-100/40 z-50">
              <div className="p-3 border-b border-blue-100/50">
                <div className="flex items-center gap-2.5">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-blue-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-blue-600 flex items-center justify-center text-sm font-black text-white shrink-0 shadow-md">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span className="badge-blue text-xs mt-0.5 inline-block">{user.plan || "free"}</span>
                  </div>
                </div>
              </div>
              <div className="p-1">
                <Link to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
                  onClick={() => setUserMenuOpen(false)}>
                  🏠 Dashboard
                </Link>
                <Link to="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
                  onClick={() => setUserMenuOpen(false)}>
                  <Settings size={14} className="text-gray-400" /> Settings
                </Link>
                {(user.role === "admin" || user.email === "admin@esmartworld.com") && (
                  <Link to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-xl transition-colors"
                    onClick={() => setUserMenuOpen(false)}>
                    <Shield size={14} /> Admin Panel
                  </Link>
                )}
              </div>
              <div className="p-1 border-t border-blue-100/50">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {(notifOpen || userMenuOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setNotifOpen(false); setUserMenuOpen(false); }} />
      )}
    </header>
  );
};

export default IDEHeader;
