import { createClient } from "@/utils/supabase/server";
import StartJoinGameForm from "./forms/StartJoinGameForm";
import { checkIfUserInGame } from "@/db/queries/select";
import RejoinGameButton from "@/components/RejoinGameButton";

export default async function Hero() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if user already started game
  let gameAlreadyStarted: boolean = false;

  if (user?.id) {
    gameAlreadyStarted = await checkIfUserInGame(user?.id);
  }

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex flex-col items-center gap-16">
        <h1 className="text-6xl font-bold lg:text-7xl">Spelly</h1>
        <p className="mx-auto max-w-xl text-center text-3xl !leading-tight text-muted-foreground lg:text-4xl">
          The best word game to ever be invented
        </p>
        {!user?.id ? (
          <p className="text-zinc-100">Sign in to start gaming baybee</p>
        ) : (
          <div className="flex-1">
            {gameAlreadyStarted ? (
              <RejoinGameButton />
            ) : (
              <StartJoinGameForm />
            )}
          </div>
        )}
        <div className="my-8 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-[1px]" />
      </div>
    </div>
  );
}
