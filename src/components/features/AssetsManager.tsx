import React, { useState, useRef } from "react";
import {
  Upload, Image, File, Trash2, Copy, Check, Search,
  FolderOpen, Grid, List, Download, Plus
} from "lucide-react";
import { Asset } from "@/types";
import { uploadAsset, getAssets, deleteAsset } from "@/lib/assets";
import { useAuth } from "@/hooks/useAuth";
import { cn, formatFileSize, formatDate } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AssetsManagerProps {
  projectId?: string;
  onInsert?: (url: string) => void;
}

const FILE_TYPE_ICONS: Record<string, string> = {
  "image/png": "🖼️", "image/jpeg": "🖼️", "image/gif": "🎞️",
  "image/webp": "🖼️", "image/svg+xml": "✏️",
  "application/zip": "📦", "application/octet-stream": "📁",
};

const AssetsManager: React.FC<AssetsManagerProps> = ({ projectId, onInsert }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<"all" | "images" | "files">("all");
  const [copied, setCopied] = useState<string | null>(null);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets", user?.id],
    queryFn: () => (user ? getAssets(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => { if (!user) throw new Error("Not logged in"); return uploadAsset(file, user.id, projectId); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["assets", user?.id] }); toast.success("Asset uploaded!"); },
    onError: (err: any) => toast.error("Upload failed: " + err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, path }: { id: string; path: string }) => deleteAsset(id, path),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["assets", user?.id] }); toast.success("Asset deleted"); },
    onError: (err: any) => toast.error("Delete failed: " + err.message),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB limit`); return; }
      uploadMutation.mutate(file);
    });
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(file => uploadMutation.mutate(file));
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("URL copied!");
  };

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || (filterType === "images" && a.fileType.startsWith("image/")) || (filterType === "files" && !a.fileType.startsWith("image/"));
    return matchSearch && matchType;
  });

  const totalSize = assets.reduce((acc, a) => acc + a.fileSize, 0);

  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(135deg, #fafbff, #f0f4ff)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass-crystal border-b border-blue-100/50 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
          <FolderOpen size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Assets Manager</p>
          <p className="text-xs text-gray-500">{assets.length} files · {formatFileSize(totalSize)} used</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded-lg transition-colors", viewMode === "grid" ? "text-blue-600 bg-blue-50 border border-blue-200" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100")}>
            <Grid size={14} />
          </button>
          <button onClick={() => setViewMode("list")}
            className={cn("p-1.5 rounded-lg transition-colors", viewMode === "list" ? "text-blue-600 bg-blue-50 border border-blue-200" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100")}>
            <List size={14} />
          </button>
        </div>
        <button onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}
          className="btn-primary text-xs px-3 py-2">
          <Plus size={13} /> Upload
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,.zip,.apk" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/60 border-b border-blue-100/30">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..."
            className="input-bright pl-8 text-xs py-1.5" />
        </div>
        {(["all", "images", "files"] as const).map(type => (
          <button key={type} onClick={() => setFilterType(type)}
            className={cn("text-xs px-2.5 py-1.5 rounded-lg capitalize transition-colors font-medium",
              filterType === type ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")}>
            {type}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        {/* Empty drop zone */}
        {assets.length === 0 && !isLoading && (
          <div onClick={() => fileInputRef.current?.click()}
            className="glass-crystal border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-12 text-center cursor-pointer transition-all hover:shadow-lg mb-4 group">
            <Upload size={32} className="text-blue-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
            <p className="text-sm font-semibold text-gray-700">Drag & drop files here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP, SVG, ZIP · Max 10MB</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {uploadMutation.isPending && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl mb-3 shadow-sm">
            <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs text-blue-700 font-semibold">Uploading...</span>
          </div>
        )}

        {viewMode === "grid" ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            <button onClick={() => fileInputRef.current?.click()}
              className="aspect-square glass-crystal border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl flex flex-col items-center justify-center gap-2 text-blue-400 hover:text-blue-600 transition-all hover:shadow-md">
              <Plus size={20} />
              <span className="text-xs font-semibold">Add</span>
            </button>
            {filtered.map(asset => (
              <div key={asset.id} className="group relative glass-crystal border border-blue-100 hover:border-blue-300 rounded-2xl overflow-hidden transition-all hover:shadow-lg cursor-pointer">
                {asset.fileType.startsWith("image/") ? (
                  <img src={asset.fileUrl} alt={asset.name} className="w-full aspect-square object-cover" loading="lazy" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center text-3xl bg-gray-50">{FILE_TYPE_ICONS[asset.fileType] || "📁"}</div>
                )}
                <div className="p-2">
                  <p className="text-xs text-gray-700 font-medium truncate">{asset.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(asset.fileSize)}</p>
                </div>
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-2xl">
                  {onInsert && (
                    <button onClick={() => onInsert(asset.fileUrl)} className="btn-primary text-xs px-3 py-1.5">Insert</button>
                  )}
                  <button onClick={() => handleCopy(asset.fileUrl, asset.id)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-1 transition-colors font-medium">
                    {copied === asset.id ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />} Copy URL
                  </button>
                  <button onClick={() => deleteMutation.mutate({ id: asset.id, path: asset.filePath })}
                    className="text-xs px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl flex items-center gap-1 transition-colors font-medium border border-rose-200">
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(asset => (
              <div key={asset.id}
                className="glass-crystal flex items-center gap-3 p-3 border border-blue-100 hover:border-blue-300 rounded-2xl transition-all group shadow-sm hover:shadow-md">
                {asset.fileType.startsWith("image/") ? (
                  <img src={asset.fileUrl} alt={asset.name} className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm" loading="lazy" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">{FILE_TYPE_ICONS[asset.fileType] || "📁"}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-semibold truncate">{asset.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(asset.fileSize)} · {formatDate(asset.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onInsert && (
                    <button onClick={() => onInsert(asset.fileUrl)} className="btn-primary text-xs px-2.5 py-1.5">Insert</button>
                  )}
                  <button onClick={() => handleCopy(asset.fileUrl, asset.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    {copied === asset.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  </button>
                  <a href={asset.fileUrl} download target="_blank" rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Download size={13} />
                  </a>
                  <button onClick={() => deleteMutation.mutate({ id: asset.id, path: asset.filePath })}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsManager;
