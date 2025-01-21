import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(15, "Username must be at most 15 characters"),
  captchaToken: z.string()
});

export type SignUpSchemaT =  z.infer<typeof signUpSchema>
