import {
  ActionResponse,
  ClientAndLobbyInfoT,
  ClientInfoT,
  WithoutErrorParamsT,
} from "@/types/lobby-actions.type";
import { createClient } from "../supabase/server";
import { getLobbyInfoFromUserId } from "@/db/queries/select";

async function getClientInfo(): Promise<ActionResponse<ClientInfoT>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { error: true, message: "User not signed in." };
  }

  return { error: false, supabase, user };
}

export const withClientInfo =
  <T extends WithoutErrorParamsT = {}>(
    callback: (input: ClientInfoT) => Promise<ActionResponse<T>>,
  ): (() => Promise<ActionResponse<T>>) =>
  async () => {
    const { error, message, supabase, user } = await getClientInfo();
    if (error) return { error: true, message };

    return callback({ supabase, user });
  };

export const withClientAndLobbyInfo =
  <T extends WithoutErrorParamsT = {}>(
    callback: (input: ClientAndLobbyInfoT) => Promise<ActionResponse<T>>,
    options?: { checkIfHost: boolean },
  ): (() => Promise<ActionResponse<T>>) =>
  async () => {
    const {
      error: clientError,
      message,
      supabase,
      user,
    } = await getClientInfo();
    if (clientError) return { error: true, message };

    // get lobby info from lobby_players
    const lobbyInfo = await getLobbyInfoFromUserId(user.id);

    // user not in game
    if (!lobbyInfo) return { error: true, message: "User not in game." };

    // user not host
    if (options?.checkIfHost && lobbyInfo.hostId !== user.id)
      return { error: true, message: "User not host." };

    return await callback({ supabase, user, lobbyInfo });
  };
