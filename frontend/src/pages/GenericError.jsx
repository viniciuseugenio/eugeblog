import { useAuthCheck } from "../utils/hooks";
import { useRouteError } from "react-router";

import BaseError from "../components/BaseError";
import MainHeader from "../components/Header/MainHeader";
import Footer from "../components/Footer";

export default function GenericError() {
  useAuthCheck();
  const error = useRouteError();

  return (
    <>
      <MainHeader />
      <BaseError title="Page not found" status={404}>
        Sorry, we couldn&apos;t find the page you were looking for.{" "}
        {error.message !== "error is null" && <>{error.message}</>}
      </BaseError>
      <Footer />
    </>
  );
}
