import { Provider } from "react-redux";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { store } from "@/app/store";

import RequireAuth from "@/components/require-auth";
import ThemeProvider from "@/components/theme-provider";

import RootLayout from "@/layouts/root-layout";

import DashboardPage from "@/pages/dashboard";
import ForgotPasswordPage from "@/pages/forgot-password";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";
import ResetPasswordPage from "@/pages/reset-password";
import SignInPage from "@/pages/signin";
import SignUpPage from "@/pages/signup";
import VerifyEmailPage from "@/pages/verify-email";

import "@/index.css";

import { RootErrorBoundary } from "./pages/error";

const router = createBrowserRouter([
  {
    path: "*",
    element: <RootLayout />,
    children: [
      {
        path: "",
        errorElement: <RootErrorBoundary />,
        element: <Outlet />,
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
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </>
  );
};

export default App;
