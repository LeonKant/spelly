import {
  getLobbyInfoFromUserId,
  getProfileInfo,
  getUserName,
} from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DeleteLobbyButton from "./_components/DeleteLobbyButton";
import Lobby from "./_components/Lobby";
import { SpellyLobbyT } from "@/db/schema/spelly";

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

  const rawLobbyProfiles = await getProfileInfo(lobbyInfo.lobbyPlayerIds);

  // map id -> username
  const lobbyProfiles = rawLobbyProfiles
    .map((profile) => {
      const newProfile: { [key: string]: string } = {};

      if (!!!profile?.id || !!!profile.username) return;

      newProfile[profile.id] = profile.username;
      return newProfile;
    })
    .filter((p) => p !== undefined);

  const isHost = lobbyInfo.hostId === user.id;

  return (
    <div className="flex-1">
      <div className="">
        <h1>Lobby name: {lobbyInfo.name ?? "lobby name not found"} </h1>
        {/* <h1>Host user name: {userName ?? "username not found"}</h1> */}
        <h1>Lobby ID: {lobbyInfo.id}</h1>
        <Lobby
          userID={user.id}
          userName={userName}
          lobbyID={lobbyInfo.id}
          lobbyProfiles={lobbyProfiles}
        />
      </div>
      {isHost && <DeleteLobbyButton />}
    </div>
  );
};
export default LobbyPage;
