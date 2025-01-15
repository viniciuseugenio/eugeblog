import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import horizontalLogo from "../assets/eugeblog-hori.svg";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import SocialLogin from "../components/SocialLogin";
import { useAuthCheck } from "../utils/hooks";
import { signUser } from "../utils/http";

export default function SignupPage() {
  const navigate = useNavigate();

  const { data: authData } = useAuthCheck();

  useEffect(() => {
    if (authData?.isAuthenticated) {
      navigate("/");
    }
  }, [authData, navigate]);

  const { mutate, data, isPending } = useMutation({
    mutationFn: signUser,
    onSuccess: (data) => {
      if (!data.errors) {
        toast.success("Sign-up successful! Please log in to continue.", {
          id: "signup-success",
        });
        navigate("/login");
      }
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const form = {
      email: formData.get("email"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
      agree: formData.get("agree"),
    };

    mutate(form);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex h-4/6 w-2/6 flex-col items-center justify-center p-14 shadow-2xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-1">
          <h1 className="text-2xl font-medium">Get started with</h1>
          <img src={horizontalLogo} className="w-48" alt="" />
        </Link>

        <form
          method="POST"
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-2 gap-x-3"
        >
          <Input
            type="email"
            id="id_email"
            name="email"
            label="E-mail"
            className="col-span-2"
            error={data?.errors?.email}
          />
          <Input
            type="text"
            id="id_first_name"
            name="first_name"
            label="First name"
            error={data?.errors?.first_name}
          />
          <Input
            type="text"
            id="id_last_name"
            name="last_name"
            label="Last name"
            error={data?.errors?.last_name}
          />
          <Input
            type="password"
            id="id_password"
            name="password"
            label="Password"
            error={data?.errors?.password}
          />
          <Input
            type="password"
            id="id_confirm_password"
            name="confirm_password"
            label="Confirm password"
            error={data?.errors?.confirm_password}
          />

          <div className="col-span-2 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agree"
                id="id_agree"
                className="accent-primary mr-1"
                required
              />
              <span>I agree with the</span>
              <Link
                to="/privacy-policy"
                className="text-primary ml-1 underline"
              >
                terms and conditions
              </Link>
            </label>
            {data?.errors?.agree && (
              <span className="text-red-600">{data.errors.agree}</span>
            )}
          </div>

          <PrimaryButton
            text="Sign Up"
            className="col-span-2"
            isPending={isPending}
          />

          <p className="mt-3">
            Don&apos;t have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Log in
            </Link>
          </p>
        </form>
        <SocialLogin page="sign up" />
      </div>
    </div>
  );
}
