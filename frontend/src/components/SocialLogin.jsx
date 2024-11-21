import { Divider } from "@mui/material";
import SocialIcon from "../components/SocialIcon";
import { openGoogleLoginPage } from "../utils/helpers";

const { VITE_GITHUB_CLIENT_ID } = import.meta.env;

export default function SocialLogin({ page }) {
  function openGitLoginPage() {
    const next = new URLSearchParams(window.location.search).get("next");
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${VITE_GITHUB_CLIENT_ID}`;

    const fullRedirectUrl = next ? `${redirectUrl}&state=${next}` : redirectUrl;
    window.location = fullRedirectUrl;
  }

  return (
    <>
      <Divider>Or {page} with</Divider>
      <ul className="mt-6 flex items-center justify-center gap-12">
        <SocialIcon onClick={openGoogleLoginPage}>
          <ion-icon name="logo-google"></ion-icon>
        </SocialIcon>
        <SocialIcon onClick={openGitLoginPage}>
          <ion-icon name="logo-github"></ion-icon>
        </SocialIcon>
      </ul>
    </>
  );
}
