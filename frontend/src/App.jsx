import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ContextWrapper, { loader as authLoader } from "./pages/ContextWrapper";
import GenericError from "./pages/GenericError.jsx";
import HomePage from "./pages/Home";
import LoginPage, {
  action as loginAction,
  loader as loginLoader,
} from "./pages/Login";
import LogoutError, { action as logoutAction } from "./pages/Logout";
import PostDetailsPage from "./pages/PostDetails";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import RootPage from "./pages/Root";
import SignupPage, { action as signupAction } from "./pages/Signup";
import { queryClient } from "./utils/http";
import PostCreationPage from "./pages/PostCreation.jsx";
import { CircularProgress } from "@mui/material";

const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    loader: authLoader,
    hydrateFallbackElement: <CircularProgress />,
    children: [
      {
        path: "/",
        element: <RootPage />,
        errorElement: <GenericError />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "post/:id",
            element: <PostDetailsPage />,
          },
          {
            path: "privacy-policy",
            element: <PrivacyPolicyPage />,
          },
          {
            path: "post/create",
            element: <PostCreationPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
        loader: loginLoader,
        action: loginAction,
      },
      {
        path: "/logout",
        action: logoutAction,
        errorElement: <LogoutError />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
        action: signupAction,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
