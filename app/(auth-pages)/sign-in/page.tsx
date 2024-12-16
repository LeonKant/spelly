import { signInAction, signUpAction } from "@/actions/form";
import { FormMessage, Message } from "@/components/form-message";
import CaptchaSubmit from "@/components/forms/CaptchaSubmit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex min-w-64 flex-1 flex-col">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="font-medium text-foreground underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <CaptchaSubmit
          pendingText="Signing In..."
          buttonText="Sign in"
          formAction={signInAction}
        />
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
