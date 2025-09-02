import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../components/auth/api";

const CompanyContext = createContext(undefined);

export function CompanyProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();

  const fetchedRef = useRef(false);

  const getMembers = async (companyId) => {
    if (!companyId) return;
    try {
      setIsLoading(true);
      const response = await API.get(`/Users/company/${companyId}`);
      setMembers(response.data);
    } catch (err) {
      console.error(
        "Failed to fetch company members:",
        err.response?.data || err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "employee" && user?.companyId && !fetchedRef.current) {
      fetchedRef.current = true;
      getMembers(user.companyId);
    }
  }, [role, user]);

  return (
    <CompanyContext.Provider value={{ members, isLoading, getMembers }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
