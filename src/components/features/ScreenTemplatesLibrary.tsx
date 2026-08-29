import React, { useState } from "react";
import { Search, Grid, List, Smartphone, X, Plus, Sparkles } from "lucide-react";
import { ScreenTemplate, UIComponent } from "@/types";
import { SCREEN_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/screenTemplates";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ScreenTemplatesLibraryProps {
  projectType: string;
  onApply: (components: UIComponent[]) => void;
  onClose: () => void;
}

const ScreenTemplatesLibrary: React.FC<ScreenTemplatesLibraryProps> = ({ projectType, onApply, onClose }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<ScreenTemplate | null>(null);

  const framework = projectType === "react-native" ? "react-native" : "android";

  const filtered = SCREEN_TEMPLATES.filter(t => {
    const matchSearch = search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchCategory = category === "All" || t.category === category;
    const matchFramework = t.framework === "both" || t.framework === framework;
    return matchSearch && matchCategory && matchFramework;
  });

  const handleApply = (template: ScreenTemplate) => {
    onApply(template.components);
    toast.success(`"${template.name}" applied to canvas`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-crystal border border-blue-100/60 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl shadow-blue-200/40 anim-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-blue-100/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-gray-900">Screen Template Library</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {SCREEN_TEMPLATES.length}+ pre-built screens · Click to preview · Apply to canvas instantly
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              {viewMode === "grid" ? <List size={16} /> : <Grid size={16} />}
            </button>
            <button onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-44 border-r border-blue-100/50 p-3 overflow-y-auto shrink-0 space-y-0.5 bg-white/50">
            {TEMPLATE_CATEGORIES.map(cat => {
              const count = cat === "All" ? filtered.length : SCREEN_TEMPLATES.filter(t => t.category === cat && (t.framework === "both" || t.framework === framework)).length;
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={cn("w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between font-medium",
                    category === cat ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")}>
                  <span>{cat}</span>
                  {count > 0 && (
                    <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold",
                      category === cat ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-500")}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-blue-100/50 bg-white/60">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search templates by name, category or tags..."
                  className="input-bright pl-9" />
              </div>
            </div>

            {/* Templates */}
            <div className="flex-1 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
                  <Smartphone size={32} className="mb-3 text-blue-200" />
                  <p className="text-sm font-medium text-gray-600">No templates match your search</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search term or category</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filtered.map(template => (
                    <button key={template.id}
                      onClick={() => setSelected(selected?.id === template.id ? null : template)}
                      className={cn("glass-crystal border rounded-2xl p-4 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group",
                        selected?.id === template.id ? "border-blue-400 ring-2 ring-blue-200" : "border-blue-100 hover:border-blue-300")}>
                      <div className="text-3xl mb-3 text-center">{template.thumbnail}</div>
                      <p className="text-xs font-bold text-gray-800 mb-1 truncate">{template.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="badge-blue text-xs">{template.category}</span>
                        <span className="badge-emerald text-xs">{template.components.length} comps</span>
                      </div>
                      {selected?.id === template.id && (
                        <button onClick={e => { e.stopPropagation(); handleApply(template); }}
                          className="btn-primary mt-3 w-full text-xs py-2">
                          <Plus size={12} /> Apply to Canvas
                        </button>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(template => (
                    <div key={template.id}
                      className={cn("glass-crystal flex items-center gap-4 border rounded-2xl p-3 transition-all cursor-pointer hover:shadow-md",
                        selected?.id === template.id ? "border-blue-400" : "border-blue-100 hover:border-blue-300")}
                      onClick={() => setSelected(selected?.id === template.id ? null : template)}>
                      <span className="text-2xl w-10 text-center shrink-0">{template.thumbnail}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{template.name}</p>
                        <p className="text-xs text-gray-500 truncate">{template.description}</p>
                        <div className="flex gap-1 mt-1">
                          {template.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-lg font-medium">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 font-medium">{template.components.length} comps</span>
                        <button onClick={e => { e.stopPropagation(); handleApply(template); }}
                          className="btn-primary text-xs px-3 py-1.5">
                          <Plus size={12} /> Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-blue-100/50 px-5 py-3 flex items-center justify-between bg-white/60">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="text-blue-600 font-bold">{filtered.length}</span> of {SCREEN_TEMPLATES.length} templates · {framework === "react-native" ? "React Native" : "Android"} mode
          </p>
          <button onClick={onClose}
            className="btn-ghost text-xs px-3 py-1.5">
            Close Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenTemplatesLibrary;
