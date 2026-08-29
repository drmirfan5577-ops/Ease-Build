import React, { useState } from "react";
import {
  Folder, FolderOpen, File, FileCode, FileText, Image,
  Plus, Trash2, Edit3, ChevronRight, ChevronDown, X,
  Check, FileJson, Settings, Package, Smartphone
} from "lucide-react";
import { ProjectFile } from "@/types";
import { cn, generateId } from "@/lib/utils";
import { toast } from "sonner";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  language?: string;
  children?: FileNode[];
  content?: string;
}

interface ProjectFileManagerProps {
  files: ProjectFile[];
  activeFileId: string | null;
  projectType: string;
  packageName: string;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (file: ProjectFile) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
}

function buildFileTree(files: ProjectFile[], projectType: string, packageName: string): FileNode[] {
  const pkgPath = packageName.replace(/\./g, "/");
  if (projectType === "react-native") {
    const tree: FileNode[] = [
      { id: "root_src", name: "src", type: "folder", path: "src", children: [
        { id: "root_screens", name: "screens", type: "folder", path: "src/screens", children: [] },
        { id: "root_components", name: "components", type: "folder", path: "src/components", children: [] },
        { id: "root_navigation", name: "navigation", type: "folder", path: "src/navigation", children: [] },
        { id: "root_hooks", name: "hooks", type: "folder", path: "src/hooks", children: [] },
        { id: "root_utils", name: "utils", type: "folder", path: "src/utils", children: [] },
      ]},
      { id: "root_assets", name: "assets", type: "folder", path: "assets", children: [
        { id: "a_img", name: "images", type: "folder", path: "assets/images", children: [] },
        { id: "a_fonts", name: "fonts", type: "folder", path: "assets/fonts", children: [] },
      ]},
      { id: "app_json", name: "app.json", type: "file", path: "app.json", language: "json" },
      { id: "pkg_json", name: "package.json", type: "file", path: "package.json", language: "json" },
      { id: "tsconfig", name: "tsconfig.json", type: "file", path: "tsconfig.json", language: "json" },
      { id: "eas_json", name: "eas.json", type: "file", path: "eas.json", language: "json" },
    ];
    const screensFolder = tree[0].children?.[0];
    if (screensFolder) {
      screensFolder.children = files.map(f => ({ id: f.id, name: f.name, type: "file" as const, path: f.path, language: f.language }));
    }
    return tree;
  }
  return [
    { id: "app_dir", name: "app", type: "folder", path: "app", children: [
      { id: "src_main", name: "src/main", type: "folder", path: "app/src/main", children: [
        { id: "java_dir", name: `java/${pkgPath}`, type: "folder", path: `app/src/main/java/${pkgPath}`,
          children: files.filter(f => f.language !== "xml").map(f => ({ id: f.id, name: f.name, type: "file" as const, path: f.path, language: f.language }))},
        { id: "res_dir", name: "res", type: "folder", path: "app/src/main/res", children: [
          { id: "layout_dir", name: "layout", type: "folder", path: "res/layout", children: files.filter(f => f.language === "xml").map(f => ({ id: f.id, name: f.name, type: "file" as const, path: f.path, language: "xml" })) },
          { id: "drawable", name: "drawable", type: "folder", path: "res/drawable", children: [] },
          { id: "values", name: "values", type: "folder", path: "res/values", children: [
            { id: "strings_xml", name: "strings.xml", type: "file", path: "res/values/strings.xml", language: "xml" },
            { id: "colors_xml", name: "colors.xml", type: "file", path: "res/values/colors.xml", language: "xml" },
          ]},
        ]},
        { id: "manifest", name: "AndroidManifest.xml", type: "file", path: "app/src/main/AndroidManifest.xml", language: "xml" },
      ]},
      { id: "build_gradle", name: "build.gradle", type: "file", path: "app/build.gradle", language: "groovy" },
    ]},
    { id: "root_gradle", name: "build.gradle", type: "file", path: "build.gradle", language: "groovy" },
    { id: "settings_gradle", name: "settings.gradle", type: "file", path: "settings.gradle", language: "groovy" },
    { id: "gitignore", name: ".gitignore", type: "file", path: ".gitignore" },
  ];
}

function getFileIcon(file: FileNode) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (file.type === "folder") return null;
  if (ext === "kt" || ext === "java") return <FileCode size={13} className="text-violet-500 shrink-0" />;
  if (["ts", "tsx", "js", "jsx"].includes(ext || "")) return <FileCode size={13} className="text-blue-500 shrink-0" />;
  if (ext === "xml") return <FileCode size={13} className="text-emerald-500 shrink-0" />;
  if (ext === "json") return <FileJson size={13} className="text-amber-500 shrink-0" />;
  if (ext === "gradle") return <Settings size={13} className="text-orange-500 shrink-0" />;
  if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext || "")) return <Image size={13} className="text-pink-500 shrink-0" />;
  if (ext === "apk" || ext === "aab") return <Package size={13} className="text-emerald-500 shrink-0" />;
  return <File size={13} className="text-gray-400 shrink-0" />;
}

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onRename: (id: string, oldName: string) => void;
}

