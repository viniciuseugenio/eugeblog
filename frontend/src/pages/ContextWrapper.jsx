import { Outlet, useLoaderData } from "react-router-dom";
import { Toaster } from "sonner";
import AuthContextProvider from "../store/auth-context";

export default function ContextWrapper() {
  const isAuthenticated = useLoaderData();

  return (
    <AuthContextProvider initialAuthState={isAuthenticated}>
      <Toaster position="top-right" closeButton richColors duration={3000} />
      <Outlet />
    </AuthContextProvider>
  );
}

export async function loader() {
  const response = await fetch(
    "http://localhost:8000/accounts/api/verify-user/",
    {
      credentials: "include",
    },
  );

  const data = await response.json();
  return data.authenticated;
}
