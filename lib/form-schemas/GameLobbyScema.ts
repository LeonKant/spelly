import { z } from "zod";

export const gameLobbySchema = z.object({
  gameInput: z
    .string()
    .min(1, "")
    .regex(/[A-Za-z]/, "Input must be a letter"),
});
