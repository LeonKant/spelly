// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// const connectionString = process.env.DATABASE_URL ?? "";

// console.log("new postgres connection:", connectionString)

// // Disable prefetch as it is not supported for "Transaction" pool mode
// export const client = postgres(connectionString, { prepare: false });
// export const db = drizzle(client);

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare namespace global {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient;

const databaseUrl = process.env.DATABASE_URL ?? "";

if (process.env.NODE_ENV !== "production") {
  if (!global.postgresSqlClient) {
    console.log("new postgres connection:", databaseUrl)
    global.postgresSqlClient = postgres(databaseUrl);
  }
  postgresSqlClient = global.postgresSqlClient;
} else {
  postgresSqlClient = postgres(databaseUrl);
}

export const db = drizzle(postgresSqlClient);
