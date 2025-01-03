import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../store/auth-context";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { performLogout, isUserAuthenticated, queryClient } from "./http";

export function useSocialErrorDisplay() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get("error");

  useEffect(() => {
    const errorMessage = {
      access_denied:
        "You have denied access to your account. Please, try again.",
      email_fetching:
        "An error occurred while fetching your e-mail. Please, try again.",
      access_token: "Failed to obtain access token from Google.",
    };

    if (error) {
      toast.error(
        errorMessage[error] || "An error occurred. Please, try again.",
        {
          id: "social-error",
        },
      );
    }
  }, [location, error]);
}

export function useNotifyLoginSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get("action");
    const provider = queryParams.get("provider");

    if (action && provider) {
      if (action === "login") {
        toast.success(`You have successfully logged in with ${provider}!`, {
          id: "social-login",
        });
      } else if (action === "signup") {
        toast.success(`You have successfully signed up with ${provider}!`, {
          id: "social-signup",
        });
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
}

export function useLogout() {
  const { logout: logoutContext } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: performLogout,
    onSuccess: () => {
      toast.warning("You logged out successfuly.", {
        id: "logout-message",
      });

      queryClient.invalidateQueries(["authCheck"]);
      logoutContext();
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useAuthCheck() {
  const { login, logout } = useAuthContext();

  return useQuery({
    queryFn: isUserAuthenticated,
    queryKey: ["authCheck"],
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      if (data.isAuthenticated) {
        login(data.userId);
      } else {
        logout();
      }
    },
  });
}
