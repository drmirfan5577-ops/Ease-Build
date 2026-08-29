import { AuthUser } from "@/types";
import { supabase } from "@/lib/supabase";

// Map Supabase user to AuthUser - must be synchronous
export function mapSupabaseUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    username:
      user.user_metadata?.username ||
      user.user_metadata?.full_name ||
      user.email!.split("@")[0],
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    role: user.user_metadata?.role || "developer",
    plan: user.user_metadata?.plan || "free",
  };
}

const USER_KEY = "esmart_user";
export function setLocalUser(user: AuthUser) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
export function getLocalUser(): AuthUser | null { const s = localStorage.getItem(USER_KEY); return s ? JSON.parse(s) : null; }
export function clearLocalUser() { localStorage.removeItem(USER_KEY); }

export async function sendOtp(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifyOtpAndSetPassword(email: string, token: string, password: string, username: string) {
  const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (verifyError) throw verifyError;
  const { data, error: updateError } = await supabase.auth.updateUser({ password, data: { username, role: "developer", plan: "free" } });
  if (updateError) throw updateError;
  return data.user;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
      queryParams: { access_type: "offline", prompt: "consent" },
      skipBrowserRedirect: false,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  clearLocalUser();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function isAdmin(): boolean {
  const u = getLocalUser();
  return u?.role === "admin" || u?.email === "admin@esmartworld.com";
}

export function getCurrentUser(): AuthUser | null { return getLocalUser(); }
export function getAllUsers(): AuthUser[] {
  return [{ id: "user_admin", email: "admin@esmartworld.com", username: "Dr. Irfan", role: "admin", plan: "enterprise" }];
}
