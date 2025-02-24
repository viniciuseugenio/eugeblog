import { Divider } from "@mui/material";
import SocialIcon from "../components/SocialIcon";
import { openGitLoginPage, openGoogleLoginPage } from "../utils/api/helpers";
import Github from "/social_icons/github-icon.svg";
import Google from "/social_icons/google-icon.svg";

export default function SocialLogin({ page }) {
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
