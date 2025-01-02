import { Link, redirect } from "react-router";
import BaseError from "../components/BaseError";
import MainHeader from "../components/Header/MainHeader";
import Footer from "../components/Footer";
import { useAuthContext } from "../store/auth-context";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LogoutError() {
  const { login } = useAuthContext();

  const notified = useRef(false);

  useEffect(() => {
    if (!notified.current) {
      toast.error("Ops! You were not logged out. Please, try again later.");
      notified.current = true;
    }

    login();
  }, [login]);

  return (
    <>
      <MainHeader />
      <BaseError title="Ops! We couldn't logout you.">
        <p>
          Something unexpected occurred. We will work on it, you can get back to
          the{" "}
          <Link to="/" className="text-[#AB886D]">
            home page
          </Link>
          ! Please, try again later.
        </p>
      </BaseError>
      <Footer />
    </>
  );
}

export async function action() {
  try {
    const response = await fetch("http://localhost:8000/accounts/api/logout/", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Something went wrong while logging out.");
    }

    return redirect("/");
  } catch {
    throw new Error("An unexpected error occurred. Please, try again later.");
  }
}
