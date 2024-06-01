import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { MdError, MdVerified } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
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

const SignInSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const SignInPage = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignInSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      authService
        .signIn(values)
        .then(() => {
          navigate(`/dashboard`, { replace: true });
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
        });
    });
  };

  return (
    <div className="container flex justify-center items-center my-8">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Sign In</CardTitle>
          <CardDescription>
            Welcome back! Please enter your details.
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
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        Password
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
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
              <Button disabled={isPending} type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <div className="text-sm">
            Don't have an account?&nbsp;
            <Link to="/sign-up" className="underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
