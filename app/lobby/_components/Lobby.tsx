"use client";
import { leaveGameAction } from "@/actions/lobby";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LobbyRealtimePayloadT,
  SpellyLobbyT,
  SpellyProfileT,
} from "@/db/schema/spelly";
import { LobbySnakeToCamelCase } from "@/utils/lobby";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import GameLobbyForm from "./GameLobbyForm";

type OnlineStatusT = "IN_GAME" | "AFK" | "LEFT_GAME";

type ChannelUserStatusT = {
  id: string;
  userName: string;
  online_at: string;
};

export default function Lobby({
  userID,
  userName,
  lobbyID,
  lobbyProfiles,
  serverLobbyState,
}: {
  userID: string;
  userName: string;
  lobbyID: string;
  lobbyProfiles: { [key: string]: string };
  serverLobbyState: SpellyLobbyT;
}) {
  const supabase = createClient();
  const [channelUsersState, setChannelUsersState] = useState<
    ChannelUserStatusT[]
  >([]);
  const [lobbyState, setLobbyState] = useState<SpellyLobbyT>(serverLobbyState);
  const [userNameCacheState, setUserNameCacheState] = useState<{
    [key: string]: string;
  }>(lobbyProfiles);

  const userStatus: ChannelUserStatusT = {
    userName,
    id: userID,
    online_at: new Date().toISOString(),
  };

  const channelRef = useRef<RealtimeChannel>();

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
          // const test = payload;
          const newLobbyState = LobbySnakeToCamelCase(
            payload.new as LobbyRealtimePayloadT
          );
          setLobbyState(newLobbyState);
        }
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
        // setUsersState((prevUsers) => prevUsers.filter((pu) => key !== pu.id));
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
    <>
      <h1 className="mt-9">Users in channel</h1>
      <div className="flex flex-col gap-4">
        {channelUsersState.map((user, ind) => (
          <p key={ind}>
            {user.id} {user.userName}
          </p>
        ))}
      </div>
      <h1 className="mt-9">Username Cache</h1>
      <div className="flex flex-col gap-4 mb-5">
        {Object.entries(userNameCacheState).map(([id, value]) => (
          <p key={id}>
            {id} {value}
          </p>
        ))}
      </div>
      <pre>{JSON.stringify(lobbyState, null, 3)}</pre>

      <h1 className="mt-9">Users In Lobby</h1>
      <div className="flex flex-col gap-4 mb-5">
        {lobbyState.lobbyPlayerIds.map((id) => (
          <p key={id}>
            {userNameCacheState[id]}
          </p>
        ))}
      </div>
      <div>
        <GameLobbyForm lobbyState={lobbyState} userID={userID} />
      </div>

      <Button
        onClick={() => {
          leaveGameAction();
        }}
      >
        Leave Game
      </Button>
    </>
  );
}
