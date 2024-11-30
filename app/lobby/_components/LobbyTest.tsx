"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type UserStatusT = {
  userName: string;
  online_at: string;
};

export default function LobbyTest({
  userID,
  userName,
}: {
  userID: string;
  userName: string;
}) {
  const supabase = createClient();
  const [usersState, setUsersState] = useState<
    { key: string; userName: string }[]
  >([]);

  const userStatus = {
    userName,
    online_at: new Date().toISOString(),
  };

  useEffect(() => {
    const channel = supabase.channel("test-lobbyID", {
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
          { key, userName: newPresences?.[0]?.userName },
        ]);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
        setUsersState((prevUsers) => prevUsers.filter((pu) => key !== pu.key));
      })
      .subscribe(async (status) => {
        const presenceTrackStatus = await channel.track(userStatus);
        console.log(presenceTrackStatus);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="">
      {usersState.map((user, ind) => (
        <p key={ind}>
          {user.key} {user.userName}
        </p>
      ))}
    </div>
  );
}
