import React, { useState } from "react";
import { Trash2, Move, Settings, Plus, Smartphone, Tablet, Monitor } from "lucide-react";
import { UIComponent, ComponentType } from "@/types";
import { ANDROID_COMPONENTS, REACT_NATIVE_COMPONENTS } from "@/constants";
import { cn, generateId } from "@/lib/utils";
import { toast } from "sonner";

interface DragDropBuilderProps {
  components: UIComponent[];
  projectType: string;
  onChange: (components: UIComponent[]) => void;
}

const COMPONENT_RENDER: Record<string, React.FC<{ comp: UIComponent }>> = {
  Button: ({ comp }) => (
    <div className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer text-center select-none hover:bg-blue-700 transition-colors shadow-sm" style={{ width: comp.width, minHeight: 36 }}>
      {(comp.props.text as string) || "Button"}
    </div>
  ),
  TextView: ({ comp }) => (
    <div className="text-gray-800 text-sm select-none font-medium" style={{ fontSize: (comp.styles.fontSize as string) || "14px" }}>
      {(comp.props.text as string) || "Text View"}
    </div>
  ),
  EditText: ({ comp }) => (
    <div className="bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs text-gray-400 select-none shadow-sm" style={{ width: comp.width }}>
      {(comp.props.hint as string) || "Enter text..."}
    </div>
  ),
  ImageView: ({ comp }) => (
    <div className="bg-gray-100 border-2 border-dashed border-blue-200 flex items-center justify-center text-gray-400 text-xs select-none rounded-xl" style={{ width: comp.width, height: comp.height }}>
      🖼️ Image
    </div>
  ),
  CardView: ({ comp }) => (
    <div className="glass-crystal border border-blue-100 rounded-2xl p-3 select-none shadow-lg" style={{ width: comp.width }}>
      <div className="text-xs text-gray-600 font-medium">{(comp.props.title as string) || "Card View"}</div>
    </div>
  ),
  Toolbar: ({ comp }) => (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 select-none rounded-xl shadow-md" style={{ width: comp.width || 280 }}>
      <span className="text-sm font-bold">{(comp.props.title as string) || "App Toolbar"}</span>
    </div>
  ),
  CheckBox: ({ comp }) => (
    <div className="flex items-center gap-2 select-none">
      <div className="w-4 h-4 border-2 border-blue-500 rounded bg-blue-50 flex items-center justify-center">
        <div className="w-2 h-2 bg-blue-600 rounded-sm" />
      </div>
      <span className="text-xs text-gray-700 font-medium">{(comp.props.text as string) || "CheckBox"}</span>
    </div>
  ),
  Switch: ({ comp }) => (
    <div className="flex items-center gap-2 select-none">
      <div className="w-10 h-5 bg-emerald-500 rounded-full relative shadow-sm">
        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
      </div>
      <span className="text-xs text-gray-700 font-medium">{(comp.props.text as string) || "Switch"}</span>
    </div>
  ),
  ProgressBar: () => (
    <div className="w-full bg-blue-100 rounded-full h-2 select-none">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full shadow-sm" style={{ width: "65%" }} />
    </div>
  ),
  BottomNavigation: () => (
    <div className="glass-crystal border-t border-blue-100 flex justify-around py-2 select-none rounded-b-xl" style={{ width: 280 }}>
      {["Home", "Search", "Profile"].map(t => (
        <div key={t} className="text-xs text-gray-500 flex flex-col items-center gap-1 font-medium">
          <div className="w-5 h-0.5 bg-blue-400 rounded" />{t}
        </div>
      ))}
    </div>
  ),
  FloatingActionButton: () => (
    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-transform select-none">
      <Plus size={20} className="text-white" />
    </div>
  ),
};

function renderComponent(comp: UIComponent): React.ReactNode {
  const Renderer = COMPONENT_RENDER[comp.type];
  if (Renderer) return <Renderer comp={comp} />;
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 font-medium select-none">{comp.type}</div>
  );
}

