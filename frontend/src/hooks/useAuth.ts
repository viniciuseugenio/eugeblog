import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, logout, verifyUser } from "../utils/api";
import { toast } from "sonner";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  permissions: string[];
}

interface AuthResponse {
  authenticated: boolean;
  user: User;
}

export function useAuthUser() {
  return useQuery<AuthResponse>({
    queryKey: ["user"],
    queryFn: verifyUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      rememberMe,
    }: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => loginUser(email, password, rememberMe),
    onSuccess: (data) => {
      toast.success(data.detail);
      queryClient.setQueryData<AuthResponse>(["user"], {
        authenticated: true,
        user: data.user,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("You have been logged out successfully");
      queryClient.setQueryData(["user"], null);
    },
    onError: () => {
      // Clean the cache even if the request fails
      toast.success("You have been logged out successfully");
      queryClient.setQueryData(["user"], null);
    },
  });
}

export function useIsAuthenticated() {
  const { data } = useAuthUser();
  return data?.authenticated ?? false;
}

export function useCurrentUser() {
  const { data } = useAuthUser();
  return data?.user ?? null;
}
