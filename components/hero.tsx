import { createClient } from "@/utils/supabase/server";
import StartJoinGameForm from "./forms/StartJoinGameForm";

export default async function Hero() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex flex-col gap-16 items-center">
        <h1 className="text-6xl lg:text-7xl font-bold">Spelly</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center text-muted-foreground">
          The best word game to ever be invented
        </p>
        {!user?.id ? (
          <p className="text-zinc-100">Sign in to start gaming baybee</p>
        ) : (
          <div className="flex-1">
            <StartJoinGameForm userID={user.id} />
          </div>
        )}
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      </div>
     </div>
  );
}
