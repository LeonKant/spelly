"use client";

import { useSpellyLobby } from "@/context/LobbyContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useToast } from "@/hooks/use-toast";

export default function LobbySidebarHeader() {
  const {
    lobbyState: { name: lobbyName, id: lobbyId },
  } = useSpellyLobby();

  const joinLink: string = `https://example.com/join/${lobbyId}`;
  const { toast } = useToast();

  const handleIdClick = () => {
    navigator.clipboard.writeText(lobbyId);
    toast({ title: "Lobby ID copied!" });
  };

  const handleLinkClick = () => {
    navigator.clipboard.writeText(joinLink);
    toast({ title: "Join Link copied!" });
  };

  return (
    <SidebarHeader className="mt-2">
      <span className="mx-2 font-semibold text-lg">{lobbyName}</span>

      <Collapsible defaultOpen={true} className="group/collapsible">
        <CollapsibleTrigger className="w-full">
          <SidebarGroupLabel className="flex justify-between flex-1 group/label text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            Lobby Info
            <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="min-h-fit">
                  <SidebarMenuButton
                    className="min-h-fit"
                    onClick={handleIdClick}
                  >
                    <div>
                      <span className="text-muted-foreground">ID:</span>{" "}
                      {lobbyId}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="min-h-fit">
                  <SidebarMenuButton
                    className="min-h-fit "
                    onClick={handleLinkClick}
                  >
                    <div className="max-w-full text-ellipsis">
                      <span className="text-muted-foreground">
                        Copy Join Link
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </CollapsibleContent>
      </Collapsible>
    </SidebarHeader>
  );
}
