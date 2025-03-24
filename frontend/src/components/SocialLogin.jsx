import { Divider } from "@mui/material";
import { openGitLoginPage, openGoogleLoginPage } from "../utils/api/helpers";
import Google from "/social_icons/google-icon.svg";
import SocialLoginButton from "./SocialLoginButton";
import { Github } from "lucide-react";

export default function SocialLogin({ page }) {
  const iconClass =
    "w-11 rounded-lg bg-stone-200 p-2 duration-300 hover:bg-stone-300 active:bg-stone-400";

  return (
    <>
      <Divider>
        <span className="text-neutral-500">or</span>
      </Divider>

      <ul className="mt-6 flex flex-col gap-6">
        <SocialLoginButton
          onClick={openGoogleLoginPage}
          icon={<img src={Google} className="h-6 w-6" alt="Google" />}
          site="Google"
        />
        <SocialLoginButton
          onClick={openGitLoginPage}
          icon={<Github className="h-6 w-6" />}
          site="GitHub"
        />
      </ul>
    </>
  );
}
