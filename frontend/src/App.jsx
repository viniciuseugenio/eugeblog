import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loader as loadPosts } from "./components/Posts";
import ContextWrapper, { loader as authLoader } from "./pages/ContextWrapper";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import LoginPage, { action as loginAction } from "./pages/Login";
import PostDetailsPage, {
  action as createComment,
  loader as loadPost,
} from "./pages/PostDetails";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import RootPage from "./pages/Root";

const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    loader: authLoader,
    children: [
      {
        path: "/",
        element: <RootPage />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: loadPosts,
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
        action: loginAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
