import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import AuthContextProvider from "../store/auth-context";

export default function ContextWrapper() {
  const { authenticated, user_id: userId } = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();

  const notified = useRef(false);

  useEffect(() => {
    if (notified.current) return;

    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get("action");
    const provider = queryParams.get("provider");

    if (action && provider) {
      if (action === "login") {
        toast.success(`You have successfully logged in with ${provider}!`);
      } else if (action === "signup") {
        toast.success(`You have successfully signed up with ${provider}!`);
      }
      notified.current = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <AuthContextProvider initialAuthState={{ authenticated, userId }}>
      <Toaster position="top-right" closeButton richColors duration={10000} />
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
  return data;
}
