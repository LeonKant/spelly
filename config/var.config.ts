const CLIENT = {
  projectURL: process.env.NEXT_PUBLIC_PROJECT_URL ?? "",
  captchaSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
};
const SERVER = {
  cronSecret: process.env.CRON_SECRET ?? "",
};

export { CLIENT, SERVER };
