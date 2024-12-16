import { signUpAction } from "@/actions/form";
import { FormMessage, Message } from "@/components/form-message";
import CaptchaSubmit from "@/components/forms/CaptchaSubmit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="mx-auto flex min-w-64 max-w-64 flex-col">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text text-sm text-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-primary underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">Email*</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="username">Username*</Label>
          <Input name="username" placeholder="Your username" required />
          <CaptchaSubmit
            pendingText="Signing up..."
            buttonText="Sign up"
            formAction={signUpAction}
          />
          <FormMessage message={searchParams} />
        </div>
      </form>
      {/* <SignUpForm />
      <FormMessage message={searchParams} /> */}
    </>
  );
}
