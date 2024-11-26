"use server"

import { eq } from "drizzle-orm";
import { db } from "..";
import { lobbiesInSpelly, profilesInSpelly } from "../schema/spelly";

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
export async function getLobbyInfo(userId: string) {
  return await db
    .select()
    .from(lobbiesInSpelly)
    .where(eq(lobbiesInSpelly.hostId, userId));
}
