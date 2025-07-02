const CLIENT = {
  projectURL: process.env.NEXT_PUBLIC_PROJECT_URL ?? "",
  captchaSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  supabaseURL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
};
const SERVER = {
  cronSecret: process.env.CRON_SECRET ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};

export { CLIENT, SERVER };
