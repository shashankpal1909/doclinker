import { useEffect, useState } from "react";
import { MdError, MdVerified } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

import authService from "@/api/services/auth-service";

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

const VerifyEmailPage = () => {
  const { token } = useParams();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  useEffect(() => {
    setError("");
    setSuccess("");

    if (token) {
      authService
        .verifyEmail(token)
        .then(() => {
          setSuccess("Email verified successfully!");
        })
        .catch((error) => {
          setError(
            error.response.data.errors.map(
              (err: { message: string; field?: string }) => err.message,
            ),
          );
        });
    } else {
      setError("Invalid/Expired token");
    }
  }, [token]);

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
          {!success && !error && <LoadingComponent />}
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
