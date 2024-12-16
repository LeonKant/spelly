"use client";

import { signUpAction } from "@/actions/form";
import { SubmitButton } from "../submit-button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { CLIENT } from "@/config/var.config";

interface Props {
  pendingText: string;
  buttonText: string;
  formAction?: string | ((formData: FormData) => void);
}
export default function CaptchaSubmit({
  pendingText,
  buttonText,
  formAction,
}: Props) {
  const [captchaToken, setCaptchaToken] = useState<string>("");

  return (
    <>
      <Turnstile
        siteKey={CLIENT.captchaSiteKey}
        onSuccess={(token) => {
          setCaptchaToken(token);
        }}
      />
      <Input
        className="hidden"
        name="captchaToken"
        defaultValue={captchaToken}
      />
      <SubmitButton formAction={formAction} pendingText={pendingText}>
        {buttonText}
      </SubmitButton>
    </>
  );
}
