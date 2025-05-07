
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

interface LoginHistory {
  email: string;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  loginHistory: LoginHistory[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load login history
    const storedHistory = localStorage.getItem("loginHistory");
    if (storedHistory) {
      setLoginHistory(JSON.parse(storedHistory));
    }
    
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    // Remove password for security when storing in context
    const { password, ...safeUserData } = userData;
    setUser(safeUserData as User);
    
    // Store in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(safeUserData));
    
    // Add to login history
    const newHistoryItem = {
      email: userData.email,
      timestamp: Date.now()
    };
    
    const updatedHistory = [...loginHistory, newHistoryItem];
    setLoginHistory(updatedHistory);
    localStorage.setItem("loginHistory", JSON.stringify(updatedHistory));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
