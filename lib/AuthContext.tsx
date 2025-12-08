"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load user dari localStorage saat mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Login gagal");
    }

    const data = await response.json();

    console.log("Login response:", data);

    // Simpan token ke localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Set cookie untuk middleware dengan SameSite
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `token=${data.token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    console.log("Cookie set, token:", data.token.substring(0, 20) + "...");

    setToken(data.token);
    setUser(data.user);

    // Delay sedikit untuk memastikan cookie ter-set
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Hard redirect untuk memastikan cookie ter-set
    console.log("Redirecting to:", data.user.role === "ADMIN" ? "/admin" : "/home");
    if (data.user.role === "ADMIN") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/home";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Hapus cookie
    document.cookie = "token=; path=/; max-age=0";

    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
