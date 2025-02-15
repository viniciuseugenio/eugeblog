import Github from "/social_icons/github-icon.svg";
import Linkedin from "/social_icons/linkedin-icon.svg";
import FooterLink from "./FooterLink";

export default function Footer() {
  const commonStyle =
    "hover:text-primary flex cursor-pointer flex-col items-center justify-center text-3xl duration-300 hover:scale-110";

  return (
    <footer className="mt-auto flex flex-col items-center justify-center bg-[#E4E0E1] py-5">
      <ul className="mb-3 flex gap-6">
        <a
          href="https://github.com/viniciuseugenio"
          target="_blank"
          className={commonStyle}
        >
          <img src={Github} className="w-8" alt="GitHub" />
          <span className="text-sm font-medium">GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/eugencius/"
          target="_blank"
          className={commonStyle}
        >
          <img src={Linkedin} className="w-8 text-inherit" alt="Linkedin" />
          <span className="text-sm font-medium">LinkedIn</span>
        </a>
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
