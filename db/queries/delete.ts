"use server";

import { and, eq } from "drizzle-orm";
import { db } from "../../config/db.config";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  lobbyPrevRoundsInSpelly,
} from "../schema/spelly";

export async function deleteLobby(lobbyID: string): Promise<void> {
  await db.delete(lobbiesInSpelly).where(eq(lobbiesInSpelly.id, lobbyID));
}

export async function deletePlayerFromLobby(userID: string, lobbyID: string) {
  await db
    .delete(lobbyPlayersInSpelly)
    .where(
      and(
        eq(lobbyPlayersInSpelly.userId, userID),
        eq(lobbyPlayersInSpelly.lobbyId, lobbyID),
      ),
    );
}

export async function deletePrevRounds(lobbyID: string) {
  await db
    .delete(lobbyPrevRoundsInSpelly)
    .where(eq(lobbyPrevRoundsInSpelly.lobbyId, lobbyID));
}
