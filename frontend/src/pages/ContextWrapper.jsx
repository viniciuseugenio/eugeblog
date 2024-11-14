import { Outlet, useLoaderData } from "react-router-dom";
import AuthContextProvider from "../store/auth-context";

export default function ContextWrapper() {
  const isAuthenticated = useLoaderData();

  return (
    <AuthContextProvider initialAuthState={isAuthenticated}>
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
