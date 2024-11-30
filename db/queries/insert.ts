"use server";

import { db } from "..";
import { lobbiesInSpelly, lobbyPlayersInSpelly } from "../schema/spelly";

export async function initLobby(lobbyName: string, userID: string) {
  await db.insert(lobbiesInSpelly).values({
    name: lobbyName,
    hostId: userID,
  });
}

// add player to lobby_players table
export async function addUserToLobby(lobbyID: string, userID: string) {
  await db.insert(lobbyPlayersInSpelly).values({
    userId: userID,
    lobbyId: lobbyID,
  });
}
