import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { getCurrentUserReducer, userReducer } from "@/features/auth/slice";

import LoadingComponent from "./loading";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(userReducer);
  const { loading } = useSelector(getCurrentUserReducer);

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
