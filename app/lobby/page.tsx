import { getLobbyInfoFromUserId, getUserName } from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DeleteLobbyButton from "./_components/DeleteLobbyButton";
import LobbyTest from "./_components/LobbyTest";

const Lobby = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) redirect("/");

  const userName = await getUserName(user.id);
  if (!userName) redirect("/");

  const lobbyInfo = await getLobbyInfoFromUserId(user.id);
  if (!lobbyInfo) redirect("/");

  // const isHost = lobbyInfo.hostId === user.id;

  return (
    <div className="flex-1">
      <div>
        <h1>Lobby name: {lobbyInfo.name ?? "lobby name not found"} </h1>
        {/* <h1>Host user name: {userName ?? "username not found"}</h1> */}
        <h1>Lobby ID: {lobbyInfo.id}</h1>
        {/* {isHost && <DeleteLobbyButton userID={user.id} />} */}
        <LobbyTest userID={user.id} userName={userName} />
      </div>
    </div>
  );
};
export default Lobby;
