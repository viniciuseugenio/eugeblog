import BaseError from "../components/BaseError";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar/Navbar";

export default function GenericError({ layout }) {
  return (
    <>
      {layout && <Navbar />}
      <BaseError title="We couldn't load this page" status={404}>
        Sorry, we couldn&apos;t find the page you were looking for.
      </BaseError>
      {layout && <Footer />}
    </>
  );
}