const DragDropBuilder: React.FC<DragDropBuilderProps> = ({ components, projectType, onChange }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [activeCategory, setActiveCategory] = useState("Basic");

  const allComponents = projectType === "react-native" ? REACT_NATIVE_COMPONENTS : ANDROID_COMPONENTS;
  const categories = [...new Set(allComponents.map(c => c.category))];
  const filteredComponents = allComponents.filter(c => c.category === activeCategory);

  const addComponent = (type: string) => {
    const newComp: UIComponent = {
      id: generateId(),
      type: type as ComponentType,
      props: { text: type, hint: `${type} input` },
      x: 20 + Math.random() * 40,
      y: 20 + components.length * 60,
      width: 200,
      height: 44,
      styles: {},
    };
    onChange([...components, newComp]);
    setSelectedId(newComp.id);
    toast.success(`${type} added to canvas`);
  };

  const removeComponent = (id: string) => {
    onChange(components.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast.success("Component removed");
  };

  const selectedComp = components.find(c => c.id === selectedId);

  const updateSelectedProp = (key: string, value: string) => {
    if (!selectedId) return;
    onChange(components.map(c => c.id === selectedId ? { ...c, props: { ...c.props, [key]: value } } : c));
  };

  return (
    <div className="flex h-full" style={{ background: "linear-gradient(135deg, #fafbff, #f0f4ff)" }}>
      {/* Component Palette */}
      <div className="w-48 glass-crystal border-r border-blue-100/50 flex flex-col shrink-0 shadow-lg">
        <div className="p-3 border-b border-blue-100/50">
          <p className="text-xs font-bold text-gray-800">
            {projectType === "react-native" ? "React Native" : "Android"} Components
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-blue-100/50">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn("text-xs px-2 py-1 rounded-lg transition-colors font-medium",
                activeCategory === cat ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100")}>
              {cat}
            </button>
          ))}
        </div>

        {/* Component list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredComponents.map(comp => (
            <button key={comp.type} onClick={() => addComponent(comp.type)} draggable
              onDragStart={() => setDraggingId(comp.type)} onDragEnd={() => setDraggingId(null)}
              className={cn("drag-component w-full text-left", draggingId === comp.type && "opacity-50 scale-95")}>
              <span className="mr-1.5">{comp.icon}</span>
              <span className="text-gray-700 font-medium">{comp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Canvas toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-blue-100/50 glass-crystal shadow-sm">
          <span className="text-xs text-gray-500 font-semibold">Preview:</span>
          {(["mobile", "tablet", "desktop"] as const).map(size => (
            <button key={size} onClick={() => setPreview(size)}
              className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors",
                preview === size ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100")}>
              {size === "mobile" ? <Smartphone size={12} /> : size === "tablet" ? <Tablet size={12} /> : <Monitor size={12} />}
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-xs text-gray-400 font-medium">{components.length} components</span>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto p-6 flex justify-center">
          <div className={cn("relative", preview === "mobile" ? "w-72" : preview === "tablet" ? "w-96" : "w-full max-w-2xl")}>
            {preview === "mobile" ? (
              <div className="mobile-frame relative" style={{ borderRadius: 36, border: "3px solid #e5e7f0", boxShadow: "0 20px 60px rgba(26,86,255,.12)" }}>
                <div className="rounded-[30px] overflow-hidden" style={{ background: "#f8f9ff", minHeight: 580, paddingTop: 28, paddingBottom: 16, paddingLeft: 8, paddingRight: 8 }}>
                  <div className="canvas-drop-zone relative"
                    style={{ minHeight: 520 }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); if (draggingId) addComponent(draggingId); }}>
                    {components.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-300 text-center">
                        <Plus size={24} className="mb-2" />
                        <p className="text-xs font-medium">Drag components here<br />or click from palette</p>
                      </div>
                    )}
                    <div className="space-y-3 p-3">
                      {components.map(comp => (
                        <div key={comp.id}
                          onClick={() => setSelectedId(comp.id === selectedId ? null : comp.id)}
                          className={cn("relative group cursor-pointer transition-all", comp.id === selectedId && "ring-2 ring-blue-400 rounded-xl")}>
                          {renderComponent(comp)}
                          {comp.id === selectedId && (
                            <div className="absolute -top-2 -right-2 flex gap-1">
                              <button className="w-5 h-5 bg-white border border-gray-200 rounded shadow flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                <Move size={10} className="text-gray-500" />
                              </button>
                              <button className="w-5 h-5 bg-rose-500 rounded shadow flex items-center justify-center hover:bg-rose-600" onClick={e => { e.stopPropagation(); removeComponent(comp.id); }}>
                                <Trash2 size={10} className="text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="canvas-drop-zone glass-crystal rounded-2xl min-h-[520px] p-4 space-y-3 shadow-xl"
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (draggingId) addComponent(draggingId); }}>
                {components.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-300 text-center">
                    <Plus size={24} className="mb-2" />
                    <p className="text-xs font-medium">Drag components or click from palette</p>
                  </div>
                )}
                {components.map(comp => (
                  <div key={comp.id}
                    onClick={() => setSelectedId(comp.id === selectedId ? null : comp.id)}
                    className={cn("relative cursor-pointer transition-all", comp.id === selectedId && "ring-2 ring-blue-400 rounded-xl")}>
                    {renderComponent(comp)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-52 glass-crystal border-l border-blue-100/50 flex flex-col shrink-0 shadow-lg">
        <div className="p-3 border-b border-blue-100/50 flex items-center gap-2">
          <Settings size={14} className="text-blue-500" />
          <span className="text-xs font-bold text-gray-800">Properties</span>
        </div>
        {selectedComp ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-semibold">Component Type</label>
              <div className="text-xs text-blue-700 font-mono bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg">{selectedComp.type}</div>
            </div>
            {Object.entries(selectedComp.props).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-1 capitalize font-semibold">{key}</label>
                <input type="text" value={String(value)} onChange={e => updateSelectedProp(key, e.target.value)} className="input-bright text-xs py-1.5" />
              </div>
            ))}
            <button onClick={() => removeComponent(selectedComp.id)}
              className="btn-crimson w-full text-xs py-1.5">
              <Trash2 size={12} /> Remove
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs text-center p-4 leading-relaxed">
            Select a component to edit its properties
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropBuilder;
