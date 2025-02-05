import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  captchaToken: z.string(),
});

export type SignInSchemaT = z.infer<typeof signInSchema>;
