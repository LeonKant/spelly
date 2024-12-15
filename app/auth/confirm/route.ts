import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (!token_hash) {
    return NextResponse.redirect(`${origin}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: "magiclink",
  });

  

  // if (redirectTo) {
  //   return NextResponse.redirect(`${origin}${redirectTo}`);
  // }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}`);
}
