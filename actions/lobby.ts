"use server";

import { initLobby } from "@/db/queries/insert";
import { redirect } from "next/navigation";

export async function createLobbyAction(lobbyName: string, userID: string) {
  await initLobby(lobbyName, userID);
  redirect("/lobby");
}
