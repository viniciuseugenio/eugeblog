import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

export default function RootPage() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </>
  );
}
