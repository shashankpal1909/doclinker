import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

const SignInSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type Props = {};

const SignInPage = (props: Props) => {
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

    console.log(values);

    startTransition(() => {});
  };

  return (
    <div className="container flex justify-center items-center my-8">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Sign In</CardTitle>
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
                      <FormLabel>Password</FormLabel>
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
              {
                error && error
                // <InfoComponent
                //   variant={"error"}
                //   title={"Error"}
                //   description={error}
                //   Icon={MdError}
                // />
              }
              {
                success && success
                // <InfoComponent
                //   variant={"success"}
                //   title={"Success"}
                //   description={success}
                //   Icon={MdVerified}
                // />
              }
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
