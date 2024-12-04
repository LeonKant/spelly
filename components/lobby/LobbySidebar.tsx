import DeleteLobbyButton from "@/app/lobby/_components/DeleteLobbyButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PrevRoundsList } from "./PrevRoundsList";

// interface Props {
//   lobbyID: string;
// }

export function LobbySidebar(
// { lobbyID  }: Props
) {

  
  return (
    <Sidebar variant="floating">
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
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">
            Game Options
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="cursor-pointer text-base">
                  <span>Leave Game</span>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  className="cursor-pointer text-base text-destructive"
                >
                  <span>End Game</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
