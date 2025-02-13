"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { OTPSchema, OTPSchemaT } from "@/lib/form-schemas/OTPSchema";
import { createClient } from "@/utils/supabase/client";
import { displayErrorToast } from "@/utils/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface Props {
  email: string | null;
}

export function InputOTPForm({ email }: Props) {
  const form = useForm<OTPSchemaT>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      email: email || "",
      token: "",
    },
  });

  const onSubmit = async (data: OTPSchemaT) => {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      ...data,
      type: "email",
    });
    if (error) {
      displayErrorToast(error.message);
      return;
    }
    redirect("/");
  };

  useEffect(() => {
    form.setValue("email", email || "");
  }, [email]);


  const { isSubmitting, isValid } = form.formState;

  return (
    <Dialog open={!!email}>
      <DialogTitle className="hidden">Login OTP</DialogTitle>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center space-y-6"
          >
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col justify-center gap-6">
                    <FormLabel className="text-center">
                      One-Time Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email
                      {email ? `: ${email}` : "."}
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
