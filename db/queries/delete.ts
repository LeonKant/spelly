import { and, eq } from "drizzle-orm";
import { db } from "..";
import { lobbiesInSpelly, lobbyPlayersInSpelly } from "../schema/spelly";

export async function deleteLobby(lobbyID: string): Promise<void> {
  await db.delete(lobbiesInSpelly).where(eq(lobbiesInSpelly.id, lobbyID));
}

export async function deletePlayerFromLobby(userID: string, lobbyID: string) {
  await db
    .delete(lobbyPlayersInSpelly)
    .where(
      and(
        eq(lobbyPlayersInSpelly.userId, userID),
        eq(lobbyPlayersInSpelly.lobbyId, lobbyID)
      )
    );
}
