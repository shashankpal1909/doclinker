import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import Footer from "./components/footer.tsx";
import Header from "./components/header.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";
import LandingPage from "./pages/landing-page.tsx";
import SignInPage from "./pages/signin-page.tsx";
import SignUpPage from "./pages/signup-page.tsx";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
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
    path: "/",
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
