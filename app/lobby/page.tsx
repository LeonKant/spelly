import {
  getLobbyInfoFromUserId,
  getLobbyPrevRounds,
  getLobbyUsernameAndPoints,
  getUserName,
} from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Lobby from "@/components/lobby/Lobby";
import { LobbyPlayersT, LobbyPlayerStatusT } from "@/types/lobby-context.type";
import { LobbySidebar } from "@/components/lobby/LobbySidebar";
import { SpellyLobbyProvider } from "@/context/LobbyContext";
import { SpellyLobbyT } from "@/types/db.type";
import { PageTemplate } from "@/components/PageTemplate";
import { SidebarProvider } from "@/components/ui/sidebar";

const LobbyPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) redirect("/");

  const userName = await getUserName(user.id);
  if (!userName) redirect("/");

  const lobbyInfo: SpellyLobbyT | undefined = await getLobbyInfoFromUserId(
    user.id,
  );
  if (!lobbyInfo) redirect("/");

  const lobbyProfiles: LobbyPlayersT<LobbyPlayerStatusT> =
    await getLobbyUsernameAndPoints(lobbyInfo.id);

  const prevRounds = await getLobbyPrevRounds(lobbyInfo.id);

  return (
    <SidebarProvider defaultOpen={false} className="relative min-h-full flex-1">
      <SpellyLobbyProvider
        userID={user.id}
        userName={userName}
        lobbyPlayers={lobbyProfiles}
        lobbyState={lobbyInfo}
        prevRoundsState={prevRounds}
      >
        <LobbySidebar />
        <PageTemplate className="flex-1 items-center">
          <Lobby />
        </PageTemplate>
      </SpellyLobbyProvider>
    </SidebarProvider>
  );
};
export default LobbyPage;
