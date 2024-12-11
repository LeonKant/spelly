"use server";

import {
  deleteLobby,
  deletePlayerFromLobby,
  deletePrevRounds,
} from "@/db/queries/delete";
import {
  addToPrevRounds,
  addUserToLobby,
  initLobby,
} from "@/db/queries/insert";
import {
  checkWord,
  getLobbyInfoFromLobbyId,
  getLobbyInfoFromUserId,
} from "@/db/queries/select";
import {
  incrementPlayerPoints,
  resetLobbyPlayerPoints,
  updateLobbyState,
} from "@/db/queries/update";
import { SpellyLobbyInsertT, SpellyLobbyT } from "@/db/schema/spelly";
import { gameLobbySchema } from "@/lib/form-schemas/GameLobbyScema";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { z } from "zod";

type BaseGetClientAndLobbyInfoT = {
  user?: User;
  lobbyInfo?: SpellyLobbyT;
  error: boolean;
  message?: string;
  supabase?: SupabaseClient<any, "public", any>;
};

type GetClientAndLobbyInfoSuccessT = {
  error: false;
  user: User;
  lobbyInfo: SpellyLobbyT;
  supabase: SupabaseClient<any, "public", any>;
} & BaseGetClientAndLobbyInfoT;

type GetClientAndLobbyInfoErrorT = {
  error: true;
  message: string;
} & BaseGetClientAndLobbyInfoT;

const initLobbyState: Partial<SpellyLobbyT> = {
  currentLetter: 0,
  currentPlayer: 0,
  gameState: "a",
  gameOver: false,
};

const letters = "abcdefghijklmnopqrstuvwxyz";

async function getClientAndLobbyInfo(): Promise<
  GetClientAndLobbyInfoSuccessT | GetClientAndLobbyInfoErrorT
> {
  const error = true;
  const message = "Success";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if signed in
  if (!!!user?.id) {
    return { error, message: "User not signed in" };
  }
  // get lobby info from lobby_players
  const lobbyInfo = await getLobbyInfoFromUserId(user.id);

  // user not in game
  if (!lobbyInfo) return { error, message: "User not in game" };

  return { user, lobbyInfo, error: false, message, supabase };
}

export async function createLobbyAction(lobbyName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if signed in
  if (!!!user?.id) {
    throw new Error();
  }

  await initLobby(lobbyName, user.id);
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
  const lobby = await getLobbyInfoFromLobbyId(lobbyID);
  if (!!!lobby) {
    console.log("lobby not found");
    return;
  }

  if (lobby.gameStarted) {
    console.log("Game already started");
    return;
  }

  // insert into lobby_players table
  await addUserToLobby(lobbyID, user.id);

  // redirect
  redirect("/lobby");
}

export async function hostEndGameAction() {
  const { error, user, lobbyInfo, supabase } = await getClientAndLobbyInfo();
  if (error) return;
  // user not host
  if (lobbyInfo.hostId !== user.id) return;

  await deleteLobby(lobbyInfo.id);

  const channel = supabase.channel(`lobby-${lobbyInfo.id}`);

  channel.send({
    type: "broadcast",
    event: "end-game",
    payload: {},
  });

  supabase.removeChannel(channel);
}

export async function hostResetGameAction() {
  const { error, user, lobbyInfo, supabase } = await getClientAndLobbyInfo();
  if (error) return;
  // user not host
  if (lobbyInfo.hostId !== user.id) return;

  await updateLobbyState(lobbyInfo.id, initLobbyState);
  await resetLobbyPlayerPoints(lobbyInfo.id);
  await deletePrevRounds(lobbyInfo.id);

  const channel = supabase.channel(`lobby-${lobbyInfo.id}`);

  channel.send({
    type: "broadcast",
    event: "reset-game",
    payload: {},
  });

  supabase.removeChannel(channel);
}

export async function leaveGameAction() {
  const { error, user, lobbyInfo } = await getClientAndLobbyInfo();
  if (error) return;

  await deletePlayerFromLobby(user.id, lobbyInfo.id);

  redirect("/");
}

export async function startGameAction() {
  const { error, user, lobbyInfo } = await getClientAndLobbyInfo();
  if (error) return;

  // user not host
  if (lobbyInfo.hostId !== user.id) return;

  await updateLobbyState(lobbyInfo.id, { gameStarted: true });
}

export async function playerTurnSubmitAction(
  values: z.infer<typeof gameLobbySchema>,
) {
  const { error, user, lobbyInfo } = await getClientAndLobbyInfo();
  if (error) return;

  const { gameInput } = values;
  const {
    gameState,
    currentPlayer,
    lobbyPlayerIds,
    currentLetter,
    id: lobbyId,
  } = lobbyInfo;

  const newWord = `${gameState}${gameInput}`;
  const wordExists = await checkWord(newWord);

  if (wordExists) {
    // assign state to be new word, change player
    await updateLobbyState(lobbyInfo.id, {
      gameState: newWord,
      currentPlayer: (currentPlayer + 1) % lobbyPlayerIds.length,
    });
    return;
  }
  // if word doesn't exist, increase current letter
  const nextLetter = currentLetter + 1;

  // if letter is 'z', game over
  if (nextLetter >= 26) {
    await updateLobbyState(lobbyInfo.id, {
      gameOver: true,
    });
    return;
  }

  // if word doesn't exist, increase current letter, change player, increase of player points,
  // add to prev rounds
  await updateLobbyState(lobbyInfo.id, {
    gameState: letters[nextLetter],
    currentLetter: nextLetter,
    currentPlayer: (currentPlayer + 1) % lobbyPlayerIds.length,
  });

  await incrementPlayerPoints(user.id, lobbyInfo.id);
  await addToPrevRounds(user.id, { gameState: newWord, lobbyId });
}
