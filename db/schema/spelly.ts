import {
  pgTable,
  pgSchema,
  foreignKey,
  uuid,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersInAuth } from "./auth";

export const spelly = pgSchema("spelly");

export const profilesInSpelly = spelly.table(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    username: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [usersInAuth.id],
      name: "profiles_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const lobbiesInSpelly = spelly.table(
  "lobbies",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    hostId: uuid("host_id"),
    currentLetter: integer("current_letter").default(0),
    currentPlayer: integer("current_player").default(0),
    gameState: text("game_state").default(""),
    gameStarted: boolean("game_started").default(false),
    name: text().default("Lobby"),
  },
  (table) => [
    foreignKey({
      columns: [table.hostId],
      foreignColumns: [profilesInSpelly.id],
      name: "lobbies_host_id_fkey",
    }),
  ]
);
