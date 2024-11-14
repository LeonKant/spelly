"use client";

// import { usernameSchema } from "@/lib/schemas/UsernameSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import signUpSchema from "@/lib/schemas/SignUpSchema";
import Link from "next/link";
import { signUpActionTest } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const SignUpForm = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onError = () => {
    console.log("Something went wrong callback");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) =>
          form
            .handleSubmit(
              signUpActionTest,
              onError
            )(e)
            .catch((e) => {
              console.log("Something went wrong");
              console.log("e.message -->", e.message);
              toast({
                title: "Uh oh! Something went wrong.",
                description: e.message,
              });
            })
        }
        className="space-y-4"
      >
        <div>
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text text-foreground">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username*</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} maxLength={15} />
              </FormControl>
              <FormDescription>
                This is the name displayed during games.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password*</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
