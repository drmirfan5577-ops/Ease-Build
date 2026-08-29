import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Globe, Mail, Github, Shield, Code2, Users, Zap, Star, MapPin, Phone, Sparkles } from "lucide-react";
import { COMPANY, APP_VERSION, COMPANY_EMAIL, GITHUB_REPO_URL, APP_URL } from "@/constants";
import logoImg from "@/assets/logo.png";
import IDEHeader from "@/components/layout/IDEHeader";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #fff5f7 100%)" }}>
      <IDEHeader />
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Hero */}
        <div className="ec-morph border border-blue-100 rounded-3xl p-8 mb-8 text-center shadow-xl shadow-blue-100/30 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-20 h-20 bg-rose-200/30 rounded-full anim-bloom" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-200/30 rounded-full anim-float" />
          <div className="relative z-10">
            <img src={logoImg} alt="Logo" className="w-20 h-20 rounded-3xl mx-auto mb-4 object-cover shadow-2xl shadow-blue-200/40" />
            <h1 className="text-3xl font-black text-gray-900 mb-2">eSmart World App Builder</h1>
            <p className="text-gray-500">Version {APP_VERSION} · Built by Dr. Irfan · eSmart World</p>
            <div className="flex justify-center gap-3 mt-5 flex-wrap">
              <a href={`mailto:${COMPANY_EMAIL}`}
                className="flex items-center gap-1.5 px-4 py-2 glass-crystal border border-blue-100 text-gray-700 hover:text-blue-600 text-xs rounded-xl transition-all shadow-sm hover:shadow-md">
                <Mail size={13} className="text-rose-500" /> {COMPANY_EMAIL}
              </a>
              <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 glass-crystal border border-blue-100 text-gray-700 hover:text-gray-900 text-xs rounded-xl transition-all shadow-sm">
                <Github size={13} /> GitHub
              </a>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 glass-crystal border border-blue-100 text-gray-700 hover:text-blue-600 text-xs rounded-xl transition-all shadow-sm">
                <Globe size={13} className="text-blue-500" /> Website
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* About Dr. Irfan */}
          <div className="glass-crystal rounded-3xl p-6 border border-blue-100/50 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                Dr
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Dr. Irfan</h2>
                <p className="text-sm text-blue-600 font-semibold">Founder & CEO, eSmart World</p>
                <p className="text-xs text-gray-500">Android Developer · AI Educator · Tech Entrepreneur</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dr. Irfan is a leading technology educator and mobile app development expert with over a decade of
              experience building innovative digital solutions. He founded eSmart World to democratize mobile app
              development and empower developers across Pakistan and beyond.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Android Expert", "AI Innovator", "Tech Educator", "Entrepreneur", "Pakistan 🇵🇰"].map(tag => (
                <span key={tag} className="badge-blue text-xs">{tag}</span>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          {[
            {
              icon: Heart, gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50", border: "border-rose-200",
              title: "Our Mission", color: "text-rose-600",
              content: "To democratize mobile app development by providing world-class, AI-powered tools that enable anyone — from beginners to professionals — to build production-grade Android and React Native applications without barriers.",
            },
            {
              icon: Zap, gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", border: "border-amber-200",
              title: "Our Vision", color: "text-amber-600",
              content: "To become the world's leading no-code/low-code platform for mobile app development, empowering 10 million developers across Pakistan and worldwide by 2030. We envision a future where every entrepreneur can build their dream app.",
            },
            {
              icon: Code2, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", border: "border-blue-200",
              title: "What We Build", color: "text-blue-600",
              content: "eSmart World App Builder is a complete IDE in your browser — with visual drag-and-drop builder, AI code assistant, multi-language support (Kotlin/Java/React Native), 120+ screen templates, team collaboration, and cloud backend.",
            },
            {
              icon: Users, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", border: "border-emerald-200",
              title: "Our Community", color: "text-emerald-600",
              content: "We serve developers, students, entrepreneurs, and businesses who want to build Android apps efficiently. Our platform is designed for Pakistan's growing tech ecosystem and the global developer community.",
            },
          ].map(section => (
            <div key={section.title} className={`glass-crystal rounded-2xl p-6 border ${section.border} shadow-lg`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-md`}>
                  <section.icon size={16} className="text-white" />
                </div>
                <h3 className={`text-base font-black ${section.color}`}>{section.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          {/* Contact */}
          <div className="glass-milky-crimson rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={16} className="text-rose-600" /> Contact & Support
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: Mail, label: "Email", value: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}`, color: "text-rose-600" },
                { icon: Globe, label: "Website", value: "esmartworld.onspace.app", href: APP_URL, color: "text-blue-600" },
                { icon: Github, label: "GitHub", value: "github.com/esmartworld", href: GITHUB_REPO_URL, color: "text-gray-800" },
                { icon: MapPin, label: "Location", value: "Pakistan 🇵🇰", href: "#", color: "text-emerald-600" },
              ].map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-white/80 hover:shadow-md transition-all">
                  <item.icon size={16} className={item.color} />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Legal sections */}
          {[
            {
              title: "⚠️ Disclaimer", border: "border-amber-200", bg: "bg-amber-50",
              content: `eSmart World App Builder is provided "as is" without warranty of any kind. eSmart World and Dr. Irfan make no representations regarding the completeness or suitability of the software for any purpose. Use at your own risk. Not liable for any damages arising from use of this software.`,
            },
            {
              title: "🔒 Privacy Policy", border: "border-blue-200", bg: "bg-blue-50",
              content: `We collect minimal data: email, username, and project data needed to provide the service. We do NOT sell your data. All data is stored securely in encrypted databases. You may request deletion at: ${COMPANY_EMAIL}. We follow GDPR principles.`,
            },
            {
              title: "©️ Copyright", border: "border-violet-200", bg: "bg-violet-50",
              content: `Copyright © 2024–2026 eSmart World. All Rights Reserved. eSmart World App Builder, its design, source code, and branding are exclusively owned by Dr. Irfan / eSmart World. No reproduction without written permission.`,
            },
            {
              title: "🛡️ Security", border: "border-rose-200", bg: "bg-rose-50",
              content: "The Admin Panel is strongly password-protected. Unauthorized access is prohibited and may be prosecuted. Never share your credentials. All sensitive operations are logged.",
            },
          ].map(section => (
            <div key={section.title} className={`rounded-2xl p-5 ${section.bg} border ${section.border} shadow-sm`}>
              <h3 className="text-sm font-bold text-gray-800 mb-2">{section.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="text-center py-4">
            <p className="text-sm text-gray-500 font-medium">Made with ❤️ in Pakistan 🇵🇰</p>
            <p className="text-xs text-gray-400 mt-1">© 2024–2026 eSmart World · All Rights Reserved · Dr. Irfan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
