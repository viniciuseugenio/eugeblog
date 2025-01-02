import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isLogged: false,
  userId: null,
  login: () => {},
  logout: () => {},
});

export default function AuthContextProvider({ children, initialAuthState }) {
  const [userId, setUserId] = useState(initialAuthState?.userId || null);
  const isLogged = !!userId;

  useEffect(() => {
    setUserId(initialAuthState?.userId);
  }, [initialAuthState]);

  function login(userId) {
    setUserId(userId);
  }

  function logout() {
    setUserId(null);
  }

  const authContext = {
    isLogged,
    userId,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
