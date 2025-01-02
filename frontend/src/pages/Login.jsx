import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import logoImg from "../assets/eu-icon.svg";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import SocialLogin from "../components/SocialLogin";
import { useAuthContext } from "../store/auth-context";
import { useAuthCheck } from "../utils/hooks";
import { loginUser } from "../utils/http";
import { queryClient } from "../utils/http";

export default function LoginPage() {
  const location = useLocation();
  const errorNotified = useRef(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuthContext();

  const { data: authData } = useAuthCheck();

  useEffect(() => {
    if (authData?.isAuthenticated) {
      navigate("/");
    }
  }, [authData, navigate]);

  const {
    mutate: login,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data.detail);
      loginContext(data.user_id);
      queryClient.invalidateQueries(["auth"]);
      navigate("/");
    },
  });

  function handleLoginSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    login(data);
  }

  useEffect(() => {
    if (errorNotified.current) return;

    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get("error");
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
      );
      errorNotified.current = true;
    }
  }, [location]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-3/12 p-16 shadow-2xl">
        <Link to="/" className="mb-5 flex flex-col items-center justify-center">
          <img src={logoImg} alt="" className="mb-3 h-20" />
          <h1 className="text-2xl font-bold">
            Welcome to <span className="text-primary">Eugeblog</span>!
          </h1>
        </Link>
        <form method="POST" onSubmit={handleLoginSubmit}>
          {isError && (
            <div className="mb-4 text-center">
              <p className="text-red-500">{error.message}</p>
            </div>
          )}
          <Input type="email" name="email" id="id_email" label="E-mail" />
          <Input
            type="password"
            name="password"
            id="id_password"
            label="Password"
          />

          <div className="mb-3 flex justify-between">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  id="id_remember"
                  className="accent-primary mr-1"
                />
                Remember me
              </label>
            </div>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <PrimaryButton type="submit" text="Login" isPending={isPending} />
          <div className="mb-6 mt-3">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link to="/signup" className="text-primary underline">
              Sign up
            </Link>
          </div>
        </form>
        <SocialLogin page="login" />
      </div>
    </div>
  );
}
