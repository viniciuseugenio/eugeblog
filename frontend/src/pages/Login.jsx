import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import logoImg from "../assets/eu-icon.svg";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import SocialLogin from "../components/SocialLogin";
import { useAuthContext } from "../store/auth-context";
import { useAuthCheck, useSocialErrorDisplay } from "../utils/hooks";
import { loginUser, queryClient } from "../utils/http";

export default function LoginPage() {
  useSocialErrorDisplay();

  const navigate = useNavigate();
  const { login: loginContext } = useAuthContext();
  const { data: authData } = useAuthCheck();

  useEffect(() => {
    if (authData?.isAuthenticated) {
      navigate("/");
    }
  }, [authData?.isAuthenticated, navigate]);

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

    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      toast.error("Please, fill in the e-mail and the password fields.", {
        id: "login-error",
      });
      return;
    }

    login(data);
  }

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
            <Link
              className="hover:text-secondary text-link underline decoration-inherit duration-300 ease-out"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <PrimaryButton type="submit" text="Log In" isPending={isPending} />
          <div className="mb-6 mt-3">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link
              to="/signup"
              className="hover:text-secondary text-link underline decoration-inherit duration-300 ease-out"
            >
              Sign up
            </Link>
          </div>
        </form>
        <SocialLogin page="login" />
      </div>
    </div>
  );
}
