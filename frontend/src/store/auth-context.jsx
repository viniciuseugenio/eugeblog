import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isLogged: false,
  login: () => {},
  logout: () => {},
});

export default function AuthContextProvider({ children, initialAuthState }) {
  const [isLogged, setIsLogged] = useState(initialAuthState);

  useEffect(() => {
    setIsLogged(initialAuthState);
  }, [initialAuthState]);

  function login() {
    setIsLogged(true);
  }

  function logout() {
    setIsLogged(false);
  }

  const authContext = {
    isLogged,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
