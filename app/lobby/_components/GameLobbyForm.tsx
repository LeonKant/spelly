"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SpellyLobbyT } from "@/db/schema/spelly";
import { gameLobbySchema } from "@/lib/form-schemas/GameLobbyScema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  lobbyState: SpellyLobbyT;
  userID: string;
}
export default function GameLobbyForm({ lobbyState, userID }: Props) {
  const { gameState, lobbyPlayerIds, currentPlayer } = lobbyState;

  const gameLobbyFormReturn = useForm<z.infer<typeof gameLobbySchema>>({
    resolver: zodResolver(gameLobbySchema),
    mode: "onChange",
    defaultValues: { gameInput: "" },
  });

  return (
    <Form {...gameLobbyFormReturn}>
      <form className="mx-1">
        <FormField
          name="gameInput"
          control={gameLobbyFormReturn.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Input</FormLabel>
              <FormControl>
                <div
                  className={`flex w-fit h-10 rounded-md border-2 border-input bg-background px-3 
                    py-2 text-sm ring-offset-background has-[:focus]:outline-none 
                    has-[:focus]:ring-2 has-[:focus]:ring-ring has-[:focus]:ring-offset-2 
                    has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50`}
                >
                  {gameState}
                  <input
                    disabled={userID !== lobbyPlayerIds[currentPlayer]}
                    {...field}
                    maxLength={1}
                    className={`border-none bg-inherit outline-none 
                      file:border-0 file:bg-transparent file:text-sm file:font-medium 
                      placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
