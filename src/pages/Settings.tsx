import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Palette, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import IDEHeader from "@/components/layout/IDEHeader";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.username || "");
  const [saving, setSaving] = useState(false);

  if (loading) return null;
  if (!user) { navigate("/login"); return null; }

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    toast.success("Settings saved");
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #fff5f7 100%)" }}>
      <IDEHeader />
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <h1 className="text-2xl font-black text-gray-900 mb-6">Account Settings</h1>

        <div className="space-y-5">
          {/* Profile */}
          <div className="glass-crystal border border-blue-100/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Profile Information</h2>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-r from-blue-50 to-rose-50 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-bold text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="badge-blue">{user.plan || "free"}</span>
                  <span className="badge-crimson">{user.role || "developer"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Username</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-bright" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email (read-only)</label>
                <input type="email" value={user.email} disabled
                  className="input-bright opacity-60 cursor-not-allowed bg-gray-50" />
              </div>
            </div>
          </div>

          {/* IDE Preferences */}
          <div className="glass-crystal border border-violet-100/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <Palette size={16} className="text-violet-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">IDE Preferences</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Theme", value: "Bright Crystal (New)", color: "text-blue-600" },
                { label: "Font Family", value: "JetBrains Mono", color: "text-gray-800" },
                { label: "Font Size", value: "14px", color: "text-gray-800" },
                { label: "Tab Size", value: "4 spaces", color: "text-gray-800" },
                { label: "Auto Save", value: "✅ Enabled", color: "text-emerald-600" },
                { label: "AI Model", value: "Gemini 3 Flash", color: "text-violet-600" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Themes Preview */}
          <div className="glass-crystal border border-rose-100/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                <Sparkles size={16} className="text-rose-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Visual Theme Variants</h2>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { cls: "holo-aurora", label: "Aurora" },
                { cls: "glass-milky-crimson", label: "Crimson" },
                { cls: "emerald-crystal", label: "Emerald" },
                { cls: "ec-morph", label: "Morph" },
                { cls: "holo-prism", label: "Prism" },
              ].map(t => (
                <div key={t.label} className={`${t.cls} rounded-xl p-3 text-center border border-white/60 cursor-pointer hover:scale-105 transition-transform shadow-sm`}>
                  <div className="w-6 h-6 rounded-full bg-white/50 mx-auto mb-1 anim-bloom" />
                  <p className="text-xs font-semibold text-gray-700">{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 text-base">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
