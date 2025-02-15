import { Link, useLocation } from "react-router";
import { MailCheck } from "lucide-react";

export default function PasswordResetSentPage() {
  const location = useLocation();
  const { email } = location.state || "";

  return (
    <main className="flex flex-grow items-center justify-center">
      <section className="max-w-[27rem] p-12 text-center">
        <header>
          <p
            className="password-icon bg-accent/30 text-primary mb-6 inline-flex rounded-full p-4 text-5xl"
            aria-label="Mail icon"
          >
            <MailCheck size={42} />
          </p>
          <h1 className="mb-3 text-4xl font-semibold">Check your e-mail</h1>
        </header>

        <article>
          <p className="mb-6 font-medium text-neutral-600">
            We sent you a password reset link to <strong>{email}</strong>.
          </p>
          <Link
            to="https://mail.google.com/"
            target="_blank"
            className="bg-primary mb-8 block w-full rounded-md px-1.5 py-2.5 text-white"
          >
            Open e-mail app
          </Link>
          <p className="mb-6 text-neutral-600">
            Didn&apos;t receive the e-mail?{" "}
            <Link className="text-link hover:text-secondary duration-300">
              Click to resend
            </Link>
          </p>
        </article>
        <footer>
          <Link
            to="/login"
            className="hover:text-secondary text-link font-medium duration-300"
          >
            &larr; Back to login
          </Link>
        </footer>
      </section>
    </main>
  );
}
