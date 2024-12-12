"use server";

import { SpellyLobbyPrevRoundInsertT } from "@/types/db.type";
import { db } from "..";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  lobbyPrevRoundsInSpelly,
} from "../schema/spelly";
import { getUserName } from "./select";

export async function initLobby(lobbyName: string, userID: string) {
  await db.insert(lobbiesInSpelly).values({
    name: lobbyName,
    hostId: userID,
  })
}

// add player to lobby_players table
export async function addUserToLobby(lobbyID: string, userID: string) {
  await db.insert(lobbyPlayersInSpelly).values({
    userId: userID,
    lobbyId: lobbyID,
  });
}

// insert to lobby_prev_rounds table
export async function addToPrevRounds(
  userId: string,
  values: Omit<
    SpellyLobbyPrevRoundInsertT,
    "id" | "timeAdded" | "loserUserName"
  >,
) {
  const loserUserName = (await getUserName(userId)) ?? "";

  await db.insert(lobbyPrevRoundsInSpelly).values({ ...values, loserUserName });
}
