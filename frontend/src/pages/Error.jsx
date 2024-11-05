import { Link, useRouteError } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";

export default function ErrorPage() {
  const error = useRouteError();

  console.log(error);

  return (
    <>
      <MainHeader />
      <main className="m-auto text-center">
        <h1 className="mb-3 text-4xl font-bold">
          Ops! We couldn&apos;t find this page, sorry!
        </h1>
        <p>
          However, you can get back to the{" "}
          <Link to="/" className="text-[#AB886D]">
            home page
          </Link>
          !
        </p>
      </main>
      <Footer />
    </>
  );
}
