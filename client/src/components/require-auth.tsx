import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { RootState } from "@/app/store";

import LoadingComponent from "./loading";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading } = useSelector(
    (state: RootState) => state.authReducer,
  );

  useEffect(() => {
    if (!user && !loading) {
      navigate(`/sign-in`, {
        replace: true,
        state: { from: location },
      });
    }
  }, [loading, location, navigate, user]);

  if (loading) {
    return <LoadingComponent />;
  }

  return children;
};

export default RequireAuth;
