import { useEffect } from "react";
import { MdError, MdVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { AppDispatch } from "@/app/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import InfoComponent from "@/components/info";
import LoadingComponent from "@/components/loading";

import {
  resetVerifyEmailState,
  verifyEmailReducer,
} from "@/features/auth/slice";
import { verifyEmail } from "@/features/auth/thunks";

const VerifyEmailPage = () => {
  const { token } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, success } = useSelector(verifyEmailReducer);

  useEffect(() => {
    dispatch(verifyEmail(token!));
  }, [dispatch, token]);

  useEffect(() => {
    return () => {
      dispatch(resetVerifyEmailState());
    };
  }, []);

  return (
    <div className="container flex justify-center items-center my-8">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Email Verification</CardTitle>
          <CardDescription>
            Confirm your email address to complete the registration process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(loading || (!success && !error)) && <LoadingComponent />}
          {error && (
            <InfoComponent
              variant={"error"}
              title={"Error"}
              description={error}
              Icon={MdError}
            />
          )}
          {success && (
            <InfoComponent
              variant={"success"}
              title={"Success"}
              description={success}
              Icon={MdVerified}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <div className="text-sm">
            <Link to="/sign-in" className="underline">
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
