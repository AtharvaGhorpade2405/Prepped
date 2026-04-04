import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to read URL params (vanilla JS works fine here too)
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  useEffect(() => {
    async function initAuth() {
      let token = localStorage.getItem("auth_token");

      // 1. Check if we just came back from Google with a new token
      const urlToken = getTokenFromUrl();
      if (urlToken) {
        token = urlToken;
        localStorage.setItem("auth_token", token);
        
        // Clean the URL (remove the token so it doesn't look messy)
        window.history.replaceState({}, document.title, "/dashboard");
      }

      if (!token) {
        setLoading(false);
        return;
      }

      // 2. Fetch User using the Token
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          method: "GET",
          headers: {
            // 🚨 THIS IS THE KEY CHANGE
            // We send the token explicitly. No cookies needed.
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token invalid/expired
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth failed", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
