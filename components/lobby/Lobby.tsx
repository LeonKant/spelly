"use client";
import GameLobbyForm from "../forms/GameLobbyForm";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useSpellyLobby } from "@/context/LobbyContext";
import { LobbyPlayerList } from "./LobbyPlayerList";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Lobby() {
  const { lobbyState, userID } = useSpellyLobby();

  const isMobile = useIsMobile();

  const { state: sidebarState } = useSidebar();

  return (
    <div
      className={`flex max-w-screen-xl mx-auto p-8 flex-1 ${isMobile && "flex-col"} justify-between`}
    >
      <div
        className={`min-w-fit basis-1/5 ${sidebarState === "collapsed" && ''}`}
      >
        <SidebarTrigger className="min-w-fit min-h-fit p-2 [&_svg]:size-8 [&_svg]:shrink-1 text-lg" />
      </div>
      <div className="flex flex-col justify-center w-full px-4 basis-3/5">
        <GameLobbyForm lobbyState={lobbyState} userID={userID} />
      </div>
      <div className="basis-1/5 px-2">
        <LobbyPlayerList />
      </div>
    </div>
  );
}
