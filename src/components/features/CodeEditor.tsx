import React, { useState, useRef } from "react";
import { Copy, Check, Save, FileCode, RefreshCw } from "lucide-react";
import { ProjectFile } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CodeEditorProps {
  files: ProjectFile[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onContentChange: (fileId: string, content: string) => void;
  onSave?: (fileId: string) => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  kotlin: "text-violet-600",
  java: "text-amber-600",
  xml: "text-emerald-600",
  json: "text-amber-500",
  typescript: "text-blue-600",
  javascript: "text-amber-500",
  groovy: "text-orange-500",
};

const LANGUAGE_KEYWORDS: Record<string, string[]> = {
  kotlin: ['fun', 'val', 'var', 'class', 'object', 'interface', 'override', 'private', 'public', 'protected', 'internal', 'import', 'package', 'return', 'if', 'else', 'when', 'for', 'while', 'true', 'false', 'null', 'this', 'super', 'data', 'sealed', 'companion', 'by', 'in', 'is', 'as', 'lateinit', 'suspend'],
  java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'new', 'this', 'super', 'static', 'final', 'void', 'int', 'String', 'boolean', 'null', 'true', 'false'],
  typescript: ['const', 'let', 'var', 'function', 'class', 'interface', 'type', 'import', 'export', 'from', 'return', 'if', 'else', 'for', 'while', 'async', 'await', 'new', 'this', 'extends', 'implements', 'true', 'false', 'null', 'undefined', 'React'],
};

function syntaxHighlight(code: string, language: string): string {
  const keywords = LANGUAGE_KEYWORDS[language] || LANGUAGE_KEYWORDS.typescript;
  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="syntax-comment">$1</span>');
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
  highlighted = highlighted.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="syntax-string">$1</span>');
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="syntax-number">$1</span>');
  keywords.forEach(kw => {
    highlighted = highlighted.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="syntax-keyword">$1</span>');
  });
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="syntax-function">$1</span>');
  return highlighted;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ files, activeFileId, onFileSelect, onContentChange, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Code copied to clipboard");
    }
  };

  const handleSave = () => {
    if (activeFileId && onSave) {
      onSave(activeFileId);
      toast.success("File saved successfully");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent = activeFile!.content.substring(0, start) + "    " + activeFile!.content.substring(end);
      onContentChange(activeFileId!, newContent);
      setTimeout(() => {
        if (textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  const lines = activeFile?.content.split("\n") || [];

  return (
    <div className="flex flex-col h-full" style={{ background: "#f8f9ff" }}>
      {/* File tabs */}
      <div className="flex items-center bg-white border-b border-blue-100/60 overflow-x-auto shadow-sm">
        {files.map(file => (
          <button key={file.id} onClick={() => onFileSelect(file.id)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2.5 text-xs border-r border-gray-100 whitespace-nowrap transition-all shrink-0 font-medium",
              file.id === activeFileId
                ? "bg-blue-50 text-blue-700 border-t-2 border-t-blue-500"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            )}>
            <FileCode size={12} className={LANGUAGE_COLORS[file.language] || "text-gray-400"} />
            {file.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b border-gray-100 shadow-sm">
        <span className="text-xs text-gray-500 font-mono font-semibold">{activeFile?.language?.toUpperCase() || "TEXT"}</span>
        <div className="flex-1" />
        <button onClick={() => setLineNumbers(!lineNumbers)}
          className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
          <RefreshCw size={12} />
        </button>
        <button onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
          {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleSave}
          className="btn-primary text-xs px-3 py-1.5">
          <Save size={12} /> Save
        </button>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-hidden flex">
        {/* Line numbers */}
        {lineNumbers && (
          <div className="w-12 bg-gray-50 border-r border-gray-100 pt-3 pb-3 overflow-hidden shrink-0 select-none">
            {lines.map((_, i) => (
              <div key={i} className="text-right pr-3 text-xs text-gray-300 font-mono leading-6">{i + 1}</div>
            ))}
          </div>
        )}

        {/* Code area */}
        <div className="flex-1 relative overflow-auto bg-white">
          {activeFile ? (
            <textarea
              ref={textareaRef}
              value={activeFile.content}
              onChange={e => onContentChange(activeFileId!, e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full h-full bg-transparent font-mono text-sm
                         resize-none outline-none p-3 leading-6 z-10 text-transparent
                         caret-blue-600 selection:bg-blue-100"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FileCode size={32} className="mx-auto mb-2 text-blue-200" />
                <p className="text-sm font-medium">Select a file to edit</p>
              </div>
            </div>
          )}

          {/* Syntax highlighted overlay */}
          {activeFile && (
            <pre
              className="absolute inset-0 pointer-events-none p-3 font-mono text-sm leading-6 overflow-hidden whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(activeFile.content, activeFile.language) }}
            />
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-3 py-1.5 bg-blue-600 text-xs text-white">
        <span>Ln {lines.length}</span>
        <span>Col 1</span>
        <span>{activeFile?.language?.toUpperCase() || "TEXT"}</span>
        <span>{activeFile ? `${activeFile.size} bytes` : ""}</span>
        <div className="flex-1" />
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
};

export default CodeEditor;
