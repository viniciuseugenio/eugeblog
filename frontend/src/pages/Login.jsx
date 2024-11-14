import { Divider } from "@mui/material";
import { useEffect } from "react";
import {
  Form,
  json,
  Link,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { toast } from "sonner";
import logoImg from "../assets/eu-icon.svg";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import SocialIcon from "../components/SocialIcon";
import { useAuth } from "../store/auth-context";

export default function LoginPage() {
  const data = useActionData();
  const { isLogged } = useAuth();
  const navigate = useNavigate();
  const navigation = useNavigation();

  useEffect(() => {
    if (data) {
      toast.error(data.error);
    }

    if (isLogged) {
      return navigate("/");
    }
  }, [isLogged, navigate, data]);

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
        <Divider>Or sign in with</Divider>
        <ul className="mt-6 flex items-center justify-center gap-12">
          <SocialIcon>
            <ion-icon name="logo-google"></ion-icon>
          </SocialIcon>
          <SocialIcon>
            <ion-icon name="logo-github"></ion-icon>
          </SocialIcon>
        </ul>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  if (!email || !password) {
    return json(
      { message: "Please provide both email and password." },
      { status: 400 },
    );
  }

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

      return json(
        {
          error:
            data.error ||
            "The e-mail and password you provided did not match any of our records. Please, try again.",
        },
        { status: response.status },
      );
    }

    return redirect("/");
  } catch {
    return json(
      { error: "An error occurred. Please, try again." },
      { status: 500 },
    );
  }
}
