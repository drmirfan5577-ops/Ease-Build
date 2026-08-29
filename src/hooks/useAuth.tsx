import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser } from "@/types";
import { supabase } from "@/lib/supabase";
import {
  mapSupabaseUser,
  setLocalUser,
  clearLocalUser,
  getLocalUser,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (u: AuthUser) => {
    setUser(u);
    setLocalUser(u);
  };

  const logout = () => {
    setUser(null);
    clearLocalUser();
  };

  useEffect(() => {
    let mounted = true;

    // Safety #1: Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        const u = mapSupabaseUser(session.user);
        login(u);
      }
      if (mounted) setLoading(false);
    });

    // Safety #2: Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        const u = mapSupabaseUser(session.user);
        login(u);
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        logout();
        setLoading(false);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        login(mapSupabaseUser(session.user));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
