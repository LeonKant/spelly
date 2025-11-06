import { db } from "@/config/db.config";
import {
  incrementPlayerPoints,
  resetLobbyPlayerPoints,
  updateLobbyState,
} from "./update";
import { deletePrevRounds } from "./delete";
import { LobbyInfoUpdateT, SpellyLobbyT } from "@/types/db.type";
import { addToPrevRounds } from "./insert";

const initLobbyState: Partial<SpellyLobbyT> = {
  currentLetter: 0,
  currentPlayer: 0,
  gameState: "a",
  gameOver: false,
};
export const resetGameTransaction = async (lobbyId: string) => {
  await db.transaction(async (tx) => {
    await Promise.all([
      updateLobbyState(lobbyId, initLobbyState, tx),
      resetLobbyPlayerPoints(lobbyId, tx),
      deletePrevRounds(lobbyId, tx),
    ]);
  });
};
export const gameOverLoseRoundTransaction = async (
  playerId: string,
  lobbyId: string,
  lobbyInfo: LobbyInfoUpdateT,
  gameState: string,
) => {
  await db.transaction(async (tx) => {
    await Promise.all([
      updateLobbyState(lobbyId, lobbyInfo, tx),
      incrementPlayerPoints(playerId, lobbyId, tx),
      addToPrevRounds(
        playerId,
        {
          gameState,
          lobbyId,
        },
        tx,
      ),
    ]);
  });
};
