import { CircularProgress } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ContextWrapper from "./pages/ContextWrapper";
import GenericError from "./pages/GenericError.jsx";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import PostCreationPage from "./pages/PostCreation.jsx";
import PostDetailsPage from "./pages/PostDetails";
import PostEditPage from "./pages/PostEdit.jsx";
import PostReviewDetailsPage from "./pages/PostReviewDetails.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import RootPage from "./pages/Root";
import SignupPage from "./pages/Signup";
import { queryClient } from "./utils/http";

const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    hydrateFallbackElement: <CircularProgress />,
    errorElement: <GenericError />,
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
            path: "post/review/:id",
            element: <PostReviewDetailsPage />,
          },
          {
            path: "privacy-policy",
            element: <PrivacyPolicyPage />,
          },
          {
            path: "post/create",
            element: <PostCreationPage />,
          },
          {
            path: "post/edit/:id",
            element: <PostEditPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
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
