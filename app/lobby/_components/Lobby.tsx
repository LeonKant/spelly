"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type UserStatusT = {
  id: string;
  userName: string;
  online_at: string;
};

export default function Lobby({
  userID,
  userName,
  lobbyID,
}: {
  userID: string;
  userName: string;
  lobbyID: string;
}) {
  const supabase = createClient();
  const [usersState, setUsersState] = useState<UserStatusT[]>([]);

  const userStatus: UserStatusT = {
    userName,
    id: userID,
    online_at: new Date().toISOString(),
  };

  useEffect(() => {
    const channel = supabase.channel(`test-${lobbyID}`, {
      config: {
        presence: {
          key: userID,
        },
      },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const test = payload;
          console.log(test);
        }
      )
      .on("presence", { event: "sync" }, () => {
        console.log("Synced presence state: ", channel.presenceState());
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
        setUsersState((prevUsers) => [
          ...prevUsers,
          {
            id: key,
            userName: newPresences?.[0]?.userName,
            online_at: newPresences?.[0]?.online_at,
          },
        ]);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
        setUsersState((prevUsers) => prevUsers.filter((pu) => key !== pu.id));
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
    <div className="flex-col gap-4">
      {usersState.map((user, ind) => (
        <p key={ind}>
          {user.id} {user.userName}
        </p>
      ))}
    </div>
  );
}
