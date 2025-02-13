import { z } from "zod";

export const OTPSchema = z.object({
  email: z.string().email(),
  token: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type OTPSchemaT = z.infer<typeof OTPSchema>;
