import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, ArrowRight, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { sendOtp, verifyOtpAndSetPassword, signInWithPassword, signInWithGoogle, mapSupabaseUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "register" | "otp";

/* ── Floating Orb ───────────────────────────────────────── */
const FloatOrb: React.FC<{ cls: string; style: React.CSSProperties }> = ({ cls, style }) => (
  <div className={`absolute rounded-full pointer-events-none ${cls}`} style={style} />
);

const Login: React.FC = () => {
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const oauthPopupRef = useRef<Window | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard", { replace: true });
  }, [user, authLoading, navigate]);

  // OAuth message listener for popup flow
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== "OAUTH_CODE" || typeof event.data.code !== "string") return;
      const { error } = await supabase.auth.exchangeCodeForSession(event.data.code);
      if (error) toast.error("Google sign-in failed: " + error.message);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signInWithPassword(email, password);
      login(mapSupabaseUser(user));
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp(email);
      toast.success("OTP sent to " + email);
      setMode("otp");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtpAndSetPassword(email, otp, password, username);
      if (user) {
        login(mapSupabaseUser(user));
        toast.success("Account created! Welcome to eSmart Builder.");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  function isInIframe(): boolean {
    try { return window.self !== window.top; } catch { return true; }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const iframe = isInIframe();
      const width = 520, height = 720;
      const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
      const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
      const popup = iframe
        ? window.open("about:blank", "onspace-oauth",
            `popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)}`)
        : null;
      if (iframe && !popup) {
        toast.error("Popup blocked. Please allow popups and try again.");
        setGoogleLoading(false);
        return;
      }
      oauthPopupRef.current = popup;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback`, skipBrowserRedirect: true },
      });
      if (error || !data.url) { popup?.close(); throw error || new Error("Failed to start Google sign-in"); }
      if (iframe && popup) popup.location.assign(data.url);
      else window.location.assign(data.url);
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  const GoogleButton = () => (
    <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 text-gray-800 font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60">
      {googleLoading ? (
        <Loader2 size={18} className="animate-spin text-blue-600" />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      Continue with Google
    </button>
  );

  const Divider = () => (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400">or continue with email</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #fff5f7 100%)" }}>

      {/* Background orbs */}
      <FloatOrb cls="anim-float-slow" style={{ top: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(220,20,60,.15), transparent)", filter: "blur(80px)", opacity: .5 }} />
      <FloatOrb cls="anim-float" style={{ bottom: "10%", right: "10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(26,86,255,.15), transparent)", filter: "blur(70px)", opacity: .5, animationDelay: "2s" }} />
      <FloatOrb cls="anim-float-slow" style={{ top: "50%", left: "40%", width: 300, height: 300, background: "radial-gradient(circle, rgba(16,185,129,.1), transparent)", filter: "blur(60px)", opacity: .4, animationDelay: "4s" }} />

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative p-12">
        <div className="ec-morph absolute inset-0 opacity-60" />
        <div className="absolute inset-0 border-r border-blue-100/50" />

        <div className="flex items-center gap-3 relative z-10">
          <img src={logoImg} alt="Logo" className="w-12 h-12 rounded-2xl object-cover shadow-xl shadow-blue-200/40" />
          <div>
            <p className="font-black text-gray-900 text-lg">eSmart World Builder</p>
            <p className="text-sm text-gray-500">by Dr. Irfan</p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-black leading-tight text-gray-900">
              Build world-class
              <br />
              <span className="gradient-text-cb">Android apps</span>
              <br />
              visually.
            </h1>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Drag & drop UI builder · AI-powered coding · Real-time preview · One-click APK export
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Screen Templates", value: "120+", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
              { label: "AI Models", value: "6+", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
              { label: "Components", value: "50+", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
              { label: "Languages", value: "3", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 glass-crystal shadow-lg`}>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              { icon: CheckCircle, text: "Real-time APK build & download", color: "text-emerald-600" },
              { icon: CheckCircle, text: "AI code generation in seconds", color: "text-blue-600" },
              { icon: CheckCircle, text: "120+ ready-made screen templates", color: "text-rose-600" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5">
                <item.icon size={16} className={item.color} />
                <span className="text-sm text-gray-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 relative z-10">
          © 2024–2026 eSmart World · All Rights Reserved · Dr. Irfan
        </p>
      </div>

      {/* ── Right panel ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm anim-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src={logoImg} alt="Logo" className="w-9 h-9 rounded-xl object-cover shadow" />
            <span className="font-bold text-gray-800">eSmart Builder</span>
          </div>

          <div className="glass-crystal rounded-3xl p-8 shadow-2xl shadow-blue-200/30 border border-blue-100/50">

            {/* ── LOGIN ──────────────────────────────────── */}
            {mode === "login" && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-rose-500" />
                  <h2 className="text-2xl font-black text-gray-900">Welcome back</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">Sign in to your eSmart account</p>
                <GoogleButton />
                <Divider />
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@esmartworld.com" required className="input-bright" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" required className="input-bright pr-12" />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    Sign In
                  </button>
                </form>
                <p className="text-sm text-gray-500 text-center mt-5">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("register")} className="text-blue-600 hover:text-blue-700 font-semibold">Create one</button>
                </p>
              </div>
            )}

            {/* ── REGISTER ───────────────────────────────── */}
            {mode === "register" && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-blue-500" />
                  <h2 className="text-2xl font-black text-gray-900">Create account</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">Get started with eSmart Builder</p>
                <GoogleButton />
                <Divider />
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                      placeholder="Your name" required className="input-bright" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" required className="input-bright" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    Send Verification Code
                  </button>
                </form>
                <p className="text-sm text-gray-500 text-center mt-5">
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</button>
                </p>
              </div>
            )}

            {/* ── OTP ─────────────────────────────────────── */}
            {mode === "otp" && (
              <div>
                <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-2xl mx-auto mb-5">
                  <CheckCircle size={28} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1 text-center">Check your email</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                  We sent a 4-digit code to <span className="text-gray-800 font-semibold">{email}</span>
                </p>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Verification Code</label>
                    <input type="text" value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="· · · ·" required
                      className="input-bright text-2xl text-center font-mono tracking-widest" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Set Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Min 6 characters" required minLength={6} className="input-bright pr-12" />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-emerald w-full">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Verify & Create Account
                  </button>
                </form>
                <button onClick={() => setMode("register")}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3 text-center">
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
