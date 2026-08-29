import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #fff5f7 100%)" }}>
      {/* Background orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full anim-float-slow pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(220,20,60,.12), transparent)", filter: "blur(80px)" }} />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full anim-float pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(26,86,255,.12), transparent)", filter: "blur(70px)", animationDelay: "2s" }} />

      <div className="text-center max-w-sm relative z-10 anim-slide-up">
        <div className="glass-crystal rounded-3xl p-10 shadow-2xl shadow-blue-200/40 border border-white/60">
          <div className="text-8xl font-black gradient-text-cb mb-2">404</div>
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
              <ArrowLeft size={16} /> Go Back
            </button>
            <button onClick={() => navigate("/")} className="btn-primary text-sm">
              <Home size={16} /> Home
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">eSmart World App Builder · Dr. Irfan</p>
      </div>
    </div>
  );
};

export default NotFound;
