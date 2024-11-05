import SocialIcon from "./SocialIcon";
import FooterLink from "./FooterLink";

export default function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center justify-center bg-[#E4E0E1] py-5">
      <ul className="mb-3 flex gap-6">
        <SocialIcon link="https://github.com/viniciuseugenio">
          <ion-icon size="large" name="logo-github"></ion-icon>
        </SocialIcon>
        <SocialIcon link="https://www.linkedin.com/in/eugencius/">
          <ion-icon size="large" name="logo-linkedin"></ion-icon>
        </SocialIcon>
      </ul>
      <ul className="mb-3 flex gap-5">
        <FooterLink title="Privacy Policy" link="/privacy-policy" />
        <FooterLink title="Terms of Service" link="" />
        <FooterLink title="About us" link="" />
        <FooterLink title="Contact" link="" />
        <FooterLink title="Suport" link="" />
      </ul>
      <p className="text-xs">&copy; 2024 Eugeblog. All rights reserved.</p>
    </footer>
  );
}
