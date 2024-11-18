import { Divider } from "@mui/material";

import { openGoogleLoginPage } from "../utils/helpers";

import SocialIcon from "../components/SocialIcon";

export default function SocialLogin() {
  return (
    <>
      <Divider>Or sign up with</Divider>
      <ul className="mt-6 flex items-center justify-center gap-12">
        <SocialIcon onClick={openGoogleLoginPage}>
          <ion-icon name="logo-google"></ion-icon>
        </SocialIcon>
        <SocialIcon>
          <ion-icon name="logo-github"></ion-icon>
        </SocialIcon>
      </ul>
    </>
  );
}
