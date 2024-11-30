"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  profilesInSpelly,
} from "../schema/spelly";

export async function getUsers() {
  return await db.select().from(profilesInSpelly);
}
export async function getUserName(userId: string): Promise<string | null> {
  return (
    await db
      .select()
      .from(profilesInSpelly)
      .where(eq(profilesInSpelly.id, userId))
  )[0].username;
}
export async function getLobbyInfoFromHostId(userId: string) {
  return (
    await db
      .select()
      .from(lobbiesInSpelly)
      .where(eq(lobbiesInSpelly.hostId, userId))
  )?.[0];
}

export async function checkIfUserInGame(userId: string) {
  return (await getLobbyInfoFromUserId(userId))?.hostId === userId;
}

export async function getLobbyInfoFromUserId(userID: string) {
  const lobbyID = (
    await db
      .select()
      .from(lobbyPlayersInSpelly)
      .where(eq(lobbyPlayersInSpelly.userId, userID))
  )?.[0]?.lobbyId;

  if (!lobbyID) return undefined;

  return (
    await db
      .select()
      .from(lobbiesInSpelly)
      .where(eq(lobbiesInSpelly.id, lobbyID))
  )?.[0];
}
export async function getLobbyInfoFromLobbyId(lobbyID: string) {
  return (
    await db
      .select()
      .from(lobbiesInSpelly)
      .where(eq(lobbiesInSpelly.id, lobbyID))
      .limit(1)
  )?.[0];
}
