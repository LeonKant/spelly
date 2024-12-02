import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(15, "Username must be at most 15 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be at most 30 characters"),
});
export default signUpSchema;
