"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useSpellyLobby } from "@/context/LobbyContext";
import { useEffect, useState } from "react";
import {
  hostEndGameAction,
  hostResetGameAction,
  leaveGameAction,
} from "@/actions/lobby";
import { useLobbyAudio } from "@/context/LobbyAudioContext";

export function GameOverDialog() {
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const {
    lobbyState: { gameOver },
    lobbyPlayers,
    userNameCacheState,
    isHost,
    userID,
  } = useSpellyLobby();

  const { playGameEndMusic } = useLobbyAudio();

  useEffect(() => {
    if (gameOver) {
      const winners: string[] = [];

      const minPoints: number = Math.min(
        ...Object.entries(lobbyPlayers).map(
          ([_, player]) => player?.points ?? 27,
        ),
      );
      Object.entries(lobbyPlayers).forEach(([id, player]) => {
        if (player.points === minPoints) {
          winners.push(id);
        }
      });

      playGameEndMusic(winners.includes(userID));

      const gameOverMessage =
        winners.length === 1
          ? `${userNameCacheState[winners[0]]} is the winner!`
          : `${
              winners.length === 2
                ? `${userNameCacheState[winners[0]]} and ${userNameCacheState[winners[1]]}`
                : winners
                    .map((w, ind) =>
                      ind === winners.length - 1
                        ? `and ${userNameCacheState[w]}`
                        : `${userNameCacheState[w]}, `,
                    )
                    .join("")
            } are the winners!`;

      setGameOverMessage(gameOverMessage);
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  }, [gameOver, lobbyPlayers]);

  return (
    <Dialog open={openDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Over</DialogTitle>
          <DialogDescription>{gameOverMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4 sm:justify-start sm:gap-2">
          {isHost ? (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => hostResetGameAction()}
              >
                Play Again
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => hostEndGameAction()}
              >
                End Game
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => leaveGameAction()}
            >
              Leave Game
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
