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
  ]
);

export type SpellyProfileT = typeof profilesInSpelly.$inferSelect;

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
    name: text().default("lobby").notNull(),
    lobbyPlayerIds: uuid("lobby_player_ids").array().default([""]).notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.hostId],
      foreignColumns: [profilesInSpelly.id],
      name: "lobbies_host_id_fkey",
    }),
  ]
);

export type SpellyLobbyInsertT = typeof lobbiesInSpelly.$inferInsert

export type SpellyLobbyT = typeof lobbiesInSpelly.$inferSelect;

export type SpellyLobbySnakeCaseKeysT =
  | "id"
  | "host_id"
  | "current_letter"
  | "current_player"
  | "game_state"
  | "game_started"
  | "name"
  | "lobby_player_ids";

export const SpellySnakeToCamelCaseKeys: Record<
  SpellyLobbySnakeCaseKeysT,
  keyof SpellyLobbyT
> = {
  id: "id",
  host_id: "hostId",
  current_letter: "currentLetter",
  current_player: "currentPlayer",
  game_state: "gameState",
  game_started: "gameStarted",
  name: "name",
  lobby_player_ids: "lobbyPlayerIds",
};

export type LobbyRealtimePayloadT = {
  [key in SpellyLobbySnakeCaseKeysT]: any;
};

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
  ]
);
