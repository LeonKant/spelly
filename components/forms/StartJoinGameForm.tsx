"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  joinGameSchema,
  startGameSchema,
} from "@/lib/form-schemas/StartJoinGameSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { initLobby } from "@/db/queries/insert";
import { createLobbyAction, joinLobbyAction } from "@/actions/lobby";
import { getLobbyInfoFromLobbyId } from "@/db/queries/select";

interface Props {
  userID: string;
}

export default function StartJoinGameForm({ userID }: Props) {
  const [startGameState, setStartGameState] = useState<boolean>(false);
  const [joinGameState, setJoinGameState] = useState<boolean>(false);

  const startGameFormReturn = useForm<z.infer<typeof startGameSchema>>({
    resolver: zodResolver(startGameSchema),
    mode: "onChange",
    defaultValues: {
      lobbyName: "",
    },
  });

  const startGameSubmit = async (values: z.infer<typeof startGameSchema>) => {
    createLobbyAction(values.lobbyName, userID);
  };
  const joinGameSubmit = async (values: z.infer<typeof joinGameSchema>) => {
    joinLobbyAction(values.lobbyID);
  };

  const joinGameFormReturn = useForm<z.infer<typeof joinGameSchema>>({
    resolver: zodResolver(joinGameSchema),
    defaultValues: {
      lobbyID: "",
    },
    mode: "onSubmit",
  });

  if (startGameState) {
    return (
      <Form {...startGameFormReturn}>
        <form
          className="flex flex-col gap-4"
          onSubmit={startGameFormReturn.handleSubmit(startGameSubmit)}
        >
          <FormField
            name="lobbyName"
            control={startGameFormReturn.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter lobby name:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button className="flex-1" type="submit">
              Start
            </Button>
            <Button
              className="flex-1"
              variant={"destructive"}
              onClick={() => setStartGameState(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  if (joinGameState) {
    return (
      <Form {...joinGameFormReturn}>
        <form
          className="flex flex-col gap-4"
          onSubmit={joinGameFormReturn.handleSubmit(joinGameSubmit)}
        >
          <FormField
            control={joinGameFormReturn.control}
            name="lobbyID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Lobby ID:</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button className="flex-1" type="submit">
              Join
            </Button>
            <Button
              className="flex-1"
              variant={"destructive"}
              onClick={() => setJoinGameState(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button className="text-lg" onClick={() => setStartGameState(true)}>
        Create Lobby
      </Button>
      <Button className="text-lg" onClick={() => setJoinGameState(true)}>
        Join Lobby
      </Button>
    </div>
  );
}
