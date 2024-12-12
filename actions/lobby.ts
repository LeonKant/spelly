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
import { gameLobbySchema } from "@/lib/form-schemas/GameLobbyScema";
import { LobbyInfoUpdateT, SpellyLobbyT } from "@/types/db.type";
import {
  ActionResponse,
  ClientAndLobbyInfoT,
  ClientInfoT,
  WithoutErrorParamsT,
} from "@/types/lobby-actions.type";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const initLobbyState: Partial<SpellyLobbyT> = {
  currentLetter: 0,
  currentPlayer: 0,
  gameState: "a",
  gameOver: false,
};

const letters = "abcdefghijklmnopqrstuvwxyz";

async function getClientInfo(): Promise<ActionResponse<ClientInfoT>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!!!user?.id) {
    return { error: true, message: "User not signed in." };
  }

  return { error: false, supabase, user };
}

async function withClientInfo<T extends WithoutErrorParamsT = {}>(
  callback: (input: ClientInfoT) => Promise<ActionResponse<T>>,
): Promise<ActionResponse<T>> {
  const { error, message, supabase, user } = await getClientInfo();
  if (error) return { error: true, message };

  return callback({ supabase, user });
}

async function withClientAndLobbyInfo<T extends WithoutErrorParamsT = {}>(
  callback: (input: ClientAndLobbyInfoT) => Promise<ActionResponse<T>>,
  options?: { checkIfHost: boolean },
): Promise<ActionResponse<T>> {
  const { error: clientError, message, supabase, user } = await getClientInfo();
  if (clientError) return { error: true, message };

  // get lobby info from lobby_players
  const lobbyInfo = await getLobbyInfoFromUserId(user.id);

  // user not in game
  if (!lobbyInfo) return { error: true, message: "User not in game." };

  // user not host
  if (options?.checkIfHost && lobbyInfo.hostId !== user.id)
    return { error: true, message: "User not host." };

  return await callback({ supabase, user, lobbyInfo });
}

export async function createLobbyAction(lobbyName: string) {
  return await withClientInfo(async ({ user }) => {
    try {
      await initLobby(lobbyName, user.id);
    } catch (error) {
      return {
        error: true,
        message: "Error initializing lobby.",
      };
    }
    redirect("/lobby");
  });
}

export const joinLobbyAction = async (lobbyID: string) => {
  return await withClientInfo(async ({ user }): Promise<ActionResponse> => {
    const lobby = await getLobbyInfoFromLobbyId(lobbyID);
    if (!!!lobby) {
      return { error: true, message: "Lobby not found." };
    }

    if (lobby.gameStarted) {
      return { error: true, message: "Game already started." };
    }

    // insert into lobby_players table
    try {
      await addUserToLobby(lobbyID, user.id);
    } catch (error) {
      console.log(error);
      return { error: true, message: "Error adding user into lobby" };
    }

    redirect("/lobby");
  });
};

export const hostEndGameAction = async () =>
  await withClientAndLobbyInfo(
    async ({ lobbyInfo, supabase }): Promise<ActionResponse> => {
      try {
        await deleteLobby(lobbyInfo.id);
      } catch (error) {
        return { error: true, message: "Error deleting lobby." };
      }

      const channel = supabase.channel(`lobby-${lobbyInfo.id}`);

      channel.send({
        type: "broadcast",
        event: "end-game",
        payload: {},
      });

      supabase.removeChannel(channel);

      return { error: false };
    },
    { checkIfHost: true },
  );

export const hostResetGameAction = async () => {
  return await withClientAndLobbyInfo(
    async ({ lobbyInfo, supabase }): Promise<ActionResponse> => {
      // TODO: change to db transaction
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

      return { error: false };
    },
    { checkIfHost: true },
  );
};

export const leaveGameAction = async () => {
  return await withClientAndLobbyInfo(
    async ({ user, lobbyInfo }): Promise<ActionResponse> => {
      if (user.id === lobbyInfo.hostId) {
        return await hostEndGameAction();
      } else {
        try {
          await deletePlayerFromLobby(user.id, lobbyInfo.id);
        } catch (error) {
          return { error: true, message: "Error deleting player from lobby" };
        }
      }
      redirect("/");
    },
  );
};

export const startGameAction = async () => {
  return await withClientAndLobbyInfo(
    async ({ lobbyInfo }): Promise<ActionResponse> => {
      try {
        await updateLobbyState(lobbyInfo.id, { gameStarted: true });
      } catch (error) {
        return { error: true, message: "Error updating lobby state" };
      }
      return { error: false };
    },
    { checkIfHost: true },
  );
};

const updateLobbyStateAction = async (
  lobbyId: string,
  lobbyInfo: LobbyInfoUpdateT,
): Promise<ActionResponse> => {
  try {
    await updateLobbyState(lobbyId, lobbyInfo);
  } catch (error) {
    return { error: true, message: "Error updating game state" };
  }
  return { error: false };
};

export const playerTurnSubmitAction = async (
  values: z.infer<typeof gameLobbySchema>,
) => {
  return await withClientAndLobbyInfo(async ({ lobbyInfo, user }) => {
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
      return await updateLobbyStateAction(lobbyInfo.id, {
        gameState: newWord,
        currentPlayer: (currentPlayer + 1) % lobbyPlayerIds.length,
      });
    }
    // if word doesn't exist, increase current letter
    const nextLetter = currentLetter + 1;

    // if letter is 'z', game over
    if (nextLetter >= 26) {
      return await updateLobbyStateAction(lobbyInfo.id, {
        gameOver: true,
      });
    }

    // TODO: change to db transaction
    // if word doesn't exist, increase current letter, change player, increase of player points,
    // add to prev rounds
    await updateLobbyState(lobbyInfo.id, {
      gameState: letters[nextLetter],
      currentLetter: nextLetter,
      currentPlayer: (currentPlayer + 1) % lobbyPlayerIds.length,
    });

    await incrementPlayerPoints(user.id, lobbyInfo.id);
    await addToPrevRounds(user.id, { gameState: newWord, lobbyId });

    return { error: false };
  });
};
