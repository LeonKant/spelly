"use client";
import GameLobbyForm from "../forms/GameLobbyForm";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useSpellyLobby } from "@/context/LobbyContext";
import { LobbyPlayerList } from "./LobbyPlayerList";

export default function Lobby() {
  const { lobbyState, userID } = useSpellyLobby();

  return (
    <div
      className={`flex max-w-screen-xl mx-auto p-8 flex-1 lg:flex-row flex-col justify-between`}
    >
      <div
        className={`min-w-fit basis-1/5`}
      >
        <SidebarTrigger className="min-w-fit min-h-fit p-2 [&_svg]:size-8 [&_svg]:shrink-1 text-lg" />
      </div>
      <div className="flex flex-col justify-center w-full basis-3/5 my-8">
        <GameLobbyForm lobbyState={lobbyState} userID={userID} />
      </div>
      <div className="basis-1/5 px-2 min-w-fit">
        <LobbyPlayerList />
      </div>
    </div>
  );
}
