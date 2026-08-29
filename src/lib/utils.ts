import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateString);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ready: "text-[#3FB950] bg-[#3FB950]/10 border-[#3FB950]/30",
    building: "text-[#D29922] bg-[#D29922]/10 border-[#D29922]/30",
    draft: "text-[#8B949E] bg-[#8B949E]/10 border-[#8B949E]/30",
    published: "text-[#58A6FF] bg-[#58A6FF]/10 border-[#58A6FF]/30",
    failed: "text-[#F85149] bg-[#F85149]/10 border-[#F85149]/30",
    success: "text-[#3FB950] bg-[#3FB950]/10 border-[#3FB950]/30",
  };
  return map[status] || map.draft;
}

export function getTypeColor(type: string): string {
  const map: Record<string, string> = {
    kotlin: "text-[#BC8CFF] bg-[#BC8CFF]/10",
    java: "text-[#FFA657] bg-[#FFA657]/10",
    'react-native': "text-[#58A6FF] bg-[#58A6FF]/10",
    android: "text-[#3FB950] bg-[#3FB950]/10",
  };
  return map[type] || "text-[#8B949E] bg-[#8B949E]/10";
}

export function getTypeBadge(type: string): string {
  const map: Record<string, string> = {
    kotlin: 'K',
    java: 'J',
    'react-native': 'RN',
    android: 'A',
  };
  return map[type] || '?';
}
