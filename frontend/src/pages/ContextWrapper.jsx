import { Outlet } from "react-router";
import { Toaster } from "sonner";
import AuthContextProvider from "../store/auth-context";
import { useNotifyLoginSuccess, useAuthCheck } from "../utils/hooks";

export default function ContextWrapper() {
  useNotifyLoginSuccess();
  const { data } = useAuthCheck();

  const initialState = {
    isAuthenticated: data?.isAuthenticated,
    userId: data?.userId,
  };

  return (
    <AuthContextProvider initialAuthState={initialState}>
      <Toaster position="top-right" closeButton richColors duration={10000} />
      <Outlet />
    </AuthContextProvider>
  );
}
