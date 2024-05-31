import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

import authService from "@/api/services/auth-service";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup,
    DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpSchema = z.object({
  email: z.string().email({
    message: "A valid email address is required.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
  name: z.string().min(1, {
    message: "Your name is required.",
  }),
  dob: z.date({
    message: "Date of birth is required.",
  }),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select your gender.",
  }),
});

type Props = {};

const SignUpPage = (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [role, setRole] = useState<string>("patient");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    setError("");
    setSuccess("");

    console.log(values);

    startTransition(() => {
      authService
        .signUp({
          ...values,
          role,
          dob: values.dob.toISOString().split("T")[0],
        })
        .then((res) => {
          console.log(res);
          setSuccess("Account created successfully!");
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    });
  };

  useEffect(() => {
    if (searchParams.get("role") === "doctor") {
      setRole("doctor");
    }
  }, []);

  useEffect(() => {
    if (role === "doctor") {
      setSearchParams({ role: "doctor" });
    } else {
      setSearchParams({ role: "patient" });
    }
  }, [role]);

  return (
    <div className="container flex justify-center items-center my-8">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="flex text-3xl">
            Sign Up as&nbsp;
            <span className="text-primary">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            &nbsp;
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant="outline">
                  Change
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto">
                <DropdownMenuLabel>Select Your Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                  <DropdownMenuRadioItem value="patient">
                    Patient
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="doctor">
                    Doctor
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="John Doe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
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
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-1">Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select your date of birth</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            fromYear={1960}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              {success && <div className="text-green-500">{success}</div>}
              <Button disabled={isPending} type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <div className="text-sm">
            Already have an account?&nbsp;
            <Link to="/sign-in" className="underline">
              Sign in here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
