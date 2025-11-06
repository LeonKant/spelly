"use server";
import { deleteLobby, deletePlayerFromLobby } from "@/db/queries/delete";
import { addUserToLobby, initLobby } from "@/db/queries/insert";
import { checkWord, getLobbyInfoFromLobbyId } from "@/db/queries/select";
import {
  gameOverLoseRoundTransaction,
  resetGameTransaction,
} from "@/db/queries/transactions";
import { updateLobbyState } from "@/db/queries/update";
import { gameLobbySchema } from "@/lib/form-schemas/GameLobbyScema";
import { LobbyInfoUpdateT, SpellyLobbyT } from "@/types/db.type";
import { ActionResponse } from "@/types/lobby-actions.type";
import {
  withClientAndLobbyInfo,
  withClientInfo,
} from "@/utils/lobby/action-middleware";
import { redirect } from "next/navigation";
import { z } from "zod";

const letters = "abcdefghijklmnopqrstuvwxyz";

export const createLobbyAction = async (lobbyName: string) =>
  await withClientInfo(async ({ user }) => {
    try {
      await initLobby(lobbyName, user.id);
    } catch (error) {
      return {
        error: true,
        message: "Error initializing lobby.",
      };
    }
    redirect("/lobby");
  })();

export const joinLobbyAction = async (lobbyID: string) =>
  await withClientInfo(async ({ user }): Promise<ActionResponse> => {
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
      return { error: true, message: "Error adding user into lobby" };
    }

    redirect("/lobby");
  })();

export const hostEndGameAction = withClientAndLobbyInfo(
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

export const hostResetGameAction = withClientAndLobbyInfo(
  async ({ lobbyInfo, supabase }): Promise<ActionResponse> => {
    try {
      await resetGameTransaction(lobbyInfo.id);

      const channel = supabase.channel(`lobby-${lobbyInfo.id}`);

      channel.send({
        type: "broadcast",
        event: "reset-game",
        payload: {},
      });

      supabase.removeChannel(channel);
    } catch (error) {
      return { error: true, message: "Error resetting game" };
    }

    return { error: false };
  },
  { checkIfHost: true },
);

export const leaveGameAction = withClientAndLobbyInfo(
  async ({ user, lobbyInfo }): Promise<ActionResponse> => {
    if (user.id === lobbyInfo.hostId) {
      return await hostEndGameAction();
    } else {
      try {
        await deletePlayerFromLobby(user.id, lobbyInfo.id);
      } catch (error) {
        console.error(error);
        return { error: true, message: "Error deleting player from lobby" };
      }
    }
    redirect("/");
  },
);

export const startGameAction = withClientAndLobbyInfo(
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

const gameOverLoseRoundTransactionAction = async (
  playerId: string,
  lobbyId: string,
  lobbyInfo: LobbyInfoUpdateT,
  gameState: string,
): Promise<ActionResponse> => {
  try {
    await gameOverLoseRoundTransaction(playerId, lobbyId, lobbyInfo, gameState);
  } catch (error) {
    return {
      error: true,
      message: "Error setting game over or lose round state",
    };
  }
  return { error: false };
};

export const playerTurnSubmitAction = async (
  values: z.infer<typeof gameLobbySchema>,
) =>
  await withClientAndLobbyInfo(
    async ({
      lobbyInfo,
      user,
    }): Promise<
      ActionResponse<{ lostRound?: boolean; gameOver?: boolean }>
    > => {
      const { gameInput } = values;
      const {
        gameState,
        currentPlayer,
        lobbyPlayerIds,
        currentLetter,
        id: lobbyId,
      } = lobbyInfo;
      const currentPlayerId = lobbyPlayerIds[currentPlayer];

      if (user.id !== currentPlayerId) {
        return { error: true, message: "Not your turn" };
      }

      const newWord = `${gameState}${gameInput.toLowerCase()}`;
      const wordExists = await checkWord(newWord);

      if (wordExists) {
        // assign state to be new word, change player
        const updateResponse = await updateLobbyStateAction(lobbyInfo.id, {
          gameState: newWord,
          currentPlayer: (currentPlayer + 1) % lobbyPlayerIds.length,
        });

        return updateResponse.error
          ? updateResponse
          : { error: false, lostRound: false };
      }
      // if word doesn't exist, increase current letter
      const nextLetter = currentLetter + 1;

      // if letter is 'z', game over
      if (nextLetter >= 26) {
        return await gameOverLoseRoundTransactionAction(
          currentPlayerId,
          lobbyId,
          { gameOver: true },
          newWord,
        );
      }

      // if word doesn't exist, increase current letter, change player, increase of player points,
      // add to prev rounds
      const { error, message } = await gameOverLoseRoundTransactionAction(
        currentPlayerId,
        lobbyId,
        {
          gameState: letters[nextLetter],
          currentLetter: nextLetter,
          currentPlayer: nextLetter % lobbyPlayerIds.length,
        },
        newWord,
      );
      if (error) {
        return { error, message };
      }

      return { error: false, lostRound: true };
    },
  )();
