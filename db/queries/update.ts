"use server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../../config/db.config";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  profilesInSpelly,
} from "../schema/spelly";
import { dbTransaction, LobbyInfoUpdateT } from "@/types/db.type";

export async function updateLobbyState(
  lobbyId: string,
  lobbyInfo: LobbyInfoUpdateT,
  tx?: dbTransaction,
) {
  await (tx ?? db)
    .update(lobbiesInSpelly)
    .set({ ...lobbyInfo, lastActivity: sql`CURRENT_TIMESTAMP` })
    .where(eq(lobbiesInSpelly.id, lobbyId));
}

export async function incrementPlayerPoints(
  userId: string,
  lobbyId: string,
  tx?: dbTransaction,
) {
  await (tx ?? db)
    .update(lobbyPlayersInSpelly)
    .set({
      points: sql`${lobbyPlayersInSpelly.points} + 1`,
    })
    .where(
      and(
        eq(lobbyPlayersInSpelly.userId, userId),
        eq(lobbyPlayersInSpelly.lobbyId, lobbyId),
      ),
    );
}

export async function resetLobbyPlayerPoints(
  lobbyId: string,
  tx?: dbTransaction,
) {
  await (tx ?? db)
    .update(lobbyPlayersInSpelly)
    .set({
      points: 0,
    })
    .where(eq(lobbyPlayersInSpelly.lobbyId, lobbyId));
}

export async function modifyUserName(userId: string, newUsername: string) {
  await db
    .update(profilesInSpelly)
    .set({ username: newUsername })
    .where(eq(profilesInSpelly.id, userId));
}
