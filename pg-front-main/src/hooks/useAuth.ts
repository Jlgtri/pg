import { useState } from "react";
// import { endpoints } from "../api/endpoints";
// import axios from "axios";
import { useAppState } from "@/context/AppStateContext";
// import { useToast } from "@/providers/ToastProvider";

// Minimal return type for components that rely on this hook
interface UseAuthReturn {
  login: () => void;
  isLoggingIn: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setConnectionStatus } = useAppState();

  const login = async () => {
    if (isLoggingIn) return;

    // reset previous error before starting a new attempt
    setError(null);
    setIsLoggingIn(true);
    setIsAuthenticated(true);
    setConnectionStatus("twitter_connected");
    setIsLoggingIn(false);
  };

  return {
    login,
    isLoggingIn,
    isAuthenticated,
    error,
  };
};
