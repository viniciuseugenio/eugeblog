import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootPage from "./pages/Root";
import HomePage from "./pages/Home";
import { loader as loadPosts } from "./components/Posts";
import LoginPage from "./pages/Login";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import PostDetailsPage, {
  loader as loadPost,
  action as createComment,
} from "./pages/PostDetails";

const router = createBrowserRouter([
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
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicyPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
