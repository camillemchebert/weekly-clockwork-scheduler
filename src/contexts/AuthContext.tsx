
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // In a real app, this would validate against a backend
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple validation - in a real app this would check with a backend
    if (password === "password") {
      // Determine if user is admin (for demonstration purposes)
      const role = username.toLowerCase() === "admin" ? "admin" : "user";
      setUser({ username, role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
