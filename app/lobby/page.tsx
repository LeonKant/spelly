import {
  getLobbyInfoFromUserId,
  getLobbyUsernameAndPoints,
  getProfileInfo,
  getUserName,
} from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DeleteLobbyButton from "./_components/DeleteLobbyButton";
import Lobby from "./_components/Lobby";
import { SpellyLobbyT } from "@/db/schema/spelly";
import { LobbyPlayersT, LobbyPlayerStatusT } from "@/types/lobby";

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

  const isHost = lobbyInfo.hostId === user.id;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1">
        <h1>Lobby name: {lobbyInfo.name ?? "lobby name not found"} </h1>
        {/* <h1>Host user name: {userName ?? "username not found"}</h1> */}
        <h1>Lobby ID: {lobbyInfo.id}</h1>
        <Lobby
          userID={user.id}
          userName={userName}
          lobbyID={lobbyInfo.id}
          lobbyProfiles={lobbyProfiles}
          serverLobbyState={lobbyInfo}
        />
      </div>
      {isHost && <DeleteLobbyButton />}
    </div>
  );
};
export default LobbyPage;