const REAL_FILE_IDS_EXCLUDE = ["manifest", "strings_xml", "colors_xml", "themes_xml", "build_gradle", "root_gradle", "settings_gradle", "local_props", "gitignore", "proguard", "gradle_props", "app_json", "pkg_json", "tsconfig", "eas_json", "babel_cfg"];

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, activeFileId, onFileSelect, onDelete, onRename }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const [hovered, setHovered] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(node.name);

  const isActive = node.type === "file" && node.id === activeFileId;
  const isRealFile = node.type === "file" && !REAL_FILE_IDS_EXCLUDE.includes(node.id);

  return (
    <div>
      <div
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={cn("flex items-center gap-1.5 py-1 pr-2 cursor-pointer rounded-lg mx-1 group transition-all text-xs",
          isActive ? "bg-blue-100 text-blue-700 font-semibold" : hovered ? "bg-gray-100 text-gray-800" : "text-gray-600")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (node.type === "folder") setExpanded(!expanded);
          else if (isRealFile) onFileSelect(node.id);
        }}
      >
        {node.type === "folder" ? (
          <>
            {expanded ? <ChevronDown size={11} className="shrink-0 text-gray-400" /> : <ChevronRight size={11} className="shrink-0 text-gray-400" />}
            {expanded ? <FolderOpen size={13} className="text-amber-500 shrink-0" /> : <Folder size={13} className="text-amber-400 shrink-0" />}
          </>
        ) : (
          <><span className="w-[11px] shrink-0" />{getFileIcon(node)}</>
        )}

        {renaming ? (
          <input autoFocus value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onBlur={() => { onRename(node.id, renameVal); setRenaming(false); }}
            onKeyDown={e => { if (e.key === "Enter") { onRename(node.id, renameVal); setRenaming(false); } if (e.key === "Escape") setRenaming(false); }}
            className="flex-1 bg-white border border-blue-400 rounded px-1 text-xs text-gray-900 focus:outline-none"
            onClick={e => e.stopPropagation()} />
        ) : (
          <span className="flex-1 truncate">{node.name}</span>
        )}

        {hovered && isRealFile && !renaming && (
          <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={() => setRenaming(true)} className="p-0.5 rounded hover:text-blue-600 transition-colors">
              <Edit3 size={10} />
            </button>
            <button onClick={() => onDelete(node.id, node.name)} className="p-0.5 rounded hover:text-rose-600 transition-colors">
              <Trash2 size={10} />
            </button>
          </div>
        )}
      </div>

      {node.type === "folder" && expanded && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1}
              activeFileId={activeFileId} onFileSelect={onFileSelect}
              onDelete={onDelete} onRename={onRename} />
          ))}
        </div>
      )}
    </div>
  );
};

const LANG_TEMPLATES: Record<string, string> = {
  kotlin: "// New Kotlin file\npackage com.example.app\n\nclass NewFile {\n    \n}\n",
  java: "// New Java file\npackage com.example.app;\n\npublic class NewFile {\n    \n}\n",
  xml: "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<LinearLayout\n    xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    android:orientation=\"vertical\">\n\n</LinearLayout>",
  typescript: "import React from 'react';\nimport { View, Text } from 'react-native';\n\nconst NewScreen = () => (\n  <View>\n    <Text>New Screen</Text>\n  </View>\n);\n\nexport default NewScreen;\n",
  javascript: "// New JavaScript file\n",
  json: "{\n  \"name\": \"new-config\"\n}\n",
};

const ProjectFileManager: React.FC<ProjectFileManagerProps> = ({
  files, activeFileId, projectType, packageName,
  onFileSelect, onFileCreate, onFileDelete, onFileRename,
}) => {
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileLang, setNewFileLang] = useState(
    projectType === "react-native" ? "typescript" : projectType === "java" ? "java" : "kotlin"
  );

  const tree = buildFileTree(files, projectType, packageName);

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const ext = newFileName.includes(".") ? "" : (newFileLang === "kotlin" ? ".kt" : newFileLang === "java" ? ".java" : newFileLang === "typescript" ? ".tsx" : newFileLang === "xml" ? ".xml" : ".js");
    const name = newFileName + ext;
    const newFile: ProjectFile = { id: generateId(), name, path: `src/${name}`, content: LANG_TEMPLATES[newFileLang] || `// ${name}`, language: newFileLang, size: 0 };
    onFileCreate(newFile);
    setNewFileName("");
    setShowNewFile(false);
    toast.success(`Created ${name}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) { onFileDelete(id); toast.success(`Deleted ${name}`); }
  };

  const handleRename = (id: string, newName: string) => {
    if (newName.trim()) { onFileRename(id, newName); toast.success(`Renamed to ${newName}`); }
  };

  const langs = projectType === "react-native" ? ["typescript", "javascript", "json"] : ["kotlin", "java", "xml", "json"];

  return (
    <div className="flex flex-col h-full bg-white/60 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-blue-100/50 bg-white/80 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Smartphone size={13} className="text-blue-500" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Files</span>
        </div>
        <button onClick={() => setShowNewFile(!showNewFile)}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="New File">
          <Plus size={14} />
        </button>
      </div>

      {/* New file form */}
      {showNewFile && (
        <div className="p-3 border-b border-blue-100/50 bg-blue-50/50 space-y-2">
          <div className="flex gap-1.5">
            <input autoFocus type="text" value={newFileName} onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreateFile(); if (e.key === "Escape") setShowNewFile(false); }}
              placeholder="filename" className="flex-1 bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
            <button onClick={handleCreateFile} disabled={!newFileName.trim()}
              className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg disabled:opacity-40 transition-colors">
              <Check size={13} />
            </button>
            <button onClick={() => setShowNewFile(false)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors">
              <X size={13} />
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {langs.map(l => (
              <button key={l} onClick={() => setNewFileLang(l)}
                className={cn("text-xs px-2 py-0.5 rounded-lg transition-colors",
                  newFileLang === l ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900")}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree.map(node => (
          <TreeNode key={node.id} node={node} depth={0}
            activeFileId={activeFileId} onFileSelect={onFileSelect}
            onDelete={handleDelete} onRename={handleRename} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-blue-100/50 bg-white/80">
        <p className="text-xs text-gray-400 font-medium">{files.length} file{files.length !== 1 ? "s" : ""} · {projectType}</p>
      </div>
    </div>
  );
};

export default ProjectFileManager;
