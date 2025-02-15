import { Divider } from "@mui/material";
import SocialIcon from "../components/SocialIcon";
import { openGoogleLoginPage } from "../utils/helpers";
import Github from "/social_icons/github-icon.svg";
import Google from "/social_icons/google-icon.svg";

const { VITE_GITHUB_CLIENT_ID } = import.meta.env;

export default function SocialLogin({ page }) {
  function openGitLoginPage() {
    const next = new URLSearchParams(window.location.search).get("next");
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${VITE_GITHUB_CLIENT_ID}`;

    const fullRedirectUrl = next ? `${redirectUrl}&state=${next}` : redirectUrl;
    window.location = fullRedirectUrl;
  }

  const iconClass =
    "w-11 rounded-lg bg-stone-200 p-2 duration-300 hover:bg-stone-300 active:bg-stone-400";

  return (
    <>
      <Divider>Or {page} with</Divider>
      <ul className="mt-6 flex items-center justify-center gap-6">
        <SocialIcon onClick={openGoogleLoginPage}>
          <img src={Google} className={iconClass} alt="Google" />
        </SocialIcon>
        <SocialIcon onClick={openGitLoginPage}>
          <img src={Github} className={iconClass} alt="GitHub" />
        </SocialIcon>
      </ul>
    </>
  );
}
