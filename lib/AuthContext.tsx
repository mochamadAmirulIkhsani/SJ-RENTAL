"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Check auth status on mount dan listen untuk changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (email: string) => {
    try {
      const { data, error } = await supabase.from("User").select("id, email, name, role").eq("email", email).single();

      if (data) {
        setUser({
          id: data.id.toString(),
          email: data.email,
          name: data.name,
          role: data.role,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Load user data dari database
    await loadUserData(email);

    // Get user role untuk redirect
    const { data: userData } = await supabase.from("User").select("role").eq("email", email).single();

    // Redirect based on role
    if (userData?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/home");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    router.push("/login");
  };

  return <AuthContext.Provider value={{ user, supabaseUser, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
