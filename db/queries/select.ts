"use server";

import { and, eq, or } from "drizzle-orm";
import { db } from "..";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  lobbyPrevRoundsInSpelly,
  profilesInSpelly,
  SpellyLobbyPrevRoundT,
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

export async function getProfileInfo(userIds: string[]) {
  return await db
    .select()
    .from(profilesInSpelly)
    .where(or(...userIds.map((userId) => eq(profilesInSpelly.id, userId))));
}

export async function getLobbyUsernameAndPoints(lobbyId: string) {
  const playersInLobby = db
    .select()
    .from(lobbyPlayersInSpelly)
    .where(eq(lobbyPlayersInSpelly.lobbyId, lobbyId))
    .as("playersInLobby");

  const getUsernameAndPointsResult = await db
    .select()
    .from(profilesInSpelly)
    .innerJoin(playersInLobby, eq(profilesInSpelly.id, playersInLobby.userId));

  return getUsernameAndPointsResult.reduce(
    (prev, curr) => {
      const {
        profiles: { id, username },
        playersInLobby: { points },
      } = curr;
      prev[id] = { username, points };
      return prev;
    },
    {} as { [id: string]: { points: number; username: string } }
  );
}

export async function getLobbyInfoFromHostId(userId: string) {
  return (
    await db
      .select()
      .from(lobbiesInSpelly)
      .where(eq(lobbiesInSpelly.hostId, userId))
  )?.[0];
}

export async function checkIfUserInGame(userId: string): Promise<boolean> {
  return !!(await getLobbyInfoFromUserId(userId));
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

export async function getLobbyPrevRounds(
  lobbyID: string
): Promise<SpellyLobbyPrevRoundT[]> {
  return await db
    .select()
    .from(lobbyPrevRoundsInSpelly)
    .where(eq(lobbyPrevRoundsInSpelly.lobbyId, lobbyID))
    .orderBy(lobbyPrevRoundsInSpelly.timeAdded);
}
