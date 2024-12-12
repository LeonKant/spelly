"use server";

import { eq, like, or } from "drizzle-orm";
import { db } from "../../config/db.config";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  lobbyPrevRoundsInSpelly,
  profilesInSpelly,
  wordsInSpelly,
} from "../schema/spelly";
import { SpellyLobbyPrevRoundT, SpellyLobbyT } from "@/types/db.type";

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
    {} as { [id: string]: { points: number; username: string } },
  );
}

export async function getLobbyInfoFromHostId(userId: string):Promise<SpellyLobbyT> {
  return (
    await db
      .select()
      .from(lobbiesInSpelly)
      .where(eq(lobbiesInSpelly.hostId, userId))
      .limit(1)
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
  lobbyID: string,
): Promise<SpellyLobbyPrevRoundT[]> {
  return await db
    .select()
    .from(lobbyPrevRoundsInSpelly)
    .where(eq(lobbyPrevRoundsInSpelly.lobbyId, lobbyID))
    .orderBy(lobbyPrevRoundsInSpelly.timeAdded);
}

// check if word exists in database
export async function checkWord(newWord: string): Promise<boolean> {
  return (
    (
      await db
        .select()
        .from(wordsInSpelly)
        .where(like(wordsInSpelly.word, `${newWord}%`))
    ).length > 0
  );
}
