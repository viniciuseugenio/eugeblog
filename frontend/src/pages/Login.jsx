import { Link } from "react-router-dom";
import Input from "../components/Input";
import logoImg from "../assets/eu-icon.svg";
import { Divider } from "@mui/material";
import SocialIcon from "../components/SocialIcon";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-3/12 px-16 py-16 shadow-2xl">
        <Link to="/" className="mb-5 flex flex-col items-center justify-center">
          <img src={logoImg} alt="" className="mb-3 h-20" />
          <h1 className="text-2xl font-bold">
            Welcome to <span className="text-primary">Eugeblog</span>!
          </h1>
        </Link>
        <form action="">
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
          <button className="font-inherit bg-primary w-full rounded-md py-1 text-lg text-white duration-300 hover:bg-[#3a2b20]">
            Login
          </button>
          <div className="mb-6 mt-3">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link to="/register" className="text-primary underline">
              Register
            </Link>
          </div>
        </form>
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
