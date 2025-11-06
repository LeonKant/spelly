"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../../config/db.config";
import {
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  lobbyPrevRoundsInSpelly,
} from "../schema/spelly";
import { dbTransaction } from "@/types/db.type";

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

export async function deletePrevRounds(lobbyID: string, tx?: dbTransaction) {
  await (tx ?? db)
    .delete(lobbyPrevRoundsInSpelly)
    .where(eq(lobbyPrevRoundsInSpelly.lobbyId, lobbyID));
}
