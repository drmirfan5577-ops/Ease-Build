import React, { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Sparkles, Code2, Bug, RefreshCw, Lightbulb,
  Copy, Check, X, ChevronDown, Loader2, Zap
} from "lucide-react";
import { AIMessage } from "@/types";
import { cn, generateId } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AIAssistantProps {
  projectType?: string;
  currentCode?: string;
  onInsertCode?: (code: string) => void;
}

const QUICK_ACTIONS = [
  { icon: Code2, label: "Generate Activity", prompt: "Generate a complete Android Activity with RecyclerView, adapter, and sample data. Include Kotlin code with ViewBinding.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { icon: Bug, label: "Fix My Code", prompt: "Review the following code and fix any bugs, memory leaks, or anti-patterns:", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  { icon: Lightbulb, label: "Best Practices", prompt: "What are the top 10 Android development best practices for 2025 production apps?", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { icon: Sparkles, label: "Optimize Code", prompt: "Optimize this code for performance, readability and maintainability. Use modern Kotlin idioms:", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  { icon: RefreshCw, label: "Convert to Kotlin", prompt: "Convert the following Java code to idiomatic Kotlin with coroutines:", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { icon: Zap, label: "Add Firebase", prompt: "Show me how to integrate Firebase Auth, Firestore, and Cloud Messaging into an Android app.", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
];

const MODELS = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash", badge: "Fast" },
  { id: "google/gemini-3-pro-preview", label: "Gemini 3 Pro", badge: "Best" },
  { id: "openai/gpt-5.1", label: "GPT-5.1", badge: "GPT" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", badge: "Lite" },
];

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="my-2 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-200">
        <span className="text-xs text-gray-500 font-mono font-semibold">{language || "code"}</span>
        <button onClick={handleCopy} className="text-gray-500 hover:text-blue-600 transition-colors p-0.5">
          {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
        </button>
      </div>
      <pre className="p-3 bg-gray-900 text-xs text-gray-100 font-mono overflow-x-auto leading-5 whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          if (match) return <CodeBlock key={i} language={match[1]} code={match[2]} />;
        }
        return <p key={i} className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{part}</p>;
      })}
    </>
  );
}

const AIAssistant: React.FC<AIAssistantProps> = ({ projectType, currentCode, onInsertCode }) => {
  const [messages, setMessages] = useState<AIMessage[]>([{
    id: "welcome",
    role: "assistant",
    content: `Hello! I'm your AI coding assistant powered by Gemini 3 Flash & GPT-5.\n\nI specialize in:\n• Android (Kotlin/Java) — Activities, Fragments, Jetpack, MVVM\n• React Native — Hooks, TypeScript, Expo, Navigation\n• Code Review — Bugs, performance, best practices\n• Architecture — Clean arch, MVVM, Repository pattern\n\nAsk me anything or use a quick action below!`,
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: AIMessage = { id: generateId(), role: "user", content, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantId = generateId();
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: new Date().toISOString() }]);

    try {
      const apiMessages = messages.filter(m => m.id !== "welcome").concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ messages: apiMessages, language: projectType || "kotlin", mode: "coding", context: currentCode ? `Current code:\n${currentCode.slice(0, 1000)}` : "" }),
        }
      );

      if (!response.ok || !response.body) { throw new Error(await response.text() || "AI request failed"); }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const delta = JSON.parse(line.slice(6)).choices?.[0]?.delta?.content || "";
              if (delta) {
                accumulated += delta;
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m));
              }
            } catch {}
          }
        }
      }
    } catch (err: any) {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Sorry, I encountered an error. Please try again.\n\nError: " + err.message } : m));
      toast.error("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ id: "welcome", role: "assistant", content: "Chat cleared! How can I help you?", timestamp: new Date().toISOString() }]);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(135deg, #fafbff, #f0f4ff)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass-crystal border-b border-blue-100/50 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md">
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">AI Code Assistant</p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> Online · OnSpace AI
          </p>
        </div>

        {/* Model selector */}
        <div className="relative">
          <button onClick={() => setModelOpen(!modelOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-blue-200 rounded-xl text-xs text-gray-700 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-sm">
            <Sparkles size={11} className="text-violet-500" />
            {selectedModel.label}
            <ChevronDown size={11} />
          </button>
          {modelOpen && (
            <div className="absolute right-0 top-full mt-1 glass-crystal border border-blue-100 rounded-2xl shadow-xl z-50 w-48 overflow-hidden">
              {MODELS.map(m => (
                <button key={m.id} onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                  className={cn("w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-blue-50 transition-colors",
                    selectedModel.id === m.id ? "text-blue-700 font-semibold bg-blue-50" : "text-gray-700")}>
                  {m.label}
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-lg">{m.badge}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={clearChat} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Clear chat">
          <X size={14} />
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-auto bg-white/60 border-b border-blue-100/30">
        {QUICK_ACTIONS.map(action => (
          <button key={action.label} onClick={() => sendMessage(action.prompt)} disabled={loading}
            className={cn("flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xl text-xs whitespace-nowrap transition-all shrink-0 font-medium disabled:opacity-50",
              action.bg, action.border, action.color, "hover:shadow-sm")}>
            <action.icon size={11} />
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-md",
              msg.role === "user" ? "bg-gradient-to-br from-rose-500 to-blue-600" : "bg-gradient-to-br from-blue-500 to-violet-600")}>
              {msg.role === "user" ? (
                <span className="text-white text-xs font-bold">U</span>
              ) : (
                <Bot size={14} className="text-white" />
              )}
            </div>
            <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
              msg.role === "user"
                ? "bg-gradient-to-br from-blue-600 to-blue-700 rounded-tr-sm"
                : "glass-crystal border border-blue-100/50 rounded-tl-sm")}>
              {msg.content === "" && loading ? (
                <div className="flex items-center gap-2 py-1">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  <span className="text-xs text-gray-500">Generating...</span>
                </div>
              ) : msg.role === "user" ? (
                <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <MessageContent content={msg.content} />
              )}
              {msg.role === "assistant" && msg.content && onInsertCode && (
                <button
                  onClick={() => {
                    const codeMatch = msg.content.match(/```[\w]*\n([\s\S]*?)```/);
                    if (codeMatch) { onInsertCode(codeMatch[1]); toast.success("Code inserted into editor"); }
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors font-semibold">
                  <Code2 size={11} /> Insert code into editor
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 glass-crystal border-t border-blue-100/50 shadow-sm">
        <div className="flex items-end gap-2 bg-white border border-blue-200 rounded-2xl p-2 focus-within:border-blue-400 transition-colors shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about Android, Kotlin, React Native... (Enter to send)"
            rows={2}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-5 max-h-32"
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="btn-primary p-2.5 rounded-xl shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center font-medium">
          Powered by OnSpace AI · Gemini 3 Flash & GPT-5
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
