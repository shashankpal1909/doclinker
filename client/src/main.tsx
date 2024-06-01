import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { store } from "@/app/store";

import Footer from "@/components/footer.tsx";
import Header from "@/components/header.tsx";
import ThemeProvider from "@/components/theme-provider.tsx";

import DashboardPage from "@/pages/dashboard";
import ForgotPasswordPage from "@/pages/forgot-password";
import LandingPage from "@/pages/landing.tsx";
import ResetPasswordPage from "@/pages/reset-password";
import SignInPage from "@/pages/signin";
import SignUpPage from "@/pages/signup.tsx";
import VerifyEmailPage from "@/pages/verify-email";

import "@/index.css";

import RequireAuth from "./components/require-auth";
import { getCurrentUser } from "./features/auth/authSlice";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <div className="flex flex-col flex-grow h-screen">
      <Header />
      <main className="flex flex-grow justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "*",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "verify-email/:token",
        element: <VerifyEmailPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: "protected",
        element: (
          <RequireAuth>
            <h1>Protected Page</h1>
          </RequireAuth>
        ),
      },
      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
