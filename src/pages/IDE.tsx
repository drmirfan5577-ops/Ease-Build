import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Code2, Layers, Bot, Package, ArrowLeft,
  FolderOpen, Users, LayoutTemplate, Save,
  PanelLeft, PanelLeftClose, Sparkles
} from "lucide-react";
import { Project, UIComponent, ProjectFile } from "@/types";
import { getProjects, updateProject } from "@/lib/projects";
import { useAuth } from "@/hooks/useAuth";
import IDEHeader from "@/components/layout/IDEHeader";
import CodeEditor from "@/components/features/CodeEditor";
import DragDropBuilder from "@/components/features/DragDropBuilder";
import AIAssistant from "@/components/features/AIAssistant";
import BuildPanel from "@/components/features/BuildPanel";
import AssetsManager from "@/components/features/AssetsManager";
import TeamCollaboration from "@/components/features/TeamCollaboration";
import ScreenTemplatesLibrary from "@/components/features/ScreenTemplatesLibrary";
import ProjectFileManager from "@/components/features/ProjectFileManager";
import { SAMPLE_PROJECTS, CODE_TEMPLATES } from "@/constants";
import { cn, generateId } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "builder" | "code" | "ai" | "build" | "assets" | "teams";

const IDE: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("builder");
  const [components, setComponents] = useState<UIComponent[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFileManager, setShowFileManager] = useState(true);

  const defaultFile = (p: Project): ProjectFile => ({
    id: generateId(),
    name: p.type === "react-native" ? "App.tsx" : p.type === "java" ? "MainActivity.java" : "MainActivity.kt",
    path: "src/MainActivity.kt",
    content: p.type === "react-native" ? CODE_TEMPLATES.reactNative : p.type === "java" ? CODE_TEMPLATES.java : CODE_TEMPLATES.kotlin,
    language: p.type === "react-native" ? "typescript" : p.type === "java" ? "java" : "kotlin",
    size: 500,
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const found = SAMPLE_PROJECTS.find(p => p.id === projectId);
    if (found) {
      setProject(found);
      setComponents(found.screens[0]?.components || []);
      const pFiles = found.files.length > 0 ? found.files : [defaultFile(found)];
      setFiles(pFiles);
      setActiveFileId(pFiles[0].id);
    } else {
      if (user) {
        getProjects(user.id).then(projects => {
          const p = projects.find(proj => proj.id === projectId);
          if (p) {
            setProject(p);
            setComponents(p.screens[0]?.components || []);
            const pFiles = p.files.length > 0 ? p.files : [defaultFile(p)];
            setFiles(pFiles);
            setActiveFileId(pFiles[0].id);
          } else {
            toast.error("Project not found");
            navigate("/dashboard");
          }
        });
      }
    }
  }, [projectId, user, navigate]);

  useEffect(() => {
    if (files.length > 0 && !activeFileId) setActiveFileId(files[0].id);
  }, [files]);

  const handleSave = async () => {
    if (!project || !user) return;
    setSaving(true);
    await updateProject(project.id, {
      ...project,
      screens: [{ id: "screen_1", name: "Main Screen", components }],
      files,
      updatedAt: new Date().toISOString(),
    });
    setSaving(false);
    toast.success("Project saved!");
  };

  const handleContentChange = (fileId: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content, size: content.length } : f));
  };

  const handleApplyTemplate = (newComponents: UIComponent[]) => {
    setComponents(newComponents);
    setActiveTab("builder");
  };

  const handleInsertCode = (code: string) => {
    if (activeFileId) {
      const file = files.find(f => f.id === activeFileId);
      if (file) {
        handleContentChange(activeFileId, file.content + "\n\n" + code);
        setActiveTab("code");
      }
    }
  };

  const handleFileCreate = (newFile: ProjectFile) => {
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setActiveTab("code");
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFileId === fileId) {
      const remaining = files.filter(f => f.id !== fileId);
      setActiveFileId(remaining[0]?.id || null);
    }
  };

  const handleFileRename = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
  };

  const TABS: { id: Tab; label: string; icon: React.ComponentType<any>; color: string; activeColor: string; activeBg: string }[] = [
    { id: "builder", label: "Builder", icon: Layers, color: "text-gray-600", activeColor: "text-violet-700", activeBg: "bg-violet-50 border-violet-200" },
    { id: "code", label: "Code", icon: Code2, color: "text-gray-600", activeColor: "text-blue-700", activeBg: "bg-blue-50 border-blue-200" },
    { id: "ai", label: "AI", icon: Sparkles, color: "text-gray-600", activeColor: "text-purple-700", activeBg: "bg-purple-50 border-purple-200" },
    { id: "build", label: "Build", icon: Package, color: "text-gray-600", activeColor: "text-emerald-700", activeBg: "bg-emerald-50 border-emerald-200" },
    { id: "assets", label: "Assets", icon: FolderOpen, color: "text-gray-600", activeColor: "text-amber-700", activeBg: "bg-amber-50 border-amber-200" },
    { id: "teams", label: "Teams", icon: Users, color: "text-gray-600", activeColor: "text-rose-700", activeBg: "bg-rose-50 border-rose-200" },
  ];

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fafbff, #f0f4ff)" }}>
        <div className="glass-crystal rounded-2xl p-8 text-center shadow-xl">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 60%, #fff5f7 100%)" }}>
      <IDEHeader projectName={project.name} />

      {/* IDE Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 glass-crystal border-b border-blue-100/50 shadow-sm">
        <button onClick={() => navigate("/dashboard")}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Back">
          <ArrowLeft size={16} />
        </button>

        <button
          onClick={() => setShowFileManager(!showFileManager)}
          className={cn("p-1.5 rounded-lg transition-colors",
            showFileManager ? "text-blue-600 bg-blue-50 border border-blue-200" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50")}
          title="Toggle File Manager">
          {showFileManager ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Tabs */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                activeTab === tab.id
                  ? `${tab.activeBg} ${tab.activeColor}`
                  : `${tab.color} hover:text-gray-900 hover:bg-gray-50 border-transparent`)}>
              <tab.icon size={13} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {activeTab === "builder" && (
          <button onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs rounded-xl transition-colors font-semibold">
            <LayoutTemplate size={13} />
            <span className="hidden sm:block">Templates</span>
          </button>
        )}

        <button onClick={handleSave} disabled={saving}
          className="btn-primary text-xs px-4 py-2">
          {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={13} />}
          <span className="hidden sm:block">Save</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        {/* File Manager sidebar */}
        {showFileManager && (
          <div className="w-52 border-r border-blue-100/50 shrink-0 overflow-hidden glass-crystal">
            <ProjectFileManager
              files={files}
              activeFileId={activeFileId}
              projectType={project.type}
              packageName={project.packageName}
              onFileSelect={id => { setActiveFileId(id); setActiveTab("code"); }}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
            />
          </div>
        )}

        <div className="flex-1 overflow-hidden bg-white/60">
          {activeTab === "builder" && (
            <DragDropBuilder components={components} projectType={project.type} onChange={setComponents} />
          )}
          {activeTab === "code" && (
            <CodeEditor
              files={files}
              activeFileId={activeFileId}
              onFileSelect={setActiveFileId}
              onContentChange={handleContentChange}
              onSave={handleSave}
            />
          )}
          {activeTab === "ai" && (
            <AIAssistant
              projectType={project.type}
              currentCode={files.find(f => f.id === activeFileId)?.content}
              onInsertCode={handleInsertCode}
            />
          )}
          {activeTab === "build" && (
            <BuildPanel project={project} onStatusChange={status => setProject(p => p ? { ...p, status } : null)} />
          )}
          {activeTab === "assets" && (
            <AssetsManager projectId={project.id} onInsert={url => { toast.success("URL copied!"); navigator.clipboard.writeText(url); }} />
          )}
          {activeTab === "teams" && <TeamCollaboration />}
        </div>
      </div>

      {showTemplates && (
        <ScreenTemplatesLibrary
          projectType={project.type}
          onApply={handleApplyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default IDE;
