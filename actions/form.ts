"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SignUpSchemaT } from "@/lib/form-schemas/SignUpSchema";
import { SignInSchemaT } from "@/lib/form-schemas/SignInSchema";
import { AccountSettingsSchemaT } from "@/lib/form-schemas/AccountSettingsSchema";
import { modifyUserName } from "@/db/queries/update";
import { ActionResponse } from "@/types/lobby-actions.type";
import { checkIfUserInGame } from "@/db/queries/select";
import { createAdminClient } from "@/utils/supabase/admin";
import { OTPSchemaT } from "@/lib/form-schemas/OTPSchema";

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

export const verifyOtpAction = async (data: OTPSchemaT) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    ...data,
    type: "email",
  });

  return { error: !!error };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const modifyAccountDetailsAction = async (
  values: AccountSettingsSchemaT,
): Promise<ActionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!!!user?.id) {
    return { error: true, message: "User not signed in." };
  }

  if (await checkIfUserInGame(user.id)) {
    return {
      error: true,
      message: "Cannot modify account details while in game.",
    };
  }

  const { username } = values;

  try {
    await modifyUserName(user.id, username);
  } catch (error) {
    console.log(error);
    return { error: true, message: "Error updating user info." };
  }

  return { error: false };
};

export const deleteAccountAction = async (): Promise<ActionResponse> => {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!!!user?.id) {
    return { error: true, message: "User not signed in." };
  }

  if (await checkIfUserInGame(user.id)) {
    return {
      error: true,
      message: "Cannot modify account details while in game.",
    };
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    return { error: true, message: error.message };
  }

  redirect("/");
};
