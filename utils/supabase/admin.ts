import { CLIENT, SERVER } from "@/config/var.config";
import { createClient } from "@supabase/supabase-js";

export const createAdminClient = () => {
  return createClient(CLIENT.supabaseURL, SERVER.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
