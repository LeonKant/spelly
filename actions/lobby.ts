"use server";

import { deleteLobby } from "@/db/queries/delete";
import { addUserToLobby, initLobby } from "@/db/queries/insert";
import {
  getLobbyInfoFromLobbyId,
  getLobbyInfoFromUserId,
} from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createLobbyAction(lobbyName: string, userID: string) {
  await initLobby(lobbyName, userID);
  redirect("/lobby");
}
export async function joinLobbyAction(lobbyID: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if signed in
  if (!!!user?.id) {
    console.log("user not signed in");
    return;
  }

  // check if lobby exists
  const lobby = getLobbyInfoFromLobbyId(lobbyID);
  if (!!!lobby) {
    console.log("lobby not found");
    return;
  }

  // insert into lobby_players table
  await addUserToLobby(lobbyID, user.id);

  console.log('user inserted into lobby_players table')

  // redirect
  redirect("/lobby");
}
export async function hostEndGameAction(userID: string) {
  // get lobby info from lobby_players
  const lobbyInfo = await getLobbyInfoFromUserId(userID);

  // user not in game
  if (!lobbyInfo) return;
  // user not host
  if (lobbyInfo.hostId !== userID) return;

  await deleteLobby(lobbyInfo.id);
}
