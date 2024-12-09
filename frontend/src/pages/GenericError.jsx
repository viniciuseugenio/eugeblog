import MainHeader from "../components/Header/MainHeader";
import Footer from "../components/Footer";

import { Link } from "react-router-dom";
import BaseError from "../components/BaseError";

export default function GenericError() {
  return (
    <>
      <MainHeader />
      <BaseError title="Ops! We couldn't find this page, sorry!">
        <p>
          However, you can get back to the{" "}
          <Link to="/" className="text-[#AB886D]">
            home page
          </Link>
          !
        </p>
      </BaseError>
      <Footer />
    </>
  );
}
