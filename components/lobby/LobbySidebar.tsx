"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PrevRoundsList } from "./PrevRoundsList";
import { useSpellyLobby } from "@/context/LobbyContext";
import LobbySidebarHeader from "./LobbySidebarHeader";
import { hostEndGameAction, leaveGameAction } from "@/actions/lobby";

export function LobbySidebar() {
  const {
    userID,
    lobbyState: { name: lobbyName, hostId, id: lobbyId },
  } = useSpellyLobby();
  return (
    <Sidebar className="top-16 bottom-20 h-auto flex-1" variant="floating">
      <LobbySidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">
            Previous Rounds
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <PrevRoundsList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-12 md:mb-0">
        <SidebarGroupLabel className="text-sm">Game Options</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="cursor-pointer text-base"
                onClick={() => leaveGameAction()}
              >
                <span>Leave Game</span>
              </SidebarMenuButton>
              {hostId === userID && (
                <SidebarMenuButton
                  asChild
                  className="text-destructive cursor-pointer text-base"
                  onClick={() => hostEndGameAction()}
                >
                  <span>End Game</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
