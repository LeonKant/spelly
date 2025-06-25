import { createClient } from "@/utils/supabase/server";
import StartJoinGameForm from "./forms/StartJoinGameForm";
import { checkIfUserInGame } from "@/db/queries/select";
import RejoinGameButton from "@/components/RejoinGameButton";

export async function Hero() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if user already started game
  let gameAlreadyStarted: boolean = false;

  if (user?.id) {
    gameAlreadyStarted = await checkIfUserInGame(user.id);
  }

  return (
    <div className="animate-fade-slide-in flex flex-col items-center gap-16 px-12">
      <div className="flex flex-col items-center gap-16">
        <h1 className="text-6xl font-bold lg:text-7xl">Spelly</h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-center text-3xl leading-tight! lg:text-4xl">
          The best word game to ever be invented
        </p>
        {!user?.id ? (
          <p className="text-zinc-100">Sign in to start gaming baybee</p>
        ) : (
          <div className="flex-1">
            {gameAlreadyStarted ? <RejoinGameButton /> : <StartJoinGameForm />}
          </div>
        )}
        <div className="via-foreground/10 my-8 w-full bg-linear-to-r from-transparent to-transparent p-px" />
      </div>
    </div>
  );
}
