import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import logoImg from "../assets/eu-icon.svg";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import SocialLogin from "../components/SocialLogin";
import { signUser } from "../utils/api";
import { useAuthCheck } from "../utils/hooks";
import {
  validateConfirmPassword,
  validateEmail,
  validateLastName,
  validateSignupData,
} from "../utils/validators";

export default function SignupPage() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [clientSide, setClientSide] = useState({ errors: {} });

  const { data: authData } = useAuthCheck();

  useEffect(() => {
    if (authData && authData?.isAuthenticated) {
      navigate("/");
    }
  }, [authData, navigate]);

  const {
    mutate,
    data: serverSide,
    isPending,
  } = useMutation({
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

    if (clientSide.errors && Object.keys(clientSide.errors).length >= 1) {
      return;
    }

    const formData = new FormData(event.target);

    const form = {
      email: formData.get("email"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
      agree: formData.get("agree"),
    };

    const errors = validateSignupData(form);
    setClientSide((prev) => ({ errors: { ...prev.errors, ...errors } }));

    if (Object.keys(errors).length > 0) return;
    mutate(form);
  }

  const getError = (fieldName) =>
    serverSide?.errors?.[fieldName] || clientSide.errors?.[fieldName];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="h-32 w-32">
            <img
              src={logoImg}
              height={128}
              width={128}
              alt="Eugeblog icon"
              className="p-2"
            />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-neutral-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Join our community and start sharing your stories
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-md">
        <div className="rounded-lg bg-white px-10 py-8 shadow">
          <form
            ref={formRef}
            method="POST"
            onSubmit={handleSubmit}
            className="mb-6 grid grid-cols-2 gap-x-3 gap-y-6"
          >
            <Input
              type="email"
              id="id_email"
              name="email"
              label="E-mail"
              className="col-span-2"
              error={getError("email")}
              setClientSide={setClientSide}
              fieldValidation={validateEmail}
            />

            <Input
              type="text"
              id="id_first_name"
              name="first_name"
              label="First name"
              error={getError("first_name")}
              setClientSide={setClientSide}
            />

            <Input
              type="text"
              id="id_last_name"
              name="last_name"
              label="Last name"
              error={getError("last_name")}
              setClientSide={setClientSide}
              fieldValidation={(value, setClientSide) =>
                validateLastName(formRef.current, value, setClientSide)
              }
            />

            <Input
              type="password"
              id="id_password"
              name="password"
              label="Password"
              className="col-span-2"
              error={getError("password")}
              setClientSide={setClientSide}
            />

            <Input
              type="password"
              id="id_confirm_password"
              name="confirm_password"
              label="Confirm password"
              className="col-span-2"
              error={getError("confirm_password")}
              setClientSide={setClientSide}
              fieldValidation={(value, setClientSide) =>
                validateConfirmPassword(formRef.current, value, setClientSide)
              }
            />

            <div className="col-span-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  name="agree"
                  id="id_agree"
                  className="accent-primary mr-1"
                  required
                />
                <span>
                  I agree with the
                  <Link
                    to="/privacy-policy"
                    className="text-link hover:text-secondary ml-1 duration-300 ease-out"
                  >
                    terms and conditions
                  </Link>
                </span>
              </label>
              {getError("agree") && (
                <span className="text-red-600">{getError("agree")}</span>
              )}
            </div>

            <PrimaryButton
              text="Sign Up"
              className="col-span-2"
              isPending={isPending}
            />
          </form>

          <div className="mt-6">
            <SocialLogin page="sign up" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-link hover:text-secondary duration-300 ease-out"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
