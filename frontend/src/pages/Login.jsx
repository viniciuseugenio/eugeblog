import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import logoImg from "../assets/eu-icon.svg";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import SocialLogin from "../components/SocialLogin";
import { useAuthContext } from "../store/auth-context";
import { useSocialErrorDisplay } from "../utils/hooks";

export default function LoginPage() {
  useSocialErrorDisplay();

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthContext();
  const { isPending, isError, error } = login;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    login.mutate(data);
  };

  const { register, handleSubmit } = useForm();

  return (
    <div className="flex min-h-screen flex-col justify-center py-12">
      <div className="mx-auto">
        <div className="flex justify-center">
          <div className="relative h-32 w-32">
            <img src={logoImg} width={128} height={128} />
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
          Welcome back!
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Sign in to your account to continue
        </p>
      </div>
      <div className="mx-auto mt-8 w-full max-w-md">
        <div className="rounded-md bg-white px-10 py-8 shadow">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* {isError && ( */}
            {/*   <div className="mb-6 text-center"> */}
            {/*     <p className="text-red-500">{error.message}</p> */}
            {/*   </div> */}
            {/* )} */}

            <div className="mb-6 flex flex-col gap-6">
              <Input
                register={register}
                type="email"
                isError={isError}
                name="email"
                id="id_email"
                label="E-mail"
              />

              <Input
                register={register}
                type="password"
                name="password"
                id="id_password"
                label="Password"
                isError={isError}
                error={error?.message && [error?.message]}
              />
            </div>

            <div className="mb-6 flex justify-between">
              <div>
                <label className="flex items-center text-sm">
                  <input
                    {...register("rememberMe")}
                    type="checkbox"
                    id="id_remember"
                    className="accent-primary mr-1"
                  />
                  Remember me
                </label>
              </div>
              <Link
                className="hover:text-secondary text-link text-sm decoration-inherit duration-300 ease-out"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <PrimaryButton type="submit" label="Log In" disabled={isPending} />
          </form>

          <div className="mt-6">
            <SocialLogin page="login" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="hover:text-primary text-link font-medium duration-300 ease-out"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
