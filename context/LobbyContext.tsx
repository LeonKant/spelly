"use client";
import {
  SpellyLobbyRealtimePayloadT,
  SpellyPrevRoundRealtimePayloadT,
} from "@/types/realtime.type";
import {
  ChannelUserStatusT,
  LobbyPlayersT,
  LobbyPlayerStatusT,
  SpellyLobbyContextPropsT,
  SpellyLobbyContextT,
} from "@/types/lobby-context.type";
import {
  LobbySnakeToCamelCase,
  PrevRoundsSnakeToCamelCase,
} from "@/utils/lobby";
import { createClient } from "@/utils/supabase/client";
import {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { redirect } from "next/navigation";
import { SpellyLobbyPrevRoundT, SpellyLobbyT } from "@/types/db.type";

const SpellyLobbyContext = createContext<SpellyLobbyContextT | null>(null);

export const useSpellyLobby = () => {
  const context = useContext(SpellyLobbyContext);
  if (!context) {
    throw new Error(
      "useSpellyLobby must be used within a SpellyLobbyProvider.",
    );
  }

  return context;
};

export const SpellyLobbyProvider = ({
  userID,
  userName,
  lobbyPlayers: serverLobbyPlayers,
  lobbyState: serverLobbyState,
  prevRoundsState: serverPrevRoundsState,
  children,
}: SpellyLobbyContextPropsT & PropsWithChildren) => {
  const supabase = createClient();
  const { id: lobbyID } = serverLobbyState;

  const [subscriptionWaiting, setSubscriptionWaiting] = useState<boolean>(true);
  const [lobbyState, setLobbyState] = useState<SpellyLobbyT>(serverLobbyState);
  const [lobbyPlayers, setLobbyPlayers] =
    useState<LobbyPlayersT<Partial<LobbyPlayerStatusT>>>(serverLobbyPlayers);
  const [prevRoundsState, setPrevRoundsState] = useState<
    SpellyLobbyPrevRoundT[]
  >(serverPrevRoundsState);

  const initUserNameCache = Object.entries(serverLobbyPlayers).reduce(
    (prev, [id, value]) => {
      prev[id] = value.username;
      return prev;
    },
    {} as { [id: string]: string },
  );
  const [userNameCacheState, setUserNameCacheState] = useState<{
    [key: string]: string;
  }>(initUserNameCache);

  const userStatus: ChannelUserStatusT = {
    userName,
    id: userID,
    online_at: new Date().toISOString(),
  };

  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleLobbyPlayerInsertOrUpdate = (
    payload:
      | RealtimePostgresInsertPayload<{
          [key: string]: any;
        }>
      | RealtimePostgresUpdatePayload<{
          [key: string]: any;
        }>,
  ) => {
    const { points, user_id } = payload.new;

    if (points < 0 || !!!user_id) return;

    setLobbyPlayers((prev) => {
      const newPlayers = { ...prev };
      newPlayers[user_id] = {
        ...newPlayers[user_id],
        points: payload.new.points,
      };
      return newPlayers;
    });
  };

  useEffect(() => {
    channelRef.current = supabase.channel(`lobby-${lobbyID}`, {
      config: {
        presence: {
          key: userID,
        },
      },
    });

    const { current: channel } = channelRef;

    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "spelly",
          table: "lobbies",
          filter: `id=eq.${lobbyID}`,
        },
        (payload) => {
          const newLobbyState = LobbySnakeToCamelCase(
            payload.new as SpellyLobbyRealtimePayloadT,
          );

          setLobbyState(newLobbyState);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "spelly",
          table: "lobby_players",
          filter: `lobby_id=eq.${lobbyID}`,
        },
        handleLobbyPlayerInsertOrUpdate,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "spelly",
          table: "lobby_players",
          filter: `lobby_id=eq.${lobbyID}`,
        },
        handleLobbyPlayerInsertOrUpdate,
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "spelly",
          table: "lobby_prev_rounds",
          filter: `lobby_id=eq.${lobbyID}`,
        },
        (payload) => {
          const newPrevRound = PrevRoundsSnakeToCamelCase(
            payload.new as SpellyPrevRoundRealtimePayloadT,
          );

          setPrevRoundsState((prev) => [...prev, newPrevRound]);
        },
      )
      .on("presence", { event: "sync" }, () => {
        // const clients = channel.presenceState();
        // const users = Object.entries(clients).map(([_, value]) => {
        //   const { presence_ref, ...status } = value?.[0] as {
        //     presence_ref: string;
        //   } & ChannelUserStatusT;
        //   return status;
        // });
        // setChannelUsersState(users);
        // console.log("Synced presence state: ", channel.presenceState());
      })
      .on("broadcast", { event: "reset-game" }, () => {
        setPrevRoundsState([]);
      })
      .on("broadcast", { event: "end-game" }, () => {
        redirect("/");
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);

        if (!!!userNameCacheState[key]) {
          setUserNameCacheState((prev) => {
            const newName: { [key: string]: string } = {};
            newName[key] = newPresences?.[0]?.userName ?? "";
            return { ...prev, ...newName };
          });
        }
      })
      .subscribe(async (status, err) => {
        if (status === "SUBSCRIBED") {
          setSubscriptionWaiting(false);
        }
        await channel.track(userStatus);
        // const presenceTrackStatus = await channel.track(userStatus);
        // console.log(presenceTrackStatus);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SpellyLobbyContext.Provider
      value={{
        subscriptionWaiting,
        userID,
        lobbyState,
        userName,
        lobbyPlayers,
        userNameCacheState,
        prevRoundsState,
        isHost: userID === lobbyState.hostId,
      }}
    >
      {children}
    </SpellyLobbyContext.Provider>
  );
};
