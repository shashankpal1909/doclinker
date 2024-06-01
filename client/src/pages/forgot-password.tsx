import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { MdError, MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { z } from "zod";

import authService from "@/api/services/auth-service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import InfoComponent from "@/components/info";

const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

const ForgotPasswordPage = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    setError("");
    setSuccess("");
    setLoading(true);

    startTransition(() => {
      authService
        .forgotPassword(values)
        .then(() => {
          setSuccess("Check you email for reset password instructions.");
        })
        .catch((error) => {
          type ApiError = {
            message: string;
            field?: string;
          };
          setError(
            (error.response.data.errors as ApiError[])
              .map((err: ApiError) => err.message)
              .join("\n"),
          );
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <div className="container flex justify-center items-center my-8">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you instructions to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="grid w-full gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={loading}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <Button disabled={loading} type="submit" className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </form>
          </Form>
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

export default ForgotPasswordPage;
