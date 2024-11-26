import { getLobbyInfo, getUserName } from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Lobby = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) redirect("/");

  const userName = await getUserName(user.id);

  if (!userName) redirect("/");

  const lobbyInfo = await getLobbyInfo(user.id);

  return (
    <div className="flex-1">
      <div>
        <h1>Lobby name: {lobbyInfo?.[0]?.name ?? "lobby not found"} </h1>
        <h1>User name: {userName ?? "username not found"}</h1>
      </div>
    </div>
  );
};
export default Lobby;
