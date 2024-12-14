const CLIENT = {
  projectURL: process.env.NEXT_PUBLIC_PROJECT_URL ?? "",
};
const SERVER = {
  cronSecret: process.env.CRON_SECRET ?? "",
};

export { CLIENT, SERVER };
