import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, Grid, List, Code2, Package, Users,
  FolderOpen, Settings, LogOut, Shield, Zap, LayoutTemplate,
  Sparkles, TrendingUp, Clock, Star
} from "lucide-react";
import { Project } from "@/types";
import { getProjects, createProject } from "@/lib/projects";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import IDEHeader from "@/components/layout/IDEHeader";
import ProjectCard from "@/components/features/ProjectCard";
import { CODE_TEMPLATES, SAMPLE_PROJECTS } from "@/constants";
import { cn, generateId } from "@/lib/utils";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";

const Dashboard: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreate, setShowCreate] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "kotlin" as Project["type"],
    packageName: "com.example.myapp",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) getProjects(user.id).then(setProjects);
  }, [user]);

  const handleCreate = async () => {
    if (!newProject.name.trim() || !user) return;
    const project: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
      name: newProject.name,
      description: newProject.description,
      type: newProject.type,
      status: "draft",
      userId: user.id,
      packageName: newProject.packageName,
      versionName: "1.0.0",
      versionCode: 1,
      buildCount: 0,
      screens: [],
      files: [{
        id: generateId(),
        name: newProject.type === "react-native" ? "App.tsx" : newProject.type === "java" ? "MainActivity.java" : "MainActivity.kt",
        path: "src/MainActivity.kt",
        content: newProject.type === "react-native" ? CODE_TEMPLATES.reactNative : newProject.type === "java" ? CODE_TEMPLATES.java : CODE_TEMPLATES.kotlin,
        language: newProject.type === "react-native" ? "typescript" : newProject.type === "java" ? "java" : "kotlin",
        size: 500,
      }],
      settings: { minSdk: 24, targetSdk: 34, compileSdk: 34, buildTools: "34.0.0", theme: "Theme.Material3", orientation: "portrait", permissions: ["INTERNET"] },
    };
    const created = await createProject(project, user.id);
    setProjects(prev => [created, ...prev]);
    setShowCreate(false);
    setNewProject({ name: "", description: "", type: "kotlin", packageName: "com.example.myapp" });
    toast.success(`"${created.name}" created!`);
    navigate(`/ide/${created.id}`);
  };

  const handleLogout = async () => {
    await signOut();
    logout();
    navigate("/");
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || p.type === filterType;
    return matchSearch && matchType;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fafbff, #f0f4ff, #fff5f7)" }}>
      <div className="glass-crystal rounded-2xl p-8 text-center shadow-xl">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: 3 }} />
        <p className="text-gray-600 text-sm font-medium">Loading your workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #fff5f7 100%)" }}>
      <IDEHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="w-60 glass-crystal border-r border-blue-100/50 flex flex-col shrink-0 hidden md:flex shadow-xl shadow-blue-100/20">
          <div className="p-4 border-b border-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-blue-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-200/40">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.username}</p>
                <span className="badge-blue text-xs">{user?.plan || "free"}</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {[
              { icon: Package, label: "Projects", active: true, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
              { icon: LayoutTemplate, label: "Templates", onClick: () => toast.info("Open a project to access templates"), color: "text-violet-600" },
              { icon: FolderOpen, label: "Assets", onClick: () => toast.info("Open a project to manage assets"), color: "text-amber-600" },
              { icon: Users, label: "Teams", onClick: () => toast.info("Open a project to manage teams"), color: "text-pink-600" },
              { icon: Zap, label: "AI Assistant", onClick: () => toast.info("Open a project to use AI"), color: "text-purple-600" },
            ].map(item => (
              <button key={item.label} onClick={item.onClick}
                className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                  item.active
                    ? `${item.bg} ${item.color} border ${item.border} shadow-sm`
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/80")}>
                <item.icon size={16} className={item.active ? item.color : "text-gray-400"} />
                {item.label}
              </button>
            ))}
            {(user?.role === "admin" || user?.email === "admin@esmartworld.com") && (
              <button onClick={() => navigate("/admin")}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 transition-all text-left">
                <Shield size={16} className="text-amber-600" /> Admin Panel
              </button>
            )}
          </nav>

          <div className="p-3 border-t border-blue-100/50 space-y-1">
            <button onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-white/80 transition-all">
              <Settings size={14} className="text-gray-400" /> Settings
            </button>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-all">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {/* Hero banner */}
          <div className="ec-morph border-b border-blue-100/50 px-6 py-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-200/30 to-transparent rounded-full anim-bloom" />
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Welcome back, <span className="gradient-text-cb">{user?.username?.split(" ")[0]}</span>!
                </h1>
                <p className="text-gray-600 mt-1 text-sm">Build stunning Android & React Native apps visually.</p>
              </div>
              <button onClick={() => setShowCreate(true)}
                className="btn-primary shrink-0">
                <Plus size={16} /> New Project
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg relative z-10">
              {[
                { label: "Projects", value: projects.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
                { label: "Templates", value: "120+", icon: LayoutTemplate, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
                { label: "AI Models", value: "6", icon: Zap, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-3 glass-crystal shadow-sm`}>
                  <stat.icon size={16} className={`${stat.color} mb-1`} />
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Create modal */}
            {showCreate && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="glass-crystal rounded-3xl p-6 w-full max-w-md shadow-2xl shadow-blue-200/40 border border-white/80">
                  <h3 className="text-lg font-black text-gray-900 mb-1">Create New Project</h3>
                  <p className="text-xs text-gray-500 mb-5">Choose a framework to get started</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Project Name *</label>
                      <input type="text" value={newProject.name}
                        onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
                        placeholder="My Awesome App" autoFocus className="input-bright" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Description</label>
                      <input type="text" value={newProject.description}
                        onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))}
                        placeholder="What does this app do?" className="input-bright" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-2">Framework</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { type: "kotlin", label: "Kotlin", desc: "Modern Android", badge: "🔥 Popular", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-300" },
                          { type: "java", label: "Java", desc: "Classic Android", badge: "Stable", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300" },
                          { type: "react-native", label: "React Native", desc: "Cross-platform", badge: "Expo", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300" },
                          { type: "android", label: "Android", desc: "XML + Java/Kotlin", badge: "Native", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300" },
                        ].map(opt => (
                          <button key={opt.type} onClick={() => setNewProject(p => ({ ...p, type: opt.type as any }))}
                            className={cn("p-3 rounded-xl border text-left transition-all",
                              newProject.type === opt.type
                                ? `${opt.bg} border-2 ${opt.border} shadow-md`
                                : "bg-white border-gray-200 hover:border-gray-300")}>
                            <p className={cn("text-sm font-bold", opt.color)}>{opt.label}</p>
                            <p className="text-xs text-gray-500">{opt.desc}</p>
                            <span className="text-xs text-gray-400 mt-0.5 inline-block">{opt.badge}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Package Name</label>
                      <input type="text" value={newProject.packageName}
                        onChange={e => setNewProject(p => ({ ...p, packageName: e.target.value }))}
                        placeholder="com.yourname.appname" className="input-bright font-mono" />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={handleCreate} disabled={!newProject.name.trim()} className="btn-primary flex-1">
                        Create Project
                      </button>
                      <button onClick={() => setShowCreate(false)} className="btn-ghost px-4 py-2.5">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="input-bright pl-9" />
              </div>
              <div className="flex gap-1 bg-white/80 border border-gray-200 rounded-xl p-1">
                {["all", "kotlin", "java", "react-native"].map(type => (
                  <button key={type} onClick={() => setFilterType(type)}
                    className={cn("text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors",
                      filterType === type ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900")}>
                    {type}
                  </button>
                ))}
              </div>
              <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-gray-200 bg-white/80">
                {viewMode === "grid" ? <List size={16} /> : <Grid size={16} />}
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 text-gray-400 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Code2 size={28} className="text-blue-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">No projects found</p>
                <button onClick={() => setShowCreate(true)} className="btn-primary text-xs px-5 py-2">
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className={cn(viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3")}>
                {filtered.map(project => (
                  <ProjectCard key={project.id} project={project}
                    onDelete={() => setProjects(prev => prev.filter(p => p.id !== project.id))} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
