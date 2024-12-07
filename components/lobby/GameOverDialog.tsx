"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { useSpellyLobby } from "@/context/LobbyContext";
import { useEffect, useState } from "react";

export function GameOverDialog() {
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const {
    lobbyState: { gameOver },
    lobbyPlayers,
    userNameCacheState,
  } = useSpellyLobby();

  useEffect(() => {
    if (gameOver) {
      const winners: string[] = [];

      const maxPoints: number = Math.max(
        ...Object.entries(lobbyPlayers)
          .map(([_, player]) => player.points)
          .filter((p) => p !== undefined),
      );
      Object.entries(lobbyPlayers).map(([id, player]) => {
        if (player.points === maxPoints) {
          winners.push(id);
        }
      });

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
  }, [gameOver]);

  return (
    <Dialog open={openDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Over</DialogTitle>
          <DialogDescription>{gameOverMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpenDialog(false)}
            >
              Continue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
