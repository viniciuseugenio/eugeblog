import { Outlet } from "react-router";
import { Toaster } from "sonner";
import AuthContextProvider from "../store/auth-context";

export default function ContextWrapper() {
  return (
    <AuthContextProvider>
      <Toaster position="top-right" closeButton richColors duration={10000} />
      <Outlet />
    </AuthContextProvider>
  );
}
