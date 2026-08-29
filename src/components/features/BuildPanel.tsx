import React, { useState, useEffect } from "react";
import {
  Play, Download, CheckCircle, XCircle, Clock, Loader2, Package,
  AlertTriangle, Globe, ExternalLink, Bell,
  RefreshCw, Terminal, Settings, ChevronDown, ChevronUp, Sparkles
} from "lucide-react";
import { Project } from "@/types";
import { BUILD_SIMULATION_LOGS } from "@/constants";
import { cn, generateId, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface BuildLog {
  id: string;
  status: "building" | "success" | "failed";
  startedAt: string;
  completedAt?: string;
  size?: string;
  platform: string;
  downloadUrl?: string;
}

interface DeployWizard {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: string[];
  color: string;
  url: string;
}

const DEPLOY_WIZARDS: DeployWizard[] = [
  {
    id: "eas", name: "Expo EAS Build", icon: "📱",
    description: "Cloud build for React Native — generates real AAB/APK",
    steps: [
      "npm install -g eas-cli",
      "eas login  # Login with your Expo account",
      "eas build:configure  # Creates eas.json",
      "eas build --platform android --profile preview",
      "# APK download link appears in Expo dashboard"
    ],
    color: "#4630EB", url: "https://expo.dev/eas",
  },
  {
    id: "github", name: "GitHub Actions CI/CD", icon: "🐙",
    description: "Auto-build & deploy on every push to main branch",
    steps: [
      "# Create .github/workflows/build.yml",
      "on: push: branches: [main]",
      "jobs: build: runs-on: ubuntu-latest",
      "  - uses: expo/expo-github-action@v8",
      "  - run: eas build --non-interactive"
    ],
    color: "#333", url: "https://github.com/features/actions",
  },
  {
    id: "netlify", name: "Netlify Deploy", icon: "🌿",
    description: "Deploy web preview of your React Native Web app",
    steps: [
      "npm install -g netlify-cli",
      "netlify login",
      "netlify init",
      "npm run build  # expo export --platform web",
      "netlify deploy --prod --dir=web-build"
    ],
    color: "#00C7B7", url: "https://netlify.com",
  },
  {
    id: "playstore", name: "Google Play Store", icon: "🏪",
    description: "Publish signed AAB to Play Console for production",
    steps: [
      "eas build --platform android --profile production",
      "# Download .aab from EAS dashboard",
      "# Go to play.google.com/console",
      "# Create release > Upload .aab",
      "# Review and Publish"
    ],
    color: "#34A853", url: "https://play.google.com/console",
  },
  {
    id: "firebase", name: "Firebase App Distribution", icon: "🔥",
    description: "Share test APKs with testers via Firebase",
    steps: [
      "npm install -g firebase-tools",
      "firebase login",
      "# Build: eas build --profile preview",
      "firebase appdistribution:distribute app.apk \\",
      "  --app YOUR_APP_ID --groups testers"
    ],
    color: "#FFA000", url: "https://firebase.google.com",
  },
  {
    id: "vercel", name: "Vercel Deploy", icon: "▲",
    description: "Deploy React Native Web to Vercel edge network",
    steps: [
      "npm install -g vercel",
      "expo export --platform web",
      "vercel --prod",
      "# App goes live at yourapp.vercel.app",
      "# Configure custom domain in Vercel dashboard"
    ],
    color: "#000", url: "https://vercel.com",
  }
];

const EAS_CONFIG = `{
  "cli": { "version": ">= 5.9.1" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk", "gradleCommand": ":app:assembleRelease" }
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "production"
      }
    }
  }
}`;

const GITHUB_WORKFLOW = `name: EAS Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    name: Build Android APK
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Setup Expo & EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - name: Build APK
        run: eas build --platform android --profile preview --non-interactive`;

interface BuildPanelProps {
  project: Project;
  onStatusChange?: (status: Project["status"]) => void;
}

const BuildPanel: React.FC<BuildPanelProps> = ({ project, onStatusChange }) => {
  const [currentBuild, setCurrentBuild] = useState<BuildLog | null>(null);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [previousBuilds, setPreviousBuilds] = useState<BuildLog[]>([]);
  const [buildType, setBuildType] = useState<"debug" | "release" | "bundle">("debug");
  const [activeWizard, setActiveWizard] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (isBuilding && logIndex < BUILD_SIMULATION_LOGS.length) {
      const timer = setTimeout(() => {
        setBuildLogs(prev => [...prev, BUILD_SIMULATION_LOGS[logIndex]]);
        setLogIndex(prev => prev + 1);
      }, 220 + Math.random() * 280);
      return () => clearTimeout(timer);
    } else if (isBuilding && logIndex >= BUILD_SIMULATION_LOGS.length) {
      setIsBuilding(false);
      if (currentBuild) {
        const apkUrl = `https://esmartworld.onspace.app/builds/${project.id}/app-${buildType}.apk`;
        const completed: BuildLog = { ...currentBuild, status: "success", completedAt: new Date().toISOString(), size: buildType === "bundle" ? "8.2 MB" : "4.7 MB", downloadUrl: apkUrl };
        setCurrentBuild(completed);
        setPreviousBuilds(prev => [completed, ...prev].slice(0, 8));
        onStatusChange?.("ready");
        if (notificationsEnabled) {
          toast.success(`Build #${completed.id.slice(-4)} complete!`, {
            description: `${buildType.toUpperCase()} ready · ${completed.size}`,
            action: { label: "Download", onClick: () => handleDownloadAPK(completed) },
            duration: 8000,
          });
        }
      }
    }
  }, [isBuilding, logIndex, currentBuild, notificationsEnabled]);

  const handleStartBuild = () => {
    if (isBuilding) return;
    const build: BuildLog = { id: generateId(), status: "building", startedAt: new Date().toISOString(), platform: "android" };
    setCurrentBuild(build);
    setBuildLogs([]);
    setLogIndex(0);
    setIsBuilding(true);
    onStatusChange?.("building");
    toast.info(`Starting ${buildType.toUpperCase()} build for ${project.type}...`);
  };

  const handleDownloadAPK = (build?: BuildLog) => {
    const target = build || currentBuild;
    if (target?.downloadUrl) window.open(target.downloadUrl, "_blank");
    toast.success("APK download initiated!");
  };

  const handleCopyConfig = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedConfig(id);
    setTimeout(() => setCopiedConfig(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const buildSuccess = currentBuild?.status === "success";
  const buildFailed = currentBuild?.status === "failed";

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "linear-gradient(135deg, #fafbff, #f0f4ff)" }}>
      {/* Build Header */}
      <div className="p-4 border-b border-blue-100/50 glass-crystal sticky top-0 z-10 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">v{project.versionName} · {project.packageName}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="badge-blue font-mono">{project.type}</span>
              <span className="badge-emerald">API {project.settings.targetSdk}</span>
              <span className="text-xs text-gray-400">{project.buildCount} builds</span>
              {isBuilding && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> building...
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end shrink-0">
            <div className="flex rounded-xl overflow-hidden border border-blue-100 text-xs">
              {(["debug", "release", "bundle"] as const).map(t => (
                <button key={t} onClick={() => setBuildType(t)}
                  className={cn("px-2.5 py-1.5 capitalize transition-colors font-semibold",
                    buildType === t ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 bg-white hover:bg-blue-50")}>
                  {t}
                </button>
              ))}
            </div>
            <button onClick={handleStartBuild} disabled={isBuilding}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                isBuilding ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "btn-primary")}>
              {isBuilding ? (
                <><Loader2 size={16} className="animate-spin" /> Building...</>
              ) : (
                <><Play size={16} /> Build {buildType === "bundle" ? "AAB" : "APK"}</>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Min SDK", value: project.settings.minSdk },
            { label: "Target SDK", value: project.settings.targetSdk },
            { label: "Build Tools", value: project.settings.buildTools },
          ].map(item => (
            <div key={item.label} className="bg-white border border-blue-100 rounded-xl p-2 text-center shadow-sm">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-mono text-gray-800 font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Notification toggle */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100/50">
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <Bell size={12} className="text-blue-500" /> Build notifications
          </span>
          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={cn("relative w-8 h-4 rounded-full transition-colors", notificationsEnabled ? "bg-emerald-500" : "bg-gray-300")}>
            <span className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm", notificationsEnabled ? "translate-x-4" : "translate-x-0.5")} />
          </button>
        </div>
      </div>

      {/* Build Status */}
      {currentBuild && (
        <div className={cn("mx-4 mt-4 p-3 rounded-2xl border flex items-center gap-3 shadow-md",
          buildSuccess ? "bg-emerald-50 border-emerald-200" : buildFailed ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200")}>
          {isBuilding ? (
            <Loader2 size={18} className="text-amber-600 animate-spin shrink-0" />
          ) : buildSuccess ? (
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <XCircle size={18} className="text-rose-600 shrink-0" />
          )}
          <div className="flex-1">
            <p className={cn("text-sm font-bold",
              buildSuccess ? "text-emerald-700" : buildFailed ? "text-rose-700" : "text-amber-700")}>
              {isBuilding ? "Build in progress..." : buildSuccess ? `✅ Build Successful · ${buildType.toUpperCase()}` : "❌ Build Failed"}
            </p>
            {buildSuccess && currentBuild.size && (
              <p className="text-xs text-gray-500">Size: {currentBuild.size} · Completed {formatDateTime(currentBuild.completedAt || "")}</p>
            )}
          </div>
          {buildSuccess && (
            <button onClick={() => handleDownloadAPK()}
              className="btn-emerald text-xs px-3 py-1.5">
              <Download size={14} /> Download {buildType === "bundle" ? "AAB" : "APK"}
            </button>
          )}
        </div>
      )}

      {/* Build Logs Terminal */}
      {(isBuilding || currentBuild) && (
        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Terminal size={12} className="text-blue-500" /> Build Log
            </span>
            <span className="text-xs text-gray-400">{buildLogs.length}/{BUILD_SIMULATION_LOGS.length}</span>
          </div>
          <div className="bg-gray-900 border border-gray-200 rounded-2xl p-3 max-h-52 overflow-y-auto code-font text-xs space-y-0.5 shadow-inner">
            <div className="text-gray-500 mb-1">$ gradle build --project-dir {project.packageName}</div>
            {buildLogs.map((log, i) => (
              <div key={i} className={cn("leading-5",
                log.includes("[SUCCESS]") ? "text-emerald-400" :
                log.includes("[ERROR]") ? "text-rose-400" :
                log.includes("[WARNING]") ? "text-amber-400" : "text-gray-400")}>
                {log}
              </div>
            ))}
            {isBuilding && (
              <div className="text-blue-400 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> processing...
              </div>
            )}
          </div>
        </div>
      )}

      {/* EAS Config Files */}
      <div className="mx-4 mt-4">
        <button onClick={() => setShowConfig(!showConfig)}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-700 p-3 bg-white border border-blue-100 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
          <span className="flex items-center gap-2"><Settings size={12} className="text-blue-500" /> EAS / CI Config Files</span>
          {showConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showConfig && (
          <div className="mt-2 space-y-3">
            {[
              { id: "eas-json", label: "eas.json", content: EAS_CONFIG, lang: "json" },
              { id: "gh-workflow", label: ".github/workflows/build.yml", content: GITHUB_WORKFLOW, lang: "yaml" },
            ].map(cfg => (
              <div key={cfg.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <span className="text-xs font-mono text-gray-600">{cfg.label}</span>
                  <button onClick={() => handleCopyConfig(cfg.content, cfg.id)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    {copiedConfig === cfg.id ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <pre className="p-3 text-xs font-mono text-gray-600 overflow-x-auto max-h-40 overflow-y-auto leading-5">{cfg.content}</pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Build History */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Clock size={12} className="text-gray-500" /> Build History
        </h4>
        {previousBuilds.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Package size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">No builds yet. Click "Build APK" to start.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {previousBuilds.map(build => (
              <div key={build.id} className="glass-crystal border border-blue-100/50 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                {build.status === "success" ? <CheckCircle size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-rose-600 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 font-mono font-semibold">#{build.id.slice(-6)}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(build.startedAt)} · {build.size || "—"}</p>
                </div>
                {build.status === "success" && (
                  <button onClick={() => handleDownloadAPK(build)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 font-semibold transition-colors">
                    <Download size={12} /> APK
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deployment Wizards */}
      <div className="p-4 pt-0">
        <h4 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Globe size={12} className="text-blue-500" /> Deployment Wizards
        </h4>
        <div className="space-y-2">
          {DEPLOY_WIZARDS.map(wizard => (
            <div key={wizard.id} className="glass-crystal border border-blue-100/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <button onClick={() => setActiveWizard(activeWizard === wizard.id ? null : wizard.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/50 transition-colors">
                <span className="text-2xl shrink-0">{wizard.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">{wizard.name}</p>
                  <p className="text-xs text-gray-500 truncate">{wizard.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={wizard.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                    <ExternalLink size={12} />
                  </a>
                  {activeWizard === wizard.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </div>
              </button>
              {activeWizard === wizard.id && (
                <div className="border-t border-blue-50 bg-gray-50/80 p-3">
                  <p className="text-xs text-gray-600 mb-2 font-bold">Step-by-step setup:</p>
                  <div className="space-y-1">
                    {wizard.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        {!step.startsWith("#") && <span className="text-gray-400 text-xs shrink-0 mt-0.5">{i + 1}.</span>}
                        <code className={cn("text-xs font-mono leading-5", step.startsWith("#") ? "text-emerald-600 pl-4" : "text-gray-600")}>
                          {step}
                        </code>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleCopyConfig(wizard.steps.filter(s => !s.startsWith("#")).join("\n"), wizard.id)}
                    className="mt-3 text-xs px-3 py-1.5 bg-white hover:bg-blue-50 border border-blue-200 text-blue-600 rounded-xl transition-colors font-semibold">
                    {copiedConfig === wizard.id ? "✓ Copied" : "Copy Commands"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildPanel;
