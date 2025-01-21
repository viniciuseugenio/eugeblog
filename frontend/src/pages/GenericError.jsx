import { useAuthCheck } from "../utils/hooks";

import BaseError from "../components/BaseError";
import MainHeader from "../components/Header/MainHeader";
import Footer from "../components/Footer";

export default function GenericError({ layout }) {
  useAuthCheck();

  return (
    <>
      {layout && <MainHeader />}
      <BaseError title="Page not found" status={404}>
        Sorry, we couldn&apos;t find the page you were looking for.
      </BaseError>
      {layout && <Footer />}
    </>
  );
}
