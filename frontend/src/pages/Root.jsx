import { Outlet, ScrollRestoration } from "react-router-dom";
import MainHeader from "../components/Header/MainHeader";
import Footer from "../components/Footer";

export default function RootPage() {
  return (
    <>
      <MainHeader />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </>
  );
}
