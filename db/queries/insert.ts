"use server"

import { db } from "..";
import { lobbiesInSpelly } from "../schema/spelly";

export async function initLobby(lobbyName: string, userID: string) {
  await db.insert(lobbiesInSpelly).values({
    name: lobbyName,
    hostId: userID,
  });
}
