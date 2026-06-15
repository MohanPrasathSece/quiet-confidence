import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGetMe, clearToken, saveToken, type SafeUser } from "@/lib/authApi";

// ─── Types ─────────────────────────────────────────────────────────

interface AuthContextValue {
  user: SafeUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: SafeUser) => void;
  logout: () => void;
}

// ─── Context ───────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

// ─── Provider ──────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    apiGetMe()
      .then((me) => {
        if (me) {
          setUser(me);
          setToken(localStorage.getItem("atlasledger_token"));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = (newToken: string, newUser: SafeUser) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}
