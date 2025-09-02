import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../components/auth/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setRole(null);
        return;
      }

      // Always attach token in API instance
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await API.get("/users/me");
      setUser(response.data);
      setRole(response.data.role);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      // 🔹 If token expired or invalid → logout
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserDetail();
  }, [getUserDetail]);

  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      await getUserDetail();
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
