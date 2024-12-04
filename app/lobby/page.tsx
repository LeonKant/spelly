import {
  getLobbyInfoFromUserId,
  getLobbyUsernameAndPoints,
  getProfileInfo,
  getUserName,
} from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Lobby, { LobbyComponentPropsT } from "./_components/Lobby";
import { SpellyLobbyT } from "@/db/schema/spelly";
import { LobbyPlayersT, LobbyPlayerStatusT } from "@/types/lobby";
import { LobbySidebar } from "@/components/lobby/LobbySidebar";
import DefaultWrapper from "@/components/DefaultWrapper";

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

  // const isHost = lobbyInfo.hostId === user.id;

  return (
    <>
      <LobbySidebar />
      <DefaultWrapper>
        <div className="flex flex-col flex-1 m-4 text-lg">
          {/* <h1>Lobby name: {lobbyInfo.name ?? "lobby name not found"} </h1> */}
          {/* <h1>Host user name: {userName ?? "username not found"}</h1> */}
          <h1>Lobby ID: {lobbyInfo.id}</h1>

          <Lobby
            userID={user.id}
            userName={userName}
            lobbyProfiles={lobbyProfiles}
            serverLobbyState={lobbyInfo}
          />
        </div>
      </DefaultWrapper>
    </>
  );
};
export default LobbyPage;
