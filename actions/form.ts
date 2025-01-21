"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SignUpSchemaT } from "@/lib/form-schemas/SignUpSchema";
import { SignInSchemaT } from "@/lib/form-schemas/SignInSchema";

export const signUpAction = async (values: SignUpSchemaT) => {
  const supabase = await createClient();

  const { email, username, captchaToken } = values;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        username,
      },
      captchaToken,
    },
  });

  return { error };
};

export const signInAction = async (values: SignInSchemaT) => {
  const supabase = await createClient();

  const { email, captchaToken } = values;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      captchaToken,
    },
  });

  return { error };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
