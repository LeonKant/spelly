"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  accountSettingsSchema,
  AccountSettingsSchemaT,
} from "@/lib/form-schemas/AccountSettingsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { displayErrorToast } from "@/utils/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { modifyAccountDetailsAction } from "@/actions/form";

interface Props {
  username: string;
}

export function AccountSettingsForm({ username }: Props) {
  const form = useForm<AccountSettingsSchemaT>({
    resolver: zodResolver(accountSettingsSchema.required()),
    mode: "onChange",
    defaultValues: {
      username: username,
    },
  });

  const onSubmit = async (values: AccountSettingsSchemaT) => {
    const { error, message } = await modifyAccountDetailsAction(values);
    if (error) {
      displayErrorToast(message);
      return;
    }

    toast({ title: "Successfully updated account info." });
    form.reset({ username: values.username });
    redirect("/");
  };

  const submitDisabled = form.getValues("username") === username;

  const { isSubmitting, isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} maxLength={15} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={submitDisabled || !isValid || isSubmitting}
              type="submit"
            >
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
