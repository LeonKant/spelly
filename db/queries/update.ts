import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  SpellyLobbyT,
} from "../schema/spelly";

export async function updateLobbyState(
  lobbyId: string,
  lobbyInfo: Omit<Partial<SpellyLobbyT>, "hostId" | "id" | "lobbyPlayerIds">,
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
