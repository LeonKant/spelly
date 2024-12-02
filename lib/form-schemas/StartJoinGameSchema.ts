import { z } from "zod";

export const startGameSchema = z.object({
  lobbyName: z.string(),
});

export const joinGameSchema = z.object({
  lobbyID: z.string(),
});
