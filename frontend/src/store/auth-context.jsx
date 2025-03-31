import { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_USER = {
  isAuthenticated: null,
  id: null,
  firstName: null,
  lastName: null,
};

const AuthContext = createContext({
  isLogged: false,
  user: DEFAULT_USER,
  setUserData: () => {},
});

export default function AuthContextProvider({ children, initialAuthState }) {
  const [user, setUser] = useState(initialAuthState);
  const isLogged = user?.isAuthenticated || false;

  useEffect(() => {
    setUser(initialAuthState);
  }, [initialAuthState]);

  function setUserData(userData) {
    setUser(userData);
  }

  const authContext = {
    isLogged,
    user,
    setUserData,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
