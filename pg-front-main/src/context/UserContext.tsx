import { createContext, useContext } from "react";
import type { User } from "@/api/types";

export const initialUser: User = {
  twitterPostChecked: false,
  totalToClaim: 0,
};

export interface UserContextType {
  user: User;
  setUser: (updates: Partial<User>) => void;
  resetUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside a UserProvider");
  return ctx;
};
