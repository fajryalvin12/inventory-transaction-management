import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Decode JWT payload tanpa library tambahan
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? parseJwt(t) : null;
  });

  const signIn = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(parseJwt(newToken));
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Auto-logout kalau token expired
  useEffect(() => {
    if (!token) return;
    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      signOut();
      return;
    }

    const timer = setTimeout(signOut, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
