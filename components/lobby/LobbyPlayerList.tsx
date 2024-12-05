"use client";
import { useSpellyLobby } from "@/context/LobbyContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function LobbyPlayerList() {
  const { lobbyState, userNameCacheState, lobbyPlayers } = useSpellyLobby();

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="player-names"
      title="lobby-players"
    >
      <AccordionItem value="player-names">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex-1 text-center text-xl">Players</div>
        </AccordionTrigger>
        <AccordionContent className="gap-4">
          <div className="flex flex-col gap-4">
            {lobbyState.lobbyPlayerIds.map((id) => (
              <div
                className="min-w-fit rounded-lg border bg-secondary p-3 text-lg"
                key={id}
              >
                <span className="font-semibold">{userNameCacheState[id]}:</span>{" "}
                {lobbyPlayers[id]?.points}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
