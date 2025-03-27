import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import { requestPasswordReset } from "../utils/api";
import { Key } from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (_, variables) => {
      navigate("/password-reset-sent", { state: { email: variables } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    mutate(event.target.email.value);
  }

  return (
    <main className="flex flex-grow items-center justify-center">
      <section className="max-w-[30rem] p-12 text-center">
        <p
          aria-label="Password Icon"
          className="bg-accent/30 text-primary mb-6 inline-flex rounded-full p-4 text-5xl"
        >
          <Key size={42} />
        </p>
        <h1 id="password-reset-form" className="mb-3 text-4xl font-semibold">
          Forgot your password?
        </h1>
        <p className="font-medium text-neutral-700">
          No worries, we&apos;ll send instructions through your e-mail.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8"
          aria-labelledby="password-reset-form"
        >
          <Input
            type="email"
            name="email"
            id="id_email"
            label="E-mail address"
            aria-required="true"
            aria-label="Enter the e-mail address associated with your account."
          />

          <div className="flex flex-col items-center justify-center">
            <PrimaryButton
              disabled={isPending}
              label="Send e-mail"
              type="submit"
              className="mb-3 font-medium"
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
