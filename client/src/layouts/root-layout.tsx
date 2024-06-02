import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import { AppDispatch } from "@/app/store";

import Footer from "@/components/footer";
import Header from "@/components/header";

import { getCurrentUser } from "@/features/auth/thunks";

const RootLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

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

export default RootLayout;
