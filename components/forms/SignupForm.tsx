"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { signUpAction } from "@/actions/form";
import { signUpSchema, SignUpSchemaT } from "@/lib/form-schemas/SignUpSchema";
import { CLIENT } from "@/config/var.config";
import { Turnstile } from "@marsidev/react-turnstile";
import { displayErrorToast } from "@/utils/client";
import { useState } from "react";
import { InputOTPForm } from "./OTPForm";

const SignUpForm = () => {
  const [emailState, setEmailState] = useState<null | string>(null);
  const form = useForm<SignUpSchemaT>({
    resolver: zodResolver(signUpSchema.required()),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      captchaToken: "",
    },
  });

  const onSubmit = async (values: SignUpSchemaT) => {
    const { success, error: parseError } = signUpSchema.safeParse(values);
    if (!success) {
      displayErrorToast(parseError.message);
      return;
    }
    const { error } = await signUpAction(values);
    if (error) {
      displayErrorToast(error.message);
      return;
    }
    setEmailState(values.email);
  };

  return (
    <>
      <InputOTPForm email={emailState} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h1 className="text-2xl font-medium">Sign up</h1>
            <p className="text text-sm text-foreground">
              Already have an account?{" "}
              <Link
                className="font-medium text-primary underline"
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
                  <Input
                    placeholder="Your username"
                    {...field}
                    maxLength={15}
                  />
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
            name="captchaToken"
            render={({ field }) => (
              <FormItem>
                <Turnstile
                  siteKey={CLIENT.captchaSiteKey}
                  onSuccess={(token) => {
                    form.setValue("captchaToken", token);
                  }}
                />
                <FormControl>
                  <Input className="hidden" {...field} />
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
    </>
  );
};

export default SignUpForm;
