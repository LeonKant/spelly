"use client";
import { leaveGameAction } from "@/actions/lobby";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SpellyLobbyT,
  SpellyProfileT,
} from "@/db/schema/spelly";
import { LobbySnakeToCamelCase } from "@/utils/lobby";
import { createClient } from "@/utils/supabase/client";
import {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import GameLobbyForm from "./GameLobbyForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LobbyPlayersT, LobbyPlayerStatusT } from "@/types/lobby";
import { SpellyLobbyRealtimePayloadT } from "@/types/realtime";

type OnlineStatusT = "IN_GAME" | "AFK" | "LEFT_GAME";

type ChannelUserStatusT = {
  id: string;
  userName: string;
  online_at: string;
};

export interface LobbyComponentPropsT {
  userID: string;
  userName: string;
  lobbyProfiles: LobbyPlayersT<LobbyPlayerStatusT>;
  serverLobbyState: SpellyLobbyT;
}

export default function Lobby({
  userID,
  userName,
  lobbyProfiles,
  serverLobbyState,
}: LobbyComponentPropsT) {
  const supabase = createClient();
  const { id: lobbyID } = serverLobbyState;

  const [channelUsersState, setChannelUsersState] = useState<
    ChannelUserStatusT[]
  >([]);
  const [lobbyState, setLobbyState] = useState<SpellyLobbyT>(serverLobbyState);
  const [lobbyPlayers, setLobbyPlayers] =
    useState<LobbyPlayersT<Partial<LobbyPlayerStatusT>>>(lobbyProfiles);

  const initUserNameCache = Object.entries(lobbyProfiles).reduce(
    (prev, [id, value]) => {
      prev[id] = value.username;
      return prev;
    },
    {} as { [id: string]: string }
  );
  const [userNameCacheState, setUserNameCacheState] = useState<{
    [key: string]: string;
  }>(initUserNameCache);

  const userStatus: ChannelUserStatusT = {
    userName,
    id: userID,
    online_at: new Date().toISOString(),
  };

  const channelRef = useRef<RealtimeChannel>();

  const handleLobbyPlayerInsertOrUpdate = (
    payload:
      | RealtimePostgresInsertPayload<{
          [key: string]: any;
        }>
      | RealtimePostgresUpdatePayload<{
          [key: string]: any;
        }>
  ) => {
    if (payload?.new?.points < 0) {
      console.log("User points not found");
      return;
    }

    if (!!!payload?.new?.user_id) {
      console.log("User id not found");
      return;
    }

    setLobbyPlayers((prev) => {
      prev[payload.new.user_id] = { points: payload.new.points };
      return prev;
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
            payload.new as SpellyLobbyRealtimePayloadT
          );
          setLobbyState(newLobbyState);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "spelly",
          table: "lobby_players",
          filter: `lobby_id=eq.${lobbyID}`,
        },
        handleLobbyPlayerInsertOrUpdate
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "spelly",
          table: "lobby_players",
          filter: `lobby_id=eq.${lobbyID}`,
        },
        handleLobbyPlayerInsertOrUpdate
      )
      .on("presence", { event: "sync" }, () => {
        const clients = channel.presenceState();

        const users = Object.entries(clients).map(([_, value]) => {
          const { presence_ref, ...status } = value?.[0] as {
            presence_ref: string;
          } & ChannelUserStatusT;

          return status;
        });

        setChannelUsersState(users);

        console.log("Synced presence state: ", channel.presenceState());
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
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe(async () => {
        const presenceTrackStatus = await channel.track(userStatus);
        console.log(presenceTrackStatus);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-1 justify-center">
      <div className="min-w-fit basis-1/5">
        <SidebarTrigger className="min-w-fit min-h-fit p-2 [&_svg]:size-8 [&_svg]:shrink-1 text-lg">
          {/* Lobby Options */}
        </SidebarTrigger>
      </div>

      {/* <h1 className="mt-9">Users in channel</h1>
      <div className="flex flex-col gap-4">
        {channelUsersState.map((user, ind) => (
          <p key={ind}>
            {user.id} {user.userName}
          </p>
        ))}
      </div>
      <h1 className="mt-9">Username Cache</h1>
      <div className="flex flex-col gap-4 mb-5">
        {Object.keys(lobbyPlayers).map((id) => (
          <p key={id}>
            {id} {userNameCacheState[id] ?? "no username found"}
          </p>
        ))}
      </div>
      <pre>{JSON.stringify(lobbyState, null, 3)}</pre> */}

      <div className="flex flex-col justify-center basis-3/5">
        <GameLobbyForm lobbyState={lobbyState} userID={userID} />
      </div>
      <div className="basis-1/5">
        <Accordion
          type="single"
          collapsible
          defaultValue="player-names"
          title="lobby-players"
        >
          <AccordionItem value="player-names">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex-1 text-center">Players</div>
            </AccordionTrigger>
            <AccordionContent>
              {lobbyState.lobbyPlayerIds.map((id) => (
                <p key={id}>
                  {userNameCacheState[id]} points: {lobbyPlayers[id]?.points}
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <h1 className="mt-9">Users In Lobby</h1>
        <div className="flex flex-col gap-4 mb-5">
          {lobbyState.lobbyPlayerIds.map((id) => (
            <p key={id}>{userNameCacheState[id]}</p>
          ))}
        </div>
        <Button
          onClick={() => {
            leaveGameAction();
          }}
        >
          Leave Game
        </Button>
      </div>
    </div>
  );
}
