import { createContext, useContext } from "react";
import {
  useAuthUser,
  useCurrentUser,
  useIsAuthenticated,
  useLogin,
  useLogout,
} from "../hooks/useAuth";

interface AuthContextType {
  user: ReturnType<typeof useCurrentUser>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: ReturnType<typeof useLogin>;
  logout: ReturnType<typeof useLogout>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({ children }) {
  const { isLoading } = useAuthUser();
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const authContext = {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation,
    logout: logoutMutation,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
}
