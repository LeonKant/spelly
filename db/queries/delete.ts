import { eq } from "drizzle-orm";
import { db } from "..";
import { lobbiesInSpelly } from "../schema/spelly";

export async function deleteLobby(lobbyID: string): Promise<void> {
  await db.delete(lobbiesInSpelly).where(eq(lobbiesInSpelly.id, lobbyID));
}
