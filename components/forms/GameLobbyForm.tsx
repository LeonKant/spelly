"use client";

import { playerTurnSubmitAction, startGameAction } from "@/actions/lobby";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSpellyLobby } from "@/context/LobbyContext";
import { gameLobbySchema } from "@/lib/form-schemas/GameLobbyScema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function GameLobbyForm() {
  const {
    userID,
    lobbyState: {
      gameState,
      lobbyPlayerIds,
      currentPlayer,
      gameStarted,
      hostId,
      gameOver,
    },
  } = useSpellyLobby();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [startingGame, setStartingGame] = useState<boolean>(false);

  if (lobbyPlayerIds[currentPlayer] === userID) {
    inputRef.current?.focus();
  }

  const gameLobbyFormReturn = useForm<z.infer<typeof gameLobbySchema>>({
    resolver: zodResolver(gameLobbySchema),
    mode: "onChange",
    defaultValues: { gameInput: "" },
  });

  const currentUserTurn = userID === lobbyPlayerIds[currentPlayer];

  const handlePlayerTurnSubmit = async (
    values: z.infer<typeof gameLobbySchema>,
  ) => {
    const { error } = await playerTurnSubmitAction(values);
    gameLobbyFormReturn.resetField("gameInput");
  };

  useEffect(() => {
    gameLobbyFormReturn.reset();
  }, [gameState]);

  return (
    <Form {...gameLobbyFormReturn}>
      <form
        className="flex w-full max-w-screen-sm flex-col items-center gap-4 md:max-w-screen-md"
        autoComplete="off"
        onSubmit={gameLobbyFormReturn.handleSubmit(handlePlayerTurnSubmit)}
      >
        <FormField
          name="gameInput"
          control={gameLobbyFormReturn.control}
          render={({ field: { ref, ...rest } }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex w-full items-center rounded-md border-2 border-input bg-background px-3 py-2 text-2xl ring-offset-background has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus]:outline-none has-[:focus]:ring-2 has-[:focus]:ring-ring has-[:focus]:ring-offset-2">
                  {gameState}
                  <input
                    inputMode="text"
                    disabled={!currentUserTurn || !gameStarted || gameOver}
                    autoCapitalize="off"
                    ref={(e) => {
                      ref(e);
                      inputRef.current = e;
                    }}
                    {...rest}
                    maxLength={1}
                    className={`border-none bg-inherit outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!gameStarted && userID === hostId ? (
          <Button
            className="w-fit text-lg"
            disabled={startingGame}
            onClick={async () => {
              setStartingGame(true);
              await startGameAction();
              setStartingGame(false);
            }}
          >
            {startingGame ? "Starting Game..." : "Start Game"}
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-fit text-lg"
            disabled={
              !gameStarted ||
              !currentUserTurn ||
              !gameLobbyFormReturn.formState.isValid ||
              gameLobbyFormReturn.formState.isSubmitting
            }
          >
            {gameLobbyFormReturn.formState.isSubmitting
              ? "Submitting..."
              : "Submit"}
          </Button>
        )}
      </form>
    </Form>
  );
}
