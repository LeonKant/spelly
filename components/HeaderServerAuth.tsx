import { createClient } from "@/utils/supabase/server";
import { getUserName } from "@/db/queries/select";
import { SiteSettings } from "./header/NavSheet";

export default async function HeaderServerAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user ? await getUserName(user.id) : null;

  return <SiteSettings signedIn={!!user} userName={userName} />;
}
