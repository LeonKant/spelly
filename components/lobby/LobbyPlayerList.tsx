"use client";
import { useSpellyLobby } from "@/context/LobbyContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function LobbyPlayerList() {
  const {
    lobbyState: { lobbyPlayerIds, currentPlayer },
    userNameCacheState,
    lobbyPlayers,
  } = useSpellyLobby();

  const currentPlayerId = lobbyPlayerIds[currentPlayer];

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="player-names"
      title="lobby-players"
      className="max-w-md w-full"
    >
      <AccordionItem value="player-names">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex-1 text-center text-xl">Players</div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            {lobbyPlayerIds.map((id) => (
              <div
                className={`flex min-w-fit gap-1 rounded-lg border px-6 ${currentPlayerId === id && "bg-secondary"} justify-between p-3 text-lg`}
                key={id}
              >
                <span className="font-semibold">{userNameCacheState[id]}:</span>
                <span>{lobbyPlayers[id]?.points}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
