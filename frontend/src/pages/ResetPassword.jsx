import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import { useAuthCheck } from "../utils/hooks";
import { resetPassword } from "../utils/http";

export default function PasswordResetPage() {
  const navigate = useNavigate();

  const { data: authData } = useAuthCheck();

  if (authData?.isAuthenticated) {
    navigate("/");
  }

  const { uid, token } = useParams();
  const [clientSideErrors, setClientSideErrors] = useState([]);

  const { mutate, data, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (!data.errors) {
        toast.success(data.detail);
        navigate("/login");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    setClientSideErrors([]);

    const formData = new FormData(event.target);
    const password = formData.get("password");
    const confirm_password = formData.get("confirm_password");

    if (!password || !confirm_password) {
      setClientSideErrors((prev) => [...prev, "Please fill in both fields."]);
      return;
    }

    if (password !== confirm_password) {
      setClientSideErrors((prev) => [...prev, "Passwords do not match."]);
      return;
    }

    if (password.length < 9) {
      setClientSideErrors((prev) => [
        ...prev,
        "Password must be at least 9 characters long.",
      ]);
      return;
    }

    mutate({
      uid,
      token,
      formData: { password, confirm_password },
    });
  }

  const errors = [...clientSideErrors, ...(data?.errors || [])];
  const isError = data?.errors || clientSideErrors === 0;

  return (
    <main className="flex flex-grow items-center justify-center">
      <section className="max-w-[30rem] p-12 text-center">
        <p
          aria-label="Password Icon"
          className="password-icon bg-accent/30 text-primary mb-6 inline-flex rounded-full p-3 text-5xl"
        >
          <ion-icon name="key-outline"></ion-icon>
        </p>
        <h1 className="mb-3 text-4xl font-semibold">Set new password</h1>
        <p className="font-medium text-neutral-700">
          Your new password must be different from the current password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <Input
            type="password"
            name="password"
            id="id_password"
            label="Password"
            aria-required="true"
            className="mb-6"
            isError={isError}
          />

          <Input
            type="password"
            name="confirm_password"
            id="id_confirm_password"
            label="Confirm password"
            aria-required="true"
            className={isError && "mb-3"}
            isError={isError}
          />

          {errors && (
            <ul className="mb-6 text-left text-red-600">
              {errors.map((error) => (
                <li key={error} className="mb-1">
                  {error}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col items-center justify-center">
            <PrimaryButton
              text="Reset password"
              type="submit"
              className="mb-3 font-medium"
              isPending={isPending}
            />

            <Link
              to="/login"
              className="hover:text-secondary rounded-lg py-2 font-medium text-[#785f4c] transition-all duration-300 ease-out"
              aria-label="Back to log in"
            >
              &larr; Back to log in
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
