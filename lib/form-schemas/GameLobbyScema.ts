import { z } from "zod";

export const gameLobbySchema = z.object({
  gameInput: z
    .string()
    .regex(/[A-Za-z]/, "Input must be a letter")
    .transform((val) => val.toLowerCase()),
});
