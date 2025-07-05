"use client";
import GameLobbyForm from "../forms/GameLobbyForm";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LobbyPlayerList } from "./LobbyPlayerList";
import { GameOverDialog } from "./GameOverDialog";
import { useSpellyLobby } from "@/context/LobbyContext";
import { LoaderCircle } from "lucide-react";

export default function Lobby() {
  const {
    subscriptionWaiting,
    userNameCacheState,
    lobbyState: { currentPlayer, lobbyPlayerIds, gameStarted },
    userID,
  } = useSpellyLobby();

  if (subscriptionWaiting) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2">
        <span>Loading</span>
        <LoaderCircle className="w-fit animate-spin" />
      </div>
    );
  }
  const currPlayerUserName = userNameCacheState[lobbyPlayerIds[currentPlayer]];
  const yourTurn = userID === lobbyPlayerIds[currentPlayer];

  return (
    <div
      className={`relative flex w-full max-w-(--breakpoint-xl) flex-1 flex-col justify-between px-12 lg:flex-row`}
    >
      <div className={`min-w-fit basis-1/5`}>
        <SidebarTrigger className="min-h-fit min-w-fit p-2 text-lg [&_svg]:size-7 [&_svg]:shrink-1" />
      </div>
      <div className="my-8 flex w-full basis-3/5 flex-col items-center justify-center gap-2">
        {gameStarted && (
          <p>{yourTurn ? "Your turn" : `${currPlayerUserName}'s turn`}</p>
        )}
        <GameLobbyForm />
        <GameOverDialog />
      </div>
      <div className="flex basis-1/5 justify-center px-2">
        <LobbyPlayerList />
      </div>
    </div>
  );
}
