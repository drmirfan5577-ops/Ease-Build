import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Smartphone, Trash2, ExternalLink, Calendar, Package, Zap } from "lucide-react";
import { Project } from "@/types";
import { deleteProject } from "@/lib/projects";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { toast } from "sonner";

interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "ready": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "building": return "bg-amber-50 text-amber-700 border-amber-200";
    case "draft": return "bg-gray-100 text-gray-600 border-gray-200";
    case "failed": return "bg-rose-50 text-rose-700 border-rose-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case "kotlin": return "bg-violet-100 text-violet-800 border-violet-200";
    case "java": return "bg-amber-100 text-amber-800 border-amber-200";
    case "react-native": return "bg-blue-100 text-blue-800 border-blue-200";
    case "android": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "kotlin": return "🔮";
    case "java": return "☕";
    case "react-native": return "⚛️";
    case "android": return "🤖";
    default: return "📱";
  }
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProject(project.id);
    onDelete();
    toast.success(`"${project.name}" deleted`);
  };

  const handleOpen = () => navigate(`/ide/${project.id}`);

  return (
    <div onClick={handleOpen}
      className="glass-crystal border border-blue-100/50 rounded-2xl p-5 cursor-pointer hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-0.5 transition-all duration-200 group relative">

      {/* Status badge */}
      <div className={cn("absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-semibold", getStatusStyle(project.status))}>
        {project.status === "building" && <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />}
        {project.status}
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center text-xl shrink-0 shadow-sm", getTypeBg(project.type))}>
          {getTypeBadge(project.type)}
        </div>
        <div className="flex-1 min-w-0 pr-16">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate text-sm">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{project.description}</p>
        </div>
      </div>

      {/* Package info */}
      <div className="flex items-center gap-1.5 mb-3 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
        <Package size={11} className="text-gray-400 shrink-0" />
        <span className="text-xs font-mono text-gray-500 truncate">{project.packageName}</span>
        <span className="text-xs text-gray-400 ml-auto shrink-0 font-semibold">v{project.versionName}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1">
          <Smartphone size={11} className="text-blue-400" />
          <span>API {project.settings.targetSdk}</span>
        </div>
        <div className="flex items-center gap-1">
          <Code2 size={11} className="text-violet-400" />
          <span>{project.buildCount} builds</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Calendar size={11} className="text-gray-400" />
          <span>{timeAgo(project.updatedAt)}</span>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); handleOpen(); }}
          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 transition-all"
          title="Open in IDE">
          <ExternalLink size={12} />
        </button>
        <button onClick={handleDelete}
          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-all"
          title="Delete project">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
