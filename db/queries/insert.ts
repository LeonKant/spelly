"use server";
import {
  AddToPrevRoundsT,
  dbTransaction,
} from "@/types/db.type";
import { db } from "../../config/db.config";
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
  });
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
  values: AddToPrevRoundsT,
  tx?: dbTransaction,
) {
  const loserUserName = (await getUserName(userId)) ?? "";

  await (tx ?? db)
    .insert(lobbyPrevRoundsInSpelly)
    .values({ ...values, loserUserName });
}
