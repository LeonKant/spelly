"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "../../config/db.config";
import { lobbiesInSpelly, lobbyPlayersInSpelly } from "../schema/spelly";
import { LobbyInfoUpdateT } from "@/types/db.type";

export async function updateLobbyState(
  lobbyId: string,
  lobbyInfo: LobbyInfoUpdateT,
) {
  await db
    .update(lobbiesInSpelly)
    .set({ ...lobbyInfo })
    .where(eq(lobbiesInSpelly.id, lobbyId));
}

export async function incrementPlayerPoints(userId: string, lobbyId: string) {
  await db
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

export async function resetLobbyPlayerPoints(lobbyId: string) {
  await db
    .update(lobbyPlayersInSpelly)
    .set({
      points: 0,
    })
    .where(and(eq(lobbyPlayersInSpelly.lobbyId, lobbyId)));
}
