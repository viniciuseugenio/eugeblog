import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ContextWrapper, { loader as authLoader } from "./pages/ContextWrapper";
import GenericError from "./pages/GenericError.jsx";
import HomePage from "./pages/Home";
import LoginPage, {
  action as loginAction,
  loader as loginLoader,
} from "./pages/Login";
import { action as logoutAction } from "./pages/Logout";
import PostDetailsPage, {
  action as createComment,
  loader as loadPost,
} from "./pages/PostDetails";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import RootPage from "./pages/Root";
import SignupPage, { action as signupAction } from "./pages/Signup";
import { queryClient } from "./utils/http.js";

const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    loader: authLoader,
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
            loader: loadPost,
            action: createComment,
          },
          {
            path: "privacy-policy",
            element: <PrivacyPolicyPage />,
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
