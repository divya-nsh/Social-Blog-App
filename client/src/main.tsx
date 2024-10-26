import "./index.css";
import "react-quill/dist/quill.snow.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/userContex.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./pages/Home.tsx";
import { Signup } from "./pages/auth/Signup.tsx";
import { Toaster } from "react-hot-toast";
import PostPage from "./pages/BlogPost.tsx";
import EditProfile from "./pages/settings.tsx";
import { Private } from "./components/PrivateRoute.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import { Profile } from "./pages/Profile.tsx";
import BookmarkedPosts from "./pages/Bookmarks.tsx";
import { NotFoundPage } from "./pages/NotFound";
import SearchPage from "./pages/SearchPage.tsx";
import Test from "./pages/test.tsx";
import EditCreatePost from "./pages/EditCreatePost.tsx";
import Layout from "./pages/Layout.tsx";
import EditProfileV2 from "./pages/EditProfileV2.tsx";
import Login from "./pages/auth/Login.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
import { retryHandler } from "./lib/utils.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: retryHandler(3),
    },
    mutations: {
      retry: retryHandler(3),
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/post/:postId", element: <PostPage /> },
      {
        path: "/account-settings",
        element: <Private comp={<EditProfile />} />,
      },
      {
        path: "/account-settings-beta",
        element: <Private comp={<EditProfileV2 />} />,
      },
      {
        path: "/change-password",
        element: <Private comp={<ChangePassword />} />,
      },
      {
        path: "/compose",
        element: <Private comp={<EditCreatePost />} />,
      },
      {
        path: "/post/:postId/edit",
        element: <Private comp={<EditCreatePost />} />,
      },
      {
        path: "/bookmarks",
        element: <Private comp={<BookmarkedPosts />} />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },

      { path: "/search", element: <SearchPage /> },
      { path: "/test", element: <Test /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          toastOptions={{
            error: {
              duration: 5000,
            },
            className: "dark:bg-black dark:text-white",
            style: {
              padding: "3px 10px",
            },
          }}
          containerStyle={{
            marginTop: "40px",
          }}
        />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
