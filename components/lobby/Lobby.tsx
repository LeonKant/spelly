"use client";
import GameLobbyForm from "../forms/GameLobbyForm";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { LobbyPlayerList } from "./LobbyPlayerList";
import { GameOverDialog } from "./GameOverDialog";

export default function Lobby() {
  return (
    <div
      className={`mx-auto flex max-w-screen-xl flex-1 flex-col justify-between p-8 lg:flex-row`}
    >
      <div className={`min-w-fit basis-1/5`}>
        <SidebarTrigger className="[&_svg]:shrink-1 min-h-fit min-w-fit p-2 text-lg [&_svg]:size-8" />
      </div>
      <div className="my-8 flex w-full basis-3/5 flex-col justify-center items-center">
        <GameLobbyForm />
        <GameOverDialog />
      </div>
      <div className="flex basis-1/5 justify-center px-2">
        <LobbyPlayerList />
      </div>
    </div>
  );
}
