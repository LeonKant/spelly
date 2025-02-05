import { getUserName } from "@/db/queries/select";
import { createClient } from "@/utils/supabase/server";
import { ClientSettingsDialog } from "./ClientSettingsDialog";

export async function SettingsDialog() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return;

  const userName = await getUserName(user.id);
  if (!userName) return;

  return <ClientSettingsDialog username={userName} />;
}
