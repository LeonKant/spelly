import { createClient } from "@/utils/supabase/server";
import { getUserName } from "@/db/queries/select";
import { NavBarSheet } from "./header/NavBarSheet";

export default async function HeaderServerAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user ? await getUserName(user.id) : null;

  return <NavBarSheet signedIn={!!user} userName={userName} />;
}
