import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare namespace global {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient;

const databaseUrl = process.env.DATABASE_URL ?? "";

if (process.env.NODE_ENV !== "production") {
  if (!global.postgresSqlClient) {
    global.postgresSqlClient = postgres(databaseUrl, { prepare: false });
  }
  postgresSqlClient = global.postgresSqlClient;
} else {
  postgresSqlClient = postgres(databaseUrl, { prepare: false });
}

export const db = drizzle(postgresSqlClient);
