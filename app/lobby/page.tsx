import {
  getLobbyInfoFromUserId,
  getLobbyPrevRounds,
  getLobbyUsernameAndPoints,
  getProfileInfo,
  getUserName,
} from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Lobby from "../../components/lobby/Lobby";
import { SpellyLobbyT } from "@/db/schema/spelly";
import { LobbyPlayersT, LobbyPlayerStatusT } from "@/types/lobby";
import { LobbySidebar } from "@/components/lobby/LobbySidebar";
import DefaultWrapper from "@/components/DefaultWrapper";
import { SpellyLobbyProvider } from "@/context/LobbyContext";

const LobbyPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) redirect("/");

  const userName = await getUserName(user.id);
  if (!userName) redirect("/");

  const lobbyInfo: SpellyLobbyT | undefined = await getLobbyInfoFromUserId(
    user.id
  );
  if (!lobbyInfo) redirect("/");

  const lobbyProfiles: LobbyPlayersT<LobbyPlayerStatusT> =
    await getLobbyUsernameAndPoints(lobbyInfo.id);

  const prevRounds = await getLobbyPrevRounds(lobbyInfo.id);

  // const isHost = lobbyInfo.hostId === user.id;

  return (
    <SpellyLobbyProvider
      userID={user.id}
      userName={userName}
      lobbyPlayers={lobbyProfiles}
      lobbyState={lobbyInfo}
      prevRoundsState={prevRounds}
    >
      <LobbySidebar />
      <DefaultWrapper>
        {/* <div className="flex flex-1 max-w-screen-xl"> */}
          <Lobby />
        {/* </div> */}
      </DefaultWrapper>
    </SpellyLobbyProvider>
  );
};
export default LobbyPage;
