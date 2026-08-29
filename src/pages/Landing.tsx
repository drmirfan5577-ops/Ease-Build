import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2, Smartphone, Bot, Package, Users, Layers,
  ArrowRight, Github, Star, Shield, Zap,
  LayoutTemplate, FolderOpen, Globe, Play, Sparkles,
  CheckCircle, Cpu, CloudUpload, Lock
} from "lucide-react";
import { COMPANY, APP_VERSION, APP_URL, COMPANY_EMAIL, GITHUB_REPO_URL } from "@/constants";
import logoImg from "@/assets/logo.png";
import heroImg from "@/assets/hero-ide.jpg";

/* ── Sparkle particle component ─────────────────────────── */
const Sparkle: React.FC<{ x: number; y: number; delay: number; size?: number; color?: string }> = ({
  x, y, delay, size = 6, color = "#DC143C"
}) => (
  <div
    className="absolute pointer-events-none anim-sparkle"
    style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s`, width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z" />
    </svg>
  </div>
);

/* ── Floating orb ───────────────────────────────────────── */
const Orb: React.FC<{ x: number; y: number; size: number; color: string; delay?: number; blur?: number }> = ({
  x, y, size, color, delay = 0, blur = 80
}) => (
  <div
    className="absolute rounded-full pointer-events-none anim-float-slow"
    style={{
      left: `${x}%`, top: `${y}%`,
      width: size, height: size,
      background: color,
      filter: `blur(${blur}px)`,
      opacity: 0.35,
      animationDelay: `${delay}s`,
    }}
  />
);

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentStat(s => (s + 1) % 4), 2000);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon: Layers, title: "Drag & Drop Builder", desc: "Visual UI builder with 50+ Android & React Native components. Build screens without writing a single line of code.", gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50", border: "border-rose-200" },
    { icon: LayoutTemplate, title: "120+ Screen Templates", desc: "Pre-built screens for Auth, E-Commerce, Chat, Social, Health, Finance, and 14 more categories. Apply with one click.", gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", border: "border-amber-200" },
    { icon: Bot, title: "AI Code Assistant", desc: "Gemini 3 Flash & GPT-5 powered coding. Generate, fix, optimize Kotlin/Java/React Native code in seconds.", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", border: "border-violet-200" },
    { icon: Code2, title: "Multi-Language Editor", desc: "Full-featured code editor with syntax highlighting for Kotlin, Java, TypeScript, and XML. With file manager.", gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", border: "border-blue-200" },
    { icon: Package, title: "APK Build & Export", desc: "Simulate build process and export APK/AAB. GitHub Actions CI/CD and Expo EAS auto-deployment wizards.", gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    { icon: Users, title: "Team Collaboration", desc: "Invite teammates, assign roles (Owner/Editor/Viewer), and build apps together in real-time.", gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50", border: "border-pink-200" },
    { icon: FolderOpen, title: "Assets Manager", desc: "Upload, organize, and manage all project assets — images, icons, resources — in one place.", gradient: "from-cyan-500 to-sky-600", bg: "bg-cyan-50", border: "border-cyan-200" },
    { icon: Shield, title: "Secure Cloud Backend", desc: "Powered by OnSpace Cloud — real authentication, PostgreSQL database, row-level security for all data.", gradient: "from-green-500 to-emerald-600", bg: "bg-green-50", border: "border-green-200" },
  ];

  const stats = [
    { label: "Screen Templates", value: "120+", color: "text-rose-600" },
    { label: "Components", value: "50+", color: "text-blue-600" },
    { label: "AI Models", value: "6", color: "text-violet-600" },
    { label: "Languages", value: "3", color: "text-emerald-600" },
  ];

  const testimonials = [
    { name: "Ahsan Khan", role: "Android Developer", text: "Best app builder I've ever used. The AI assistant saves me hours every day!", avatar: "AK" },
    { name: "Sara Ali", role: "Startup Founder", text: "Built my first Android app in 2 hours without any coding experience!", avatar: "SA" },
    { name: "Bilal Ahmed", role: "Tech Educator", text: "The 120+ templates are incredible. My students love learning with this platform.", avatar: "BA" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 40%, #fff5f7 100%)" }}>

      {/* Background orbs */}
      <Orb x={-5} y={10} size={600} color="radial-gradient(circle, rgba(220,20,60,.2), rgba(220,20,60,0))" blur={100} />
      <Orb x={70} y={-5} size={500} color="radial-gradient(circle, rgba(26,86,255,.18), rgba(26,86,255,0))" blur={90} delay={2} />
      <Orb x={50} y={60} size={400} color="radial-gradient(circle, rgba(16,185,129,.15), rgba(16,185,129,0))" blur={80} delay={4} />
      <Orb x={90} y={70} size={350} color="radial-gradient(circle, rgba(139,92,246,.15), rgba(139,92,246,0))" blur={80} delay={1} />

      {/* Sparkles */}
      <Sparkle x={15} y={20} delay={0} size={8} color="#DC143C" />
      <Sparkle x={80} y={15} delay={1.2} size={6} color="#1a56ff" />
      <Sparkle x={25} y={70} delay={2.4} size={7} color="#10b981" />
      <Sparkle x={90} y={45} delay={0.8} size={5} color="#DC143C" />
      <Sparkle x={60} y={85} delay={1.8} size={8} color="#1a56ff" />
      <Sparkle x={45} y={35} delay={3.0} size={5} color="#7c3aed" />

      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass-crystal border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoImg} alt="Logo" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-blue-200/40" />
            <div>
              <span className="font-bold text-sm">
                <span className="gradient-text-cb">eSmart</span>
                <span className="text-gray-800"> Builder</span>
              </span>
              <p className="text-xs text-gray-400 -mt-0.5">by Dr. Irfan</p>
            </div>
          </Link>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Features", href: "#features" },
              { label: "Templates", href: "#templates" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium">
                {item.label}
              </a>
            ))}
          </div>
          <Link to="/login"
            className="px-4 py-2 text-sm text-gray-700 border border-gray-200 bg-white/80 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm">
            Sign In
          </Link>
          <button onClick={() => navigate("/login")}
            className="btn-primary">
            <Sparkles size={14} /> Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-crimson-blue rounded-full text-sm font-medium mb-8 anim-slide-up shadow-lg">
            <Sparkles size={14} className="text-rose-500" />
            <span className="gradient-text-cb font-semibold">Powered by Gemini 3 Flash & GPT-5</span>
            <span className="badge-blue">v{APP_VERSION}</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6 anim-slide-up" style={{ animationDelay: ".1s" }}>
            Build Android Apps
            <br />
            <span className="gradient-text-cb">Visually & Intelligently</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed anim-slide-up" style={{ animationDelay: ".2s" }}>
            The world's most powerful Android & React Native app builder.
            Drag, drop, code, and deploy — all in one beautiful professional platform.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16 anim-slide-up" style={{ animationDelay: ".3s" }}>
            <button onClick={() => navigate("/login")} className="btn-primary text-base px-8 py-4">
              Start Building Free <ArrowRight size={18} />
            </button>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-base px-8 py-4">
              <Github size={18} /> View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto anim-slide-up" style={{ animationDelay: ".4s" }}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="glass-crystal rounded-2xl p-4 text-center anim-glow-crimson shadow-lg"
                style={{ animationDelay: `${i * .5}s` }}>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero screenshot */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 relative z-10">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/40 border border-white/80 glass-crystal">
            <img src={heroImg} alt="eSmart Builder IDE" className="w-full h-80 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
              <div className="glass-crystal rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 anim-bloom" />
                <span className="text-sm font-semibold text-gray-800">IDE Live & Active</span>
              </div>
              <div className="glass-crystal rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                <Bot size={14} className="text-violet-600" />
                <span className="text-sm font-semibold text-gray-800">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="badge-blue mx-auto mb-4 w-fit">Platform Features</div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Everything You Need to Build
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            A complete app development platform right in your browser — no installs required
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={f.title}
              className={`glass-crystal rounded-2xl p-5 border ${f.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}
              style={{ animationDelay: `${i * .05}s` }}>
              <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`bg-gradient-to-br ${f.gradient} w-7 h-7 rounded-lg flex items-center justify-center`}>
                  <f.icon size={16} className="text-white" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Visual Themes Showcase ───────────────────────── */}
      <section className="py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Stunning Visual Themes</h2>
            <p className="text-gray-500">5 holographic + 5 crystal emerald + 5 animated display styles</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Aurora Holo", cls: "holo-aurora", text: "text-purple-700" },
              { label: "Crimson Glass", cls: "glass-milky-crimson", text: "text-rose-700" },
              { label: "Emerald Crystal", cls: "emerald-crystal", text: "text-emerald-700" },
              { label: "Crystal Prism", cls: "holo-prism", text: "text-blue-700" },
              { label: "EC Diagonal", cls: "ec-diagonal", text: "text-teal-700" },
              { label: "Royal Blue", cls: "glass-royal-blue", text: "text-blue-700" },
              { label: "EC Radial", cls: "ec-radial", text: "text-rose-700" },
              { label: "Iridescent", cls: "holo-iridescent", text: "text-violet-700" },
              { label: "Emerald Glow", cls: "emerald-glow-card", text: "text-emerald-700" },
              { label: "Holo Soft", cls: "holo-soft", text: "text-indigo-700" },
            ].map((theme) => (
              <div key={theme.label} className={`${theme.cls} rounded-2xl p-4 text-center shadow-lg border border-white/60 hover:scale-105 transition-transform cursor-pointer`}>
                <div className="w-8 h-8 rounded-full bg-white/60 mx-auto mb-2 anim-bloom shadow" />
                <p className={`text-xs font-semibold ${theme.text}`}>{theme.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section id="templates" className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Loved by Developers</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-crystal rounded-2xl p-6 border border-blue-100/50 shadow-lg hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="ec-morph rounded-3xl p-12 text-center shadow-2xl border border-white/60 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-rose-200/40 anim-bloom" />
            <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-blue-200/40 anim-float" />
            <Sparkle x={85} y={20} delay={0} size={8} color="#DC143C" />
            <Sparkle x={10} y={70} delay={1} size={6} color="#1a56ff" />
            <h2 className="text-4xl font-black text-gray-900 mb-4 relative z-10">
              Ready to Build Your Dream App?
            </h2>
            <p className="text-gray-600 mb-8 text-lg relative z-10">
              Join eSmart World. Build your first app in minutes. No credit card required.
            </p>
            <button onClick={() => navigate("/login")}
              className="btn-crimson text-base px-10 py-4 mx-auto relative z-10">
              Start Building — It's Free <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="py-12 border-t border-blue-100/50 relative z-10 glass-crystal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-lg object-cover shadow" />
                <span className="font-bold text-gray-800">eSmart Builder</span>
              </div>
              <p className="text-xs text-gray-500">Built by Dr. Irfan · eSmart World</p>
              <a href={`mailto:${COMPANY_EMAIL}`} className="text-xs text-blue-500 hover:text-blue-700 mt-1 block">{COMPANY_EMAIL}</a>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-3">Platform</p>
              {[
                { l: "Dashboard", h: "/dashboard" },
                { l: "IDE Builder", h: "/dashboard" },
                { l: "Templates", h: "/dashboard" },
                { l: "AI Assistant", h: "/dashboard" },
              ].map((item) => (
                <Link key={item.l} to={item.h} className="block text-xs text-gray-500 hover:text-blue-600 mb-2 transition-colors">{item.l}</Link>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-3">Legal</p>
              {[
                { l: "Privacy Policy", h: "/about" },
                { l: "Terms of Service", h: "/about" },
                { l: "Disclaimer", h: "/about" },
                { l: "Copyright", h: "/about" },
              ].map((item) => (
                <Link key={item.l} to={item.h} className="block text-xs text-gray-500 hover:text-rose-600 mb-2 transition-colors">{item.l}</Link>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-3">Links</p>
              <Link to="/about" className="block text-xs text-gray-500 hover:text-blue-600 mb-2 transition-colors">About Us</Link>
              <Link to="/admin" className="block text-xs text-amber-600 hover:text-amber-700 mb-2 transition-colors font-medium">Admin Panel</Link>
              <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
                className="block text-xs text-gray-500 hover:text-gray-800 mb-2 transition-colors flex items-center gap-1">
                <Github size={11} /> GitHub Repository
              </a>
              <a href="https://expo.dev" target="_blank" rel="noopener noreferrer"
                className="block text-xs text-gray-500 hover:text-blue-600 mb-2 transition-colors flex items-center gap-1">
                <Smartphone size={11} /> Expo Go
              </a>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer"
                className="block text-xs text-gray-500 hover:text-emerald-600 mb-2 transition-colors flex items-center gap-1">
                <Play size={11} /> Google Play Store
              </a>
            </div>
          </div>
          <div className="border-t border-blue-100/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">© 2024–2026 eSmart World. All Rights Reserved. · Dr. Irfan</p>
            <p className="text-xs text-gray-400">Made with ❤️ in Pakistan 🇵🇰 · {APP_URL}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
