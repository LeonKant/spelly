"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { CLIENT } from "@/config/var.config";
import { Turnstile } from "@marsidev/react-turnstile";
import { displayErrorToast } from "@/utils/client";
import { useState } from "react";
import { InputOTPForm } from "./OTPForm";
import { signInSchema, SignInSchemaT } from "@/lib/form-schemas/SignInSchema";
import { signInAction } from "@/actions/form";

const SignInForm = () => {
  const [openOTP, setOpenOTP] = useState<boolean>(false);

  const form = useForm<SignInSchemaT>({
    resolver: zodResolver(signInSchema.required()),
    mode: "onChange",
    defaultValues: {
      email: "",
      captchaToken: "",
    },
  });

  const onSubmit = async (values: SignInSchemaT) => {
    const { success, error: parseError } = signInSchema.safeParse(values);
    if (!success) {
      displayErrorToast(parseError.message);
      return;
    }
    const { error } = await signInAction(values);
    if (error) {
      displayErrorToast(error.message);
      return;
    }
    setOpenOTP(true);
  };

  return (
    <>
      <InputOTPForm open={openOTP} email={form.getValues("email")} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h1 className="text-2xl font-medium">Sign in</h1>
            <p className="text text-sm text-foreground">
              Don't have an account?{" "}
              <Link
                className="font-medium text-primary underline"
                href="/sign-up"
              >
                Sign up
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

export default SignInForm;
