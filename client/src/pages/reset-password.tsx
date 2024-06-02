import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdError, MdVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";

import { AppDispatch } from "@/app/store";

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

import {
  resetPasswordReducer,
  resetResetPasswordState,
} from "@/features/auth/slice";
import { resetPassword } from "@/features/auth/thunks";

const ResetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

const ResetPasswordPage = () => {
  const { token } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, success } = useSelector(resetPasswordReducer);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    return () => {
      dispatch(resetResetPasswordState());
    };
  }, []);

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    const payload = {
      token: token!,
      dto: values,
    };

    dispatch(resetPassword(payload))
      .unwrap()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        form.reset();
      });
  };

  return (
    <div className="container flex justify-center items-center my-8">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Reset Password</CardTitle>
          <CardDescription>
            Set a new password for your account.
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={loading}
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

export default ResetPasswordPage;
