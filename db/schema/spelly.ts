import {
  pgTable,
  pgSchema,
  foreignKey,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersInAuth } from "./auth";

export const spelly = pgSchema("spelly");

export const profilesInSpelly = spelly.table(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    username: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [usersInAuth.id],
      name: "profiles_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const lobbiesInSpelly = spelly.table(
  "lobbies",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    hostId: uuid("host_id").notNull(),
    currentLetter: integer("current_letter").default(0).notNull(),
    currentPlayer: integer("current_player").default(0).notNull(),
    gameState: text("game_state").default("").notNull(),
    gameStarted: boolean("game_started").default(false).notNull(),
    gameOver: boolean("game_over").default(false).notNull(),
    name: text().default("lobby").notNull(),
    lobbyPlayerIds: uuid("lobby_player_ids").array().default([""]).notNull(),
    lastActivity: timestamp("last_activity", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.hostId],
      foreignColumns: [profilesInSpelly.id],
      name: "lobbies_host_id_fkey",
    }),
  ],
);

export const lobbyPlayersInSpelly = spelly.table(
  "lobby_players",
  {
    userId: uuid("user_id").notNull(),
    lobbyId: uuid("lobby_id").notNull(),
    timeJoined: timestamp("time_joined", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    points: integer().default(0).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profilesInSpelly.id],
      name: "lobby_players_user_id_fkey",
    }),
    foreignKey({
      columns: [table.lobbyId],
      foreignColumns: [lobbiesInSpelly.id],
      name: "lobby_players_lobby_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.lobbyId],
      name: "lobby_players_pkey",
    }),
  ],
);

export const lobbyPrevRoundsInSpelly = spelly.table(
  "lobby_prev_rounds",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    lobbyId: uuid("lobby_id").notNull(),
    gameState: text("game_state").notNull(),
    loserUserName: text("loser_user_name").notNull(),
    timeAdded: timestamp("time_added", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.lobbyId],
      foreignColumns: [lobbiesInSpelly.id],
      name: "lobby_prev_rounds_lobby_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const wordsInSpelly = spelly.table("words", {
  id: serial().primaryKey().notNull(),
  word: text().notNull(),
});
