import { Outlet, ScrollRestoration } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";
import { Toaster } from "sonner";

export default function RootPage() {
  return (
    <>
      <Toaster position="top-right" richColors duration={3000} />
      <MainHeader />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </>
  );
}
