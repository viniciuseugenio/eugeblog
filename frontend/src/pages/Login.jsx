import {
  Form,
  json,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useLocation,
} from "react-router-dom";
import { toast } from "sonner";
import logoImg from "../assets/eu-icon.svg";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import SocialLogin from "../components/SocialLogin";
import { useEffect, useRef } from "react";

export default function LoginPage() {
  const data = useActionData();
  const navigation = useNavigation();
  const location = useLocation();
  const errorNotified = useRef(false);

  useEffect(() => {
    if (errorNotified.current) return;

    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get("error");
    const errorMessage = {
      access_denied:
        "You have denied access to your account. Please, try again.",
      email_fetching:
        "An error occurred while fetching your e-mail. Please, try again.",
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
        <Form method="POST">
          {data && data.error && (
            <div className="mb-4 text-center">
              <p className="text-red-500">{data.error}</p>
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
          <PrimaryButton text="Login" state={navigation.state} />
          <div className="mb-6 mt-3">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link to="/signup" className="text-primary underline">
              Sign up
            </Link>
          </div>
        </Form>
        <SocialLogin page="login" />
      </div>
    </div>
  );
}

export async function loader() {
  const response = await fetch(
    "http://localhost:8000/accounts/api/verify-user/",
    {
      credentials: "include",
    },
  );
  const data = await response.json();

  if (data.authenticated) {
    return redirect("/");
  }

  return data.authenticated;
}

export async function action({ request }) {
  const currentUrl = new URL(request.url);
  const nextPage = currentUrl.searchParams.get("next") || "/";

  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  try {
    const response = await fetch("http://localhost:8000/accounts/api/login/", {
      method: "POST",
      body: JSON.stringify({ email, password, remember }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = {
        400: data.error || "Please provide both email and password.",
        401: "The e-mail and password you provided did not match any of our records. Please, try again.",
        500: "An error occurred. Please, try again.",
      };
      console.log(response.status);

      return json(
        {
          error:
            errorMessage[response.status] ||
            "An error occurred. Please, try again.",
        },
        { status: response.status },
      );
    }

    toast.success("Logged in successfully.");
    return redirect(nextPage);
  } catch {
    return json(
      { error: "An error occurred. Please, try again." },
      { status: 500 },
    );
  }
}
