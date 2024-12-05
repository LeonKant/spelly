"use client";
import { useSpellyLobby } from "@/context/LobbyContext";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export function PrevRoundsList() {
  const { prevRoundsState } = useSpellyLobby();

  return (
    <SidebarMenu>
      {prevRoundsState.map((s) => (
        <SidebarMenuItem key={s.id}>
          <SidebarMenuButton className="cursor-default">
            <div className="overflow-x-scroll text-nowrap text-base">
              <span className="text-muted-foreground"> {s.loserUserName}</span>:{" "}
              {s.gameState}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
